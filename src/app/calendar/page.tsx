"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { getRoomById, getReservationsByDate } from "@/data/dummy"

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

export default function CalendarPage() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const days = getMonthDays(currentYear, currentMonth)
  const selectedReservations = selectedDate
    ? getReservationsByDate(selectedDate)
    : []

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1)
      setCurrentMonth(11)
    } else {
      setCurrentMonth((m) => m - 1)
    }
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
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
      <Header title="カレンダー" subtitle="月別の予約状況" />

      <div className="px-4 pt-3 pb-4">
        {/* 月ナビゲーション */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="前月"
            >
              ◀
            </button>
            <div className="text-center">
              <span className="text-lg font-bold text-gray-900">
                {currentMonth + 1}月 カレンダー
              </span>
              <span className="ml-3 text-sm text-gray-500">
                {currentYear}年（{toWareki(currentYear)}）
              </span>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="翌月"
            >
              ▶
            </button>
          </div>

          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {WEEKDAYS.map((day, i) => (
              <div
                key={day}
                className={`py-2 text-center text-xs font-semibold ${
                  i === 0
                    ? "text-red-500 bg-blue-50"
                    : i === 6
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 bg-blue-50"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 日付グリッド */}
          <div className="grid grid-cols-7">
            {days.map((date, i) => {
              if (!date) return <div key={i} className="border-b border-r border-gray-100 p-1 min-h-[3.5rem]" />

              const dateStr = formatDateStr(date)
              const isCurrentMonth = date.getMonth() === currentMonth
              const isToday = dateStr === formatDateStr(today)
              const isSelected = dateStr === selectedDate
              const dayOfWeek = date.getDay()
              const reservationCount = getReservationsByDate(dateStr).length

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`relative border-b border-r border-gray-100 p-1 min-h-[3.5rem] text-left transition-colors ${
                    isSelected
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`text-sm font-medium block ${
                      !isCurrentMonth
                        ? "text-gray-300"
                        : isToday
                          ? "text-white bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          : dayOfWeek === 0
                            ? "text-red-500"
                            : dayOfWeek === 6
                              ? "text-blue-600"
                              : "text-gray-800"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  {isCurrentMonth && reservationCount > 0 && (
                    <div className="mt-0.5 flex gap-0.5 flex-wrap">
                      {Array.from({ length: Math.min(reservationCount, 3) }).map((_, j) => (
                        <span
                          key={j}
                          className="w-1.5 h-1.5 rounded-full bg-blue-500 block"
                        />
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 選択日の予約一覧 */}
        {selectedDate && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {new Date(selectedDate + "T00:00:00").getMonth() + 1}/
              {new Date(selectedDate + "T00:00:00").getDate()}の予約
              （{selectedReservations.length}件）
            </h2>
            {selectedReservations.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-gray-400 text-sm shadow-sm">
                この日の予約はありません
              </div>
            ) : (
              <div className="space-y-3">
                {selectedReservations.map((res) => {
                  const room = getRoomById(res.roomId)
                  return (
                    <div key={res.id} className="flex gap-3">
                      <div className="w-14 shrink-0 text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {res.startTime}
                        </p>
                        <p className="text-xs text-gray-400">{res.endTime}</p>
                      </div>
                      <div className="flex-1 bg-white rounded-xl p-3 shadow-sm border-l-4 border-blue-500">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {res.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {room?.image} {room?.name} ・ {res.organizer} ・{" "}
                          {res.participants}名
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
