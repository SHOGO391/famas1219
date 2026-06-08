"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Loading } from "@/components/loading"
import { EmptyState } from "@/components/empty-state"
import { rooms, getReservationsByRoomId } from "@/data/dummy"
import type { Room } from "@/data/dummy"

export default function RoomsPage() {
  const [data, setData] = useState<readonly Room[] | null>(null)
  const [showEmpty, setShowEmpty] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setData(rooms), 800)
    return () => clearTimeout(timer)
  }, [])

  if (data === null) {
    return (
      <div>
        <Header title="会議室一覧" subtitle="利用可能な会議室" />
        <Loading />
      </div>
    )
  }

  const displayData = showEmpty ? [] : data

  return (
    <div>
      <Header title="会議室一覧" subtitle="利用可能な会議室" />

      <div className="px-4 pt-3 pb-2">
        <button
          onClick={() => setShowEmpty((prev) => !prev)}
          className="text-xs text-blue-600 underline"
        >
          {showEmpty ? "ダミーデータ表示" : "空状態を表示"}
        </button>
      </div>

      {displayData.length === 0 ? (
        <EmptyState
          icon="🚪"
          title="会議室がありません"
          description="現在利用可能な会議室が登録されていません"
        />
      ) : (
        <div className="px-4 pb-4 space-y-3">
          {displayData.map((room) => {
            const resCount = getReservationsByRoomId(room.id).length
            return (
              <div
                key={room.id}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{room.image}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {room.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {room.floor}F
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      定員 {room.capacity}名 ・ 予約 {resCount}件
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {room.equipment.map((eq) => (
                        <span
                          key={eq}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
