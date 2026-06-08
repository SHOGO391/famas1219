"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { LoadingCardList } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { AuthGuard } from "@/components/auth-guard"
import { fetchReservationsByDate } from "@/lib/supabase"
import type { Reservation } from "@/lib/supabase"
import { Users, DoorOpen } from "lucide-react"

function buildDates(): readonly { date: string; label: string; weekday: string }[] {
  const days = ["日", "月", "火", "水", "木", "金", "土"]
  const result: { date: string; label: string; weekday: string }[] = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    result.push({
      date: d.toISOString().slice(0, 10),
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      weekday: days[d.getDay()],
    })
  }
  return result
}

function CalendarContent() {
  const dates = buildDates()
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(dates[0].date)
  const [reservations, setReservations] = useState<readonly Reservation[]>([])
  const [dateCounts, setDateCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    // 全日付の件数を取得
    Promise.all(
      dates.map(async (d) => {
        const res = await fetchReservationsByDate(d.date)
        return { date: d.date, count: res.length }
      })
    ).then((results) => {
      const counts: Record<string, number> = {}
      for (const r of results) {
        counts[r.date] = r.count
      }
      setDateCounts(counts)
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchReservationsByDate(selectedDate)
      .then(setReservations)
      .catch(() => setReservations([]))
      .finally(() => setLoading(false))
  }, [selectedDate])

  return (
    <div>
      <PageHeader title="カレンダー" description="日別の予約状況" />

      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {dates.map((d) => {
            const count = dateCounts[d.date] ?? 0
            const isSelected = selectedDate === d.date
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`shrink-0 flex flex-col items-center min-w-[56px] min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-accent border"
                }`}
              >
                <span className="text-xs opacity-70">{d.weekday}</span>
                <span className="font-semibold">{d.label}</span>
                {count > 0 && (
                  <Badge
                    variant={isSelected ? "secondary" : "default"}
                    className="text-[9px] px-1.5 py-0 mt-0.5 h-4"
                  >
                    {count}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {loading ? (
        <LoadingCardList count={3} />
      ) : reservations.length === 0 ? (
        <EmptyState
          icon="📅"
          title="この日の予約はありません"
          description="別の日を選択するか、新しく予約を作成してください"
        />
      ) : (
        <div className="px-4 pb-6 mt-1">
          <div className="relative space-y-3">
            {reservations.map((res) => (
              <div key={res.id} className="flex gap-3">
                <div className="w-14 shrink-0 text-right pt-1">
                  <p className="text-sm font-semibold">
                    {res.start_time.slice(0, 5)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {res.end_time.slice(0, 5)}
                  </p>
                </div>
                <Card className="flex-1 border-l-4 border-l-primary">
                  <CardContent className="p-3">
                    <p className="font-semibold text-sm truncate">
                      {res.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <DoorOpen className="h-3 w-3" />
                      <span>
                        {res.rooms?.emoji} {res.rooms?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Users className="h-3 w-3" />
                      <span>
                        {res.organizer} ・ {res.participants.length}名
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CalendarPage() {
  return <AuthGuard>{() => <CalendarContent />}</AuthGuard>
}
