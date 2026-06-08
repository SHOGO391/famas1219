"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Loading } from "@/components/loading"
import { EmptyState } from "@/components/empty-state"
import { reservations, getRoomById, getReservationsByDate } from "@/data/dummy"
import type { Reservation } from "@/data/dummy"

const dates = [
  { date: "2026-06-08", label: "6/8（月）" },
  { date: "2026-06-09", label: "6/9（火）" },
  { date: "2026-06-10", label: "6/10（水）" },
  { date: "2026-06-11", label: "6/11（木）" },
  { date: "2026-06-12", label: "6/12（金）" },
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
      <Header title="カレンダー" subtitle="日別の予約状況" />

      <div className="px-4 pt-3 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {dates.map((d) => {
            const count = getReservationsByDate(d.date).length
            const isSelected = selectedDate === d.date
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div>{d.label}</div>
                <div
                  className={`text-xs mt-0.5 ${isSelected ? "text-blue-100" : "text-gray-400"}`}
                >
                  {count}件
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : dayReservations.length === 0 ? (
        <EmptyState
          icon="📅"
          title="予約がありません"
          description="この日はまだ予約が入っていません"
        />
      ) : (
        <div className="px-4 pb-4">
          <div className="relative">
            {dayReservations.map((res) => {
              const room = getRoomById(res.roomId)
              return (
                <div key={res.id} className="flex gap-3 mb-3">
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
        </div>
      )}
    </div>
  )
}
