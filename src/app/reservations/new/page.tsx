"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { rooms } from "@/data/dummy"

type FormData = {
  readonly roomId: string
  readonly title: string
  readonly organizer: string
  readonly date: string
  readonly startTime: string
  readonly endTime: string
  readonly participants: string
}

const initialForm: FormData = {
  roomId: "",
  title: "",
  organizer: "",
  date: "2026-06-10",
  startTime: "10:00",
  endTime: "11:00",
  participants: "2",
}

export default function NewReservationPage() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  function handleReset() {
    setForm(initialForm)
    setSubmitted(false)
  }

  if (submitted) {
    const room = rooms.find((r) => r.id === form.roomId)
    return (
      <div>
        <Header title="予約作成" subtitle="新しい予約を登録" />
        <div className="px-4 py-8 text-center">
          <span className="text-5xl block mb-4">✅</span>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            予約が完了しました
          </h2>
          <div className="bg-white rounded-xl p-4 shadow-sm text-left mt-4 text-sm space-y-1">
            <p>
              <span className="text-gray-500">会議室:</span>{" "}
              {room?.image} {room?.name ?? "未選択"}
            </p>
            <p>
              <span className="text-gray-500">タイトル:</span> {form.title}
            </p>
            <p>
              <span className="text-gray-500">日時:</span> {form.date}{" "}
              {form.startTime}〜{form.endTime}
            </p>
            <p>
              <span className="text-gray-500">主催者:</span> {form.organizer}
            </p>
            <p>
              <span className="text-gray-500">参加者:</span>{" "}
              {form.participants}名
            </p>
          </div>
          <button
            onClick={handleReset}
            className="mt-6 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            続けて予約する
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="予約作成" subtitle="新しい予約を登録" />

      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            会議室 *
          </label>
          <select
            value={form.roomId}
            onChange={(e) => updateField("roomId", e.target.value)}
            required
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">選択してください</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.image} {room.name}（定員{room.capacity}名・{room.floor}F）
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            タイトル *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
            placeholder="例: 週次定例ミーティング"
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            主催者 *
          </label>
          <input
            type="text"
            value={form.organizer}
            onChange={(e) => updateField("organizer", e.target.value)}
            required
            placeholder="例: 田中太郎"
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            日付 *
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
            required
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              開始 *
            </label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => updateField("startTime", e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              終了 *
            </label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => updateField("endTime", e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            参加人数 *
          </label>
          <input
            type="number"
            value={form.participants}
            onChange={(e) => updateField("participants", e.target.value)}
            required
            min="1"
            max="50"
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          予約を確定する
        </button>
      </form>
    </div>
  )
}
