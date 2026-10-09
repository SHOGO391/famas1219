import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { createSessionAuth } from "./auth-session"
export type { AuthUser } from "./auth-session"

let client: SupabaseClient | undefined
let sessionAuth: ReturnType<typeof createSessionAuth> | undefined

export function getClient(): SupabaseClient {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error("Supabase configuration is missing. See app/.env.example.")
  client = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  })
  return client
}

function auth() {
  return sessionAuth ??= createSessionAuth(getClient(), typeof window === "undefined" ? undefined : window.localStorage)
}
export const getCurrentUser = () => auth().currentUser()
export const authSignIn = (email: string, password: string) => auth().signIn(email, password)
export const authSignUp = (email: string, password: string) => auth().signUp(email, password)
export const authSignOut = () => auth().signOut()
export const onAuthChange = (callback: Parameters<ReturnType<typeof createSessionAuth>["subscribe"]>[0]) => auth().subscribe(callback)

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
  const user = await getCurrentUser()
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

export async function fetchReservationsByMonth(
  year: number,
  month: number
): Promise<readonly Reservation[]> {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`
  const lastDay = new Date(year, month + 1, 0).getDate()
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`

  const client = getClient()
  const { data, error } = await client
    .from("reservations")
    .select("*, rooms(id, name, emoji), participants(id, name)")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("start_time")

  if (error) throw new Error(error.message)
  return data ?? []
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
