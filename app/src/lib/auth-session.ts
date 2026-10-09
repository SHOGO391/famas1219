import type { SupabaseClient, User } from "@supabase/supabase-js"

export type AuthUser = { readonly id: string; readonly email: string }
const asUser = (user: User): AuthUser => ({ id: user.id, email: user.email ?? "" })

export function createSessionAuth(client: SupabaseClient, storage?: Pick<Storage, "getItem" | "removeItem">) {
  let initialization: Promise<void> | undefined
  const initialize = () => initialization ??= (async () => {
    const { data, error } = await client.auth.getSession()
    if (error) throw error
    const access_token = storage?.getItem("sb-access-token")
    const refresh_token = storage?.getItem("sb-refresh-token")
    if (!data.session && access_token && refresh_token) {
      // Let the SDK validate/refresh the old session; never trust the old sb-user JSON.
      const migrated = await client.auth.setSession({ access_token, refresh_token })
      if (migrated.error) throw migrated.error
    }
    for (const key of ["sb-access-token", "sb-refresh-token", "sb-user"]) storage?.removeItem(key)
  })().catch(error => { initialization = undefined; throw error })

  return {
    async currentUser(): Promise<AuthUser | null> {
      await initialize()
      const { data: session, error: sessionError } = await client.auth.getSession()
      if (sessionError) throw sessionError
      if (!session.session) return null
      const { data, error } = await client.auth.getUser()
      if (error) throw error
      return data.user ? asUser(data.user) : null
    },
    async signIn(email: string, password: string): Promise<AuthUser> {
      // Signing in must remain possible if an old session is expired/revoked.
      const { data, error } = await client.auth.signInWithPassword({ email, password })
      if (error) throw error
      await initialize()
      return asUser(data.user)
    },
    async signUp(email: string, password: string): Promise<AuthUser | null> {
      const { data, error } = await client.auth.signUp({ email, password })
      if (error) throw error
      if (!data.session) return null // Email confirmation is required.
      await initialize()
      return asUser(data.user!)
    },
    async signOut(): Promise<void> {
      await initialize()
      // Revoke refresh sessions server-side and let the SDK clear its storage.
      const { error } = await client.auth.signOut({ scope: "global" })
      if (error) throw error
    },
    subscribe(callback: (user: AuthUser | null) => void) {
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        callback(session?.user ? asUser(session.user) : null)
      })
      return () => data.subscription.unsubscribe()
    },
  }
}
