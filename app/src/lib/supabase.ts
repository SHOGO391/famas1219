import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
