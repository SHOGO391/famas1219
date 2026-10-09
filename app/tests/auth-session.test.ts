import test, { type TestContext } from "node:test"
import assert from "node:assert/strict"
import { createClient, type User } from "@supabase/supabase-js"
import { createSessionAuth } from "../src/lib/auth-session"

const user = { id: "11111111-1111-4111-8111-111111111111", email: "user@example.invalid",
  aud: "authenticated", role: "authenticated", app_metadata: {}, user_metadata: {},
  created_at: "2026-01-01T00:00:00Z" } satisfies User
const token = (expires: number) => [
  { alg: "HS256", typ: "JWT" }, { sub: user.id, exp: expires, role: "authenticated" },
].map(v => Buffer.from(JSON.stringify(v)).toString("base64url")).join(".") + ".synthetic-signature"

function fixture(t: TestContext) {
  const memory = new Map<string, string>()
  const storage = { getItem: (k: string) => memory.get(k) ?? null,
    setItem: (k: string, v: string) => { memory.set(k, v) }, removeItem: (k: string) => { memory.delete(k) } }
  const requests: { url: string; headers: Headers; body: string }[] = []
  let failLogout = false, confirmationRequired = false
  const session = { access_token: token(Math.floor(Date.now() / 1000) + 3600),
    refresh_token: "synthetic-refresh", expires_in: 3600, token_type: "bearer", user }
  const client = createClient("https://auth-test.example.invalid", "synthetic-public-key", {
    auth: { storage, storageKey: "test-sdk-session", persistSession: true, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (input, init) => {
      const url = String(input), headers = new Headers(init?.headers), body = String(init?.body ?? "")
      requests.push({ url, headers, body })
      if (url.includes("/logout")) return failLogout
        ? new Response(JSON.stringify({ message: "temporary failure" }), { status: 500 })
        : new Response(null, { status: 204 })
      const data = url.includes("/rest/v1/") ? [] : url.includes("/user") ? user
        : url.includes("/signup") && confirmationRequired ? user : session
      return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } })
    } },
  })
  t.after(() => client.auth.stopAutoRefresh())
  return { client, memory, storage, requests, session, auth: createSessionAuth(client, storage),
    failLogout: () => { failLogout = true }, confirmationRequired: () => { confirmationRequired = true } }
}

test("expired legacy tokens refresh through SDK; stored user JSON is not trusted", async t => {
  const f = fixture(t)
  f.memory.set("sb-access-token", token(1)); f.memory.set("sb-refresh-token", "old-synthetic-refresh")
  f.memory.set("sb-user", JSON.stringify({ id: "forged-local-user" }))
  assert.deepEqual(await f.auth.currentUser(), { id: user.id, email: user.email })
  assert(f.requests.some(r => r.url.includes("grant_type=refresh_token") && r.body.includes("old-synthetic-refresh")))
  for (const key of ["sb-user", "sb-access-token", "sb-refresh-token"]) assert.equal(f.memory.has(key), false)
  assert(f.memory.has("test-sdk-session"))
  await f.client.from("rooms").select("id")
  assert.equal(f.requests.find(r => r.url.includes("/rest/v1/"))?.headers.get("Authorization"), "Bearer " + f.session.access_token)
})

test("sign-out calls the auth server with global scope and clears SDK session", async t => {
  const f = fixture(t)
  await f.auth.signIn(user.email, " password-with-spaces ")
  assert.equal(JSON.parse(f.requests.find(r => r.url.includes("grant_type=password"))!.body).password, " password-with-spaces ")
  await f.auth.signOut()
  assert(f.requests.some(r => r.url.endsWith("/logout?scope=global") && r.headers.get("Authorization") === "Bearer " + f.session.access_token))
  assert.equal((await f.client.auth.getSession()).data.session, null)
  assert.equal(f.memory.has("test-sdk-session"), false)
})

test("failed remote revocation is reported even though the SDK clears local storage", async t => {
  const f = fixture(t)
  await f.auth.signIn(user.email, "password"); f.failLogout()
  await assert.rejects(f.auth.signOut(), /temporary failure/)
  assert.equal((await f.client.auth.getSession()).data.session, null)
})

test("email confirmation signup does not report a logged-in user", async t => {
  const f = fixture(t); f.confirmationRequired()
  assert.equal(await f.auth.signUp(user.email, "password"), null)
  assert.equal(await f.auth.currentUser(), null)
})

test("SDK auth changes propagate and unsubscribing removes the listener", async t => {
  const f = fixture(t), changes: (string | null)[] = []
  const unsubscribe = f.auth.subscribe(value => changes.push(value?.id ?? null))
  await f.auth.signIn(user.email, "password"); assert(changes.includes(user.id))
  await f.auth.signOut(); assert.equal(changes.at(-1), null)
  unsubscribe(); const count = changes.length
  await f.auth.signIn(user.email, "password"); assert.equal(changes.length, count)
})
