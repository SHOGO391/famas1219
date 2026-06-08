import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://fvassyordqyowvvcmwhh.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2YXNzeW9yZHF5b3d2dmNtd2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDA3NDMsImV4cCI6MjA5NjQ3Njc0M30.btLVTT4SPUwQYH-z11MmuAYL1pO-J5hwV5I47Q7k304"

let _supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY
    _supabase = createClient(url, key)
  }
  return _supabase
}

export const supabase = getSupabase()

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
  const { data, error } = await supabase
    .from("rooms")
    .select("*, equipment(id, name)")
    .order("floor")

  if (error) throw new Error(error.message)
  return data ?? []
}

// ---------- Reservations ----------

export async function fetchMyReservations(): Promise<readonly Reservation[]> {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("ログインが必要です")

  const { data: reservation, error } = await supabase
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
    const { error: pError } = await supabase.from("participants").insert(
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
  const { error } = await supabase.from("reservations").delete().eq("id", id)
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
  const { error } = await supabase
    .from("reservations")
    .update(updates)
    .eq("id", id)
  if (error) throw new Error(error.message)
}
