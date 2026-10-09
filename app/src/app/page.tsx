"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DoorOpen,
  PlusCircle,
  ClipboardList,
  CalendarDays,
  Users,
  Clock,
  LogOut,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { RoomImage } from "@/components/room-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { LoadingCardList } from "@/components/loading-state"
import { AuthGuard } from "@/components/auth-guard"
import { authSignOut, fetchMyReservations } from "@/lib/supabase"
import type { Reservation } from "@/lib/supabase"

const quickActions = [
  { href: "/rooms", label: "会議室一覧", icon: DoorOpen },
  { href: "/reservations/new", label: "新規予約", icon: PlusCircle },
  { href: "/reservations", label: "予約一覧", icon: ClipboardList },
  { href: "/calendar", label: "カレンダー", icon: CalendarDays },
] as const

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

function HomeContent() {
  const [reservations, setReservations] = useState<readonly Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchMyReservations()
      .then(setReservations)
      .catch(() => setReservations([]))
      .finally(() => setLoading(false))
  }, [])

  const today = todayString()
  const todayReservations = reservations.filter((r) => r.date === today)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await authSignOut()
      router.replace("/login")
    } catch {
      router.replace("/login?logout=unconfirmed")
    } finally { setLoggingOut(false) }
  }

  return (
    <div>
      <PageHeader title="会議室予約" description="今日の予約状況を確認" />

      <div className="px-4 pt-2 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-xs text-muted-foreground"
        >
          <LogOut className="h-3.5 w-3.5 mr-1" />
          ログアウト
        </Button>
      </div>


      <section className="px-4 py-2">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          今日の予約（{loading ? "..." : todayReservations.length}件）
        </h2>
        {loading ? (
          <LoadingCardList count={2} />
        ) : todayReservations.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <span className="text-3xl block mb-2">☀️</span>
              <p className="font-medium text-sm">今日の予約はありません</p>
              <p className="text-xs text-muted-foreground mt-1">
                のんびりした一日です
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {todayReservations.map((res) => (
              <Card key={res.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{res.title}</p>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {res.start_time.slice(0, 5)}〜
                          {res.end_time.slice(0, 5)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                        {res.rooms?.emoji && (
                          <RoomImage emoji={res.rooms.emoji} name={res.rooms.name ?? ""} size="sm" />
                        )}
                        <span>{res.rooms?.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Users className="h-3 w-3 shrink-0" />
                        <span>
                          {res.organizer} ・ {res.participants.length}名
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      予約済
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="px-4 py-2 pb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          クイックアクション
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <Card className="hover:bg-accent transition-colors cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default function HomePage() {
  return <AuthGuard>{() => <HomeContent />}</AuthGuard>
}
