export type Room = {
  readonly id: string
  readonly name: string
  readonly capacity: number
  readonly floor: number
  readonly equipment: readonly string[]
  readonly emoji: string
}

export type Reservation = {
  readonly id: string
  readonly roomId: string
  readonly title: string
  readonly organizer: string
  readonly date: string
  readonly startTime: string
  readonly endTime: string
  readonly participants: number
}

export const rooms: readonly Room[] = [
  {
    id: "room-1",
    name: "さくら",
    capacity: 6,
    floor: 3,
    equipment: ["モニター", "ホワイトボード"],
    emoji: "🌸",
  },
  {
    id: "room-2",
    name: "ふじ",
    capacity: 10,
    floor: 3,
    equipment: ["プロジェクター", "ホワイトボード", "電話会議"],
    emoji: "🗻",
  },
  {
    id: "room-3",
    name: "たけ",
    capacity: 4,
    floor: 4,
    equipment: ["モニター"],
    emoji: "🎋",
  },
  {
    id: "room-4",
    name: "うめ",
    capacity: 8,
    floor: 4,
    equipment: ["プロジェクター", "ホワイトボード"],
    emoji: "🌺",
  },
  {
    id: "room-5",
    name: "まつ",
    capacity: 20,
    floor: 5,
    equipment: ["プロジェクター", "マイク", "スピーカー", "ホワイトボード"],
    emoji: "🌲",
  },
]

export const reservations: readonly Reservation[] = [
  {
    id: "res-1",
    roomId: "room-1",
    title: "週次定例ミーティング",
    organizer: "田中太郎",
    date: "2026-06-08",
    startTime: "10:00",
    endTime: "11:00",
    participants: 5,
  },
  {
    id: "res-2",
    roomId: "room-2",
    title: "プロジェクトキックオフ",
    organizer: "佐藤花子",
    date: "2026-06-08",
    startTime: "13:00",
    endTime: "14:30",
    participants: 8,
  },
  {
    id: "res-3",
    roomId: "room-5",
    title: "全体ミーティング",
    organizer: "鈴木一郎",
    date: "2026-06-09",
    startTime: "15:00",
    endTime: "16:00",
    participants: 18,
  },
  {
    id: "res-4",
    roomId: "room-3",
    title: "1on1",
    organizer: "高橋美咲",
    date: "2026-06-09",
    startTime: "09:00",
    endTime: "09:30",
    participants: 2,
  },
  {
    id: "res-5",
    roomId: "room-4",
    title: "デザインレビュー",
    organizer: "山田健太",
    date: "2026-06-10",
    startTime: "11:00",
    endTime: "12:00",
    participants: 6,
  },
]

export function getRoomById(id: string): Room | undefined {
  return rooms.find((r) => r.id === id)
}

export function getReservationsByRoomId(
  roomId: string
): readonly Reservation[] {
  return reservations.filter((r) => r.roomId === roomId)
}

export function getReservationsByDate(date: string): readonly Reservation[] {
  return reservations.filter((r) => r.date === date)
}
