"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { AuthGuard } from "@/components/auth-guard"
import { fetchReservationsByMonth } from "@/lib/supabase"
import type { Reservation } from "@/lib/supabase"
import { ChevronLeft, ChevronRight, Users } from "lucide-react"
import { RoomImage } from "@/components/room-image"

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const

function getMonthDays(year: number, month: number): readonly (Date | null)[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const prevMonthLastDay = new Date(year, month, 0).getDate()
  const cells: (Date | null)[] = []

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    cells.push(new Date(year, month - 1, prevMonthLastDay - i))
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d))
  }

  const remaining = 7 - (cells.length % 7)
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push(new Date(year, month + 1, d))
    }
  }

  return cells
}

function formatDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function toWareki(year: number): string {
  if (year >= 2019) {
    return `令和${year - 2018}年`
  }
  return `平成${year - 1988}年`
}

function CalendarContent() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [reservations, setReservations] = useState<readonly Reservation[]>([])
  const [loading, setLoading] = useState(true)

  const days = getMonthDays(currentYear, currentMonth)

  useEffect(() => {
    let active = true
    fetchReservationsByMonth(currentYear, currentMonth)
      .then(rows => { if (active) setReservations(rows) })
      .catch(() => { if (active) setReservations([]) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [currentYear, currentMonth])

  const reservationsByDate = useMemo(() => {
    const map: Record<string, readonly Reservation[]> = {}
    for (const r of reservations) {
      const existing = map[r.date] ?? []
      map[r.date] = [...existing, r]
    }
    return map
  }, [reservations])

  const selectedReservations = selectedDate
    ? (reservationsByDate[selectedDate] ?? [])
    : []

  const handlePrevMonth = () => {
    setLoading(true)
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1)
      setCurrentMonth(11)
    } else {
      setCurrentMonth((m) => m - 1)
    }
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
    setLoading(true)
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1)
      setCurrentMonth(0)
    } else {
      setCurrentMonth((m) => m + 1)
    }
    setSelectedDate(null)
  }

  return (
    <div>
      <PageHeader title="カレンダー" description="月別の予約状況" />

      <div className="px-4 pt-3 pb-4">
        {/* 月間カレンダー */}
        <Card>
          <CardContent className="p-0">
            {/* 月ナビゲーション */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="前月"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-center">
                <span className="text-lg font-bold">
                  {currentMonth + 1}月
                </span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {currentYear}年（{toWareki(currentYear)}）
                </span>
              </div>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="翌月"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/40">
              {WEEKDAYS.map((day, i) => (
                <div
                  key={day}
                  className={`py-2 text-center text-xs font-semibold ${
                    i === 0
                      ? "text-red-500"
                      : i === 6
                        ? "text-blue-600"
                        : "text-muted-foreground"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 日付グリッド */}
            {loading ? (
              <div className="py-16 flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="grid grid-cols-7">
                {days.map((date, i) => {
                  if (!date) {
                    return (
                      <div
                        key={i}
                        className="border-b border-r border-border/50 p-1 min-h-[3.2rem]"
                      />
                    )
                  }

                  const dateStr = formatDateStr(date)
                  const isCurrentMonth = date.getMonth() === currentMonth
                  const isToday = dateStr === formatDateStr(today)
                  const isSelected = dateStr === selectedDate
                  const dayOfWeek = date.getDay()
                  const count = (reservationsByDate[dateStr] ?? []).length

                  return (
                    <button
                      key={i}
                      onClick={() =>
                        setSelectedDate(isSelected ? null : dateStr)
                      }
                      className={`relative border-b border-r border-border/50 p-1 min-h-[3.2rem] text-left transition-colors ${
                        isSelected
                          ? "bg-primary/10"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <span
                        className={`text-sm block w-6 h-6 leading-6 text-center ${
                          !isCurrentMonth
                            ? "text-muted-foreground/30"
                            : isToday
                              ? "text-primary-foreground bg-primary rounded-full font-bold text-xs"
                              : dayOfWeek === 0
                                ? "text-red-500 font-medium"
                                : dayOfWeek === 6
                                  ? "text-blue-600 font-medium"
                                  : "text-foreground"
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      {isCurrentMonth && count > 0 && (
                        <div className="mt-0.5 flex gap-0.5 flex-wrap px-0.5">
                          {Array.from({
                            length: Math.min(count, 3),
                          }).map((_, j) => (
                            <span
                              key={j}
                              className="w-1.5 h-1.5 rounded-full bg-primary block"
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 選択日の予約一覧 */}
        {selectedDate && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {new Date(selectedDate + "T00:00:00").getMonth() + 1}/
              {new Date(selectedDate + "T00:00:00").getDate()}の予約
              （{selectedReservations.length}件）
            </h2>
            {selectedReservations.length === 0 ? (
              <EmptyState
                icon="📅"
                title="この日の予約はありません"
                description="別の日を選択するか、新しく予約を作成してください"
              />
            ) : (
              <div className="space-y-3">
                {selectedReservations.map((res) => (
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
                          {res.rooms?.emoji && (
                            <RoomImage emoji={res.rooms.emoji} name={res.rooms.name ?? ""} size="sm" />
                          )}
                          <span>{res.rooms?.name}</span>
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
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CalendarPage() {
  return <AuthGuard>{() => <CalendarContent />}</AuthGuard>
}
