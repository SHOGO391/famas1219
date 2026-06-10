"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/page-header"
import { LoadingCardList } from "@/components/loading-state"
import { AuthGuard } from "@/components/auth-guard"
import { fetchRooms, createReservation } from "@/lib/supabase"
import type { Room } from "@/lib/supabase"
import {
  CheckCircle2,
  DoorOpen,
  Clock,
  Users,
  User,
  Tag,
  Loader2,
} from "lucide-react"
import { RoomImage } from "@/components/room-image"

type FormData = {
  readonly roomId: string
  readonly title: string
  readonly organizer: string
  readonly date: string
  readonly startTime: string
  readonly endTime: string
  readonly participants: string
}

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

const initialForm: FormData = {
  roomId: "",
  title: "",
  organizer: "",
  date: todayString(),
  startTime: "10:00",
  endTime: "11:00",
  participants: "2",
}

function NewReservationContent() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [rooms, setRooms] = useState<readonly Room[]>([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchRooms()
      .then(setRooms)
      .catch(() => setRooms([]))
      .finally(() => setLoadingRooms(false))
  }, [])

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const count = parseInt(form.participants, 10) || 1
      const participantNames = Array.from({ length: count }, (_, i) => `参加者${i + 1}`)

      await createReservation({
        room_id: form.roomId,
        title: form.title,
        organizer: form.organizer,
        date: form.date,
        start_time: form.startTime,
        end_time: form.endTime,
        participantNames,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "予約に失敗しました")
    } finally {
      setSubmitting(false)
    }
  }

  function handleReset() {
    setForm({ ...initialForm, date: todayString() })
    setSubmitted(false)
    setError("")
  }

  if (submitted) {
    const room = rooms.find((r) => r.id === form.roomId)
    return (
      <div>
        <PageHeader title="予約作成" description="新しい予約を登録" />
        <div className="px-4 py-8 flex flex-col items-center lg:max-w-xl lg:mx-auto">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-lg font-bold mb-1">予約が完了しました</h2>
          <p className="text-sm text-muted-foreground mb-6">
            データベースに保存されました
          </p>

          <Card className="w-full">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <DoorOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-16 shrink-0">会議室</span>
                <span className="font-medium flex items-center gap-1.5">
                  {room?.emoji && <RoomImage emoji={room.emoji} name={room.name} size="sm" />}
                  {room?.name ?? "未選択"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-16 shrink-0">タイトル</span>
                <span className="font-medium truncate">{form.title}</span>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-16 shrink-0">日時</span>
                <span className="font-medium truncate">
                  {form.date} {form.startTime}〜{form.endTime}
                </span>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-16 shrink-0">主催者</span>
                <span className="font-medium">{form.organizer}</span>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-16 shrink-0">参加者</span>
                <span className="font-medium">{form.participants}名</span>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleReset} className="w-full mt-6 h-12">
            続けて予約する
          </Button>
        </div>
      </div>
    )
  }

  if (loadingRooms) {
    return (
      <div>
        <PageHeader title="予約作成" description="新しい予約を登録" />
        <LoadingCardList count={3} />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="予約作成" description="新しい予約を登録" />

      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-5 lg:max-w-xl lg:mx-auto">
        <div className="space-y-2">
          <Label htmlFor="room">会議室 *</Label>
          <select
            id="room"
            value={form.roomId}
            onChange={(e) => updateField("roomId", e.target.value)}
            required
            className="h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
          >
            <option value="" disabled>選択してください</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}（{room.capacity}名・{room.floor}F）
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">タイトル *</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
            placeholder="例: 週次定例ミーティング"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer">主催者 *</Label>
          <Input
            id="organizer"
            value={form.organizer}
            onChange={(e) => updateField("organizer", e.target.value)}
            required
            placeholder="例: 田中太郎"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">日付 *</Label>
          <Input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
            required
            className="h-11"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="start">開始 *</Label>
            <Input
              id="start"
              type="time"
              value={form.startTime}
              onChange={(e) => updateField("startTime", e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end">終了 *</Label>
            <Input
              id="end"
              type="time"
              value={form.endTime}
              onChange={(e) => updateField("endTime", e.target.value)}
              required
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="participants">参加人数 *</Label>
          <Input
            id="participants"
            type="number"
            value={form.participants}
            onChange={(e) => updateField("participants", e.target.value)}
            required
            min="1"
            max="50"
            className="h-11"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-12 text-base"
          disabled={submitting}
        >
          {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          予約を確定する
        </Button>
      </form>
    </div>
  )
}

export default function NewReservationPage() {
  return <AuthGuard>{() => <NewReservationContent />}</AuthGuard>
}
