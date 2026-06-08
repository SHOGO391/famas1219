"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Loading } from "@/components/loading"
import { EmptyState } from "@/components/empty-state"
import { reservations, getRoomById } from "@/data/dummy"
import type { Reservation } from "@/data/dummy"

export default function ReservationsPage() {
  const [data, setData] = useState<readonly Reservation[] | null>(null)
  const [showEmpty, setShowEmpty] = useState(false)
  const [cancelledIds, setCancelledIds] = useState<ReadonlySet<string>>(
    new Set()
  )

  useEffect(() => {
    const timer = setTimeout(() => setData(reservations), 800)
    return () => clearTimeout(timer)
  }, [])

  function handleCancel(id: string) {
    if (window.confirm("この予約をキャンセルしますか？")) {
      setCancelledIds((prev) => new Set([...prev, id]))
    }
  }

  if (data === null) {
    return (
      <div>
        <Header title="予約一覧" subtitle="すべての予約" />
        <Loading />
      </div>
    )
  }

  const activeData = showEmpty
    ? []
    : data.filter((r) => !cancelledIds.has(r.id))

  return (
    <div>
      <Header title="予約一覧" subtitle="すべての予約" />

      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <button
          onClick={() => setShowEmpty((prev) => !prev)}
          className="text-xs text-blue-600 underline"
        >
          {showEmpty ? "ダミーデータ表示" : "空状態を表示"}
        </button>
        <span className="text-xs text-gray-400">{activeData.length}件</span>
      </div>

      {activeData.length === 0 ? (
        <EmptyState
          icon="📋"
          title="予約がありません"
          description="まだ予約が登録されていません。新規予約から会議室を予約できます"
        />
      ) : (
        <div className="px-4 pb-4 space-y-3">
          {activeData.map((res) => {
            const room = getRoomById(res.roomId)
            return (
              <div
                key={res.id}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">
                      {res.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {room?.image} {room?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {res.date} {res.startTime}〜{res.endTime}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {res.organizer} ・ {res.participants}名
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancel(res.id)}
                    className="shrink-0 ml-2 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
