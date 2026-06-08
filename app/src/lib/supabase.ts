import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://fvassyordqyowvvcmwhh.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2YXNzeW9yZHF5b3d2dmNtd2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDA3NDMsImV4cCI6MjA5NjQ3Njc0M30.btLVTT4SPUwQYH-z11MmuAYL1pO-J5hwV5I47Q7k304"

// ---------- 認証（直接REST API） ----------

const TOKEN_KEY = "sb-access-token"
const REFRESH_KEY = "sb-refresh-token"
const USER_KEY = "sb-user"

function authHeaders(token?: string): Record<string, string> {
  const t = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null)
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
  }
  if (t) {
    headers["Authorization"] = "Bearer " + t
  }
  return headers
}

export type AuthUser = {
  readonly id: string
  readonly email: string
}

export async function authSignUp(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(SUPABASE_URL + "/auth/v1/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.msg || "登録に失敗しました")
  if (data.access_token) {
    localStorage.setItem(TOKEN_KEY, data.access_token)
    localStorage.setItem(REFRESH_KEY, data.refresh_token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  }
  return data.user
}

export async function authSignIn(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(SUPABASE_URL + "/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.msg || data.error_description || "ログインに失敗しました")
  localStorage.setItem(TOKEN_KEY, data.access_token)
  localStorage.setItem(REFRESH_KEY, data.refresh_token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  return data.user
}

export function authSignOut(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

// ---------- Supabaseデータクライアント（認証トークン付きfetch） ----------

function createAuthClient(): SupabaseClient {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: token ? { Authorization: "Bearer " + token } : {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export function getClient(): SupabaseClient {
  return createAuthClient()
}

// ---------- 型定義 ----------

export type Room = {
  readonly id: string
  readonly name: string
  readonly capacity: number
  readonly floor: number
  readonly emoji: string
  readonly equipment: readonly { readonly id: string; readonly name: string }[]
}

export type Reservation = {
  readonly id: string
  readonly room_id: string
  readonly user_id: string
  readonly title: string
  readonly organizer: string
  readonly date: string
  readonly start_time: string
  readonly end_time: string
  readonly created_at: string
  readonly rooms?: {
    readonly id: string
    readonly name: string
    readonly emoji: string
  }
  readonly participants: readonly { readonly id: string; readonly name: string }[]
}

// ---------- Rooms ----------

export async function fetchRooms(): Promise<readonly Room[]> {
  const client = getClient()
  const { data, error } = await client
    .from("rooms")
    .select("*, equipment(id, name)")
    .order("floor")

  if (error) throw new Error(error.message)
  return data ?? []
}

// ---------- Reservations ----------

export async function fetchMyReservations(): Promise<readonly Reservation[]> {
  const client = getClient()
  const { data, error } = await client
    .from("reservations")
    .select("*, rooms(id, name, emoji), participants(id, name)")
    .order("date")
    .order("start_time")

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function fetchReservationsByDate(
  date: string
): Promise<readonly Reservation[]> {
  const client = getClient()
  const { data, error } = await client
    .from("reservations")
    .select("*, rooms(id, name, emoji), participants(id, name)")
    .eq("date", date)
    .order("start_time")

  if (error) throw new Error(error.message)
  return data ?? []
}

export type CreateReservationInput = {
  readonly room_id: string
  readonly title: string
  readonly organizer: string
  readonly date: string
  readonly start_time: string
  readonly end_time: string
  readonly participantNames: readonly string[]
}

export async function createReservation(
  input: CreateReservationInput
): Promise<Reservation> {
  const user = getStoredUser()
  if (!user) throw new Error("ログインが必要です")

  const client = getClient()
  const { data: reservation, error } = await client
    .from("reservations")
    .insert({
      room_id: input.room_id,
      user_id: user.id,
      title: input.title,
      organizer: input.organizer,
      date: input.date,
      start_time: input.start_time,
      end_time: input.end_time,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  if (input.participantNames.length > 0) {
    const { error: pError } = await client.from("participants").insert(
      input.participantNames.map((name) => ({
        reservation_id: reservation.id,
        name,
      }))
    )
    if (pError) throw new Error(pError.message)
  }

  return reservation
}

export async function deleteReservation(id: string): Promise<void> {
  const client = getClient()
  const { error } = await client.from("reservations").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function updateReservation(
  id: string,
  updates: {
    readonly title?: string
    readonly organizer?: string
    readonly date?: string
    readonly start_time?: string
    readonly end_time?: string
    readonly room_id?: string
  }
): Promise<void> {
  const client = getClient()
  const { error } = await client
    .from("reservations")
    .update(updates)
    .eq("id", id)
  if (error) throw new Error(error.message)
}
