import Link from "next/link"
import { Header } from "@/components/header"
import { rooms, reservations } from "@/data/dummy"

const todayStr = "2026-06-08"

export default function HomePage() {
  const todayReservations = reservations.filter((r) => r.date === todayStr)

  return (
    <div>
      <Header title="会議室予約" subtitle="今日の予約状況を確認できます" />

      <section className="px-4 py-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          今日の予約（{todayReservations.length}件）
        </h2>
        {todayReservations.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center text-gray-400 text-sm">
            今日の予約はありません
          </div>
        ) : (
          <div className="space-y-3">
            {todayReservations.map((res) => {
              const room = rooms.find((r) => r.id === res.roomId)
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
                        {room?.image} {room?.name} ・ {res.startTime}〜
                        {res.endTime}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {res.organizer} ・ {res.participants}名
                      </p>
                    </div>
                    <span className="shrink-0 ml-2 px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                      予約済
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="px-4 py-2">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          クイックアクション
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/rooms"
            className="bg-white rounded-xl p-4 shadow-sm text-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl block mb-1">🚪</span>
            <span className="text-sm font-medium text-gray-700">
              会議室一覧
            </span>
          </Link>
          <Link
            href="/reservations/new"
            className="bg-white rounded-xl p-4 shadow-sm text-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl block mb-1">➕</span>
            <span className="text-sm font-medium text-gray-700">
              新規予約
            </span>
          </Link>
          <Link
            href="/reservations"
            className="bg-white rounded-xl p-4 shadow-sm text-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl block mb-1">📋</span>
            <span className="text-sm font-medium text-gray-700">
              予約一覧
            </span>
          </Link>
          <Link
            href="/calendar"
            className="bg-white rounded-xl p-4 shadow-sm text-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl block mb-1">📅</span>
            <span className="text-sm font-medium text-gray-700">
              カレンダー
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
