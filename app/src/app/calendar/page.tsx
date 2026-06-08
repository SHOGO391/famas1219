"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { LoadingCardList } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { getReservationsByDate, getRoomById } from "@/data/dummy"
import { Users, DoorOpen } from "lucide-react"

const dates = [
  { date: "2026-06-08", label: "6/8", weekday: "月" },
  { date: "2026-06-09", label: "6/9", weekday: "火" },
  { date: "2026-06-10", label: "6/10", weekday: "水" },
  { date: "2026-06-11", label: "6/11", weekday: "木" },
  { date: "2026-06-12", label: "6/12", weekday: "金" },
] as const

export default function CalendarPage() {
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("2026-06-08")

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [selectedDate])

  const dayReservations = getReservationsByDate(selectedDate)

  return (
    <div>
      <PageHeader title="カレンダー" description="日別の予約状況" />

      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {dates.map((d) => {
            const count = getReservationsByDate(d.date).length
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
      ) : dayReservations.length === 0 ? (
        <EmptyState
          icon="📅"
          title="この日の予約はありません"
          description="別の日を選択するか、新しく予約を作成してください"
        />
      ) : (
        <div className="px-4 pb-6 mt-1">
          <div className="relative space-y-3">
            {dayReservations.map((res) => {
              const room = getRoomById(res.roomId)
              return (
                <div key={res.id} className="flex gap-3">
                  <div className="w-14 shrink-0 text-right pt-1">
                    <p className="text-sm font-semibold">{res.startTime}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {res.endTime}
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
                          {room?.emoji} {room?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Users className="h-3 w-3" />
                        <span>
                          {res.organizer} ・ {res.participants}名
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
