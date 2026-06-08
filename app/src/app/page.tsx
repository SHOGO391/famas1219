import Link from "next/link"
import {
  DoorOpen,
  PlusCircle,
  ClipboardList,
  CalendarDays,
  Users,
  Clock,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { rooms, reservations } from "@/data/dummy"

const todayStr = "2026-06-08"

const quickActions = [
  { href: "/rooms", label: "会議室一覧", icon: DoorOpen },
  { href: "/reservations/new", label: "新規予約", icon: PlusCircle },
  { href: "/reservations", label: "予約一覧", icon: ClipboardList },
  { href: "/calendar", label: "カレンダー", icon: CalendarDays },
] as const

export default function HomePage() {
  const todayReservations = reservations.filter((r) => r.date === todayStr)

  return (
    <div>
      <PageHeader title="会議室予約" description="今日の予約状況を確認" />

      <section className="px-4 py-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          今日の予約（{todayReservations.length}件）
        </h2>
        {todayReservations.length === 0 ? (
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
            {todayReservations.map((res) => {
              const room = rooms.find((r) => r.id === res.roomId)
              return (
                <Card key={res.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate">{res.title}</p>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {res.startTime}〜{res.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                          <DoorOpen className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {room?.emoji} {room?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Users className="h-3 w-3 shrink-0" />
                          <span>
                            {res.organizer} ・ {res.participants}名
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        予約済
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
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
