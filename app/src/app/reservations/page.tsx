"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/page-header"
import { LoadingCardList } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { reservations, getRoomById } from "@/data/dummy"
import type { Reservation } from "@/data/dummy"
import { Clock, DoorOpen, Users, Trash2 } from "lucide-react"

export default function ReservationsPage() {
  const [data, setData] = useState<readonly Reservation[] | null>(null)
  const [showEmpty, setShowEmpty] = useState(false)
  const [cancelledIds, setCancelledIds] = useState<ReadonlySet<string>>(
    new Set()
  )
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setData(reservations), 800)
    return () => clearTimeout(timer)
  }, [])

  function handleConfirmCancel() {
    if (cancelTarget) {
      setCancelledIds((prev) => new Set([...prev, cancelTarget.id]))
      setCancelTarget(null)
    }
  }

  if (data === null) {
    return (
      <div>
        <PageHeader title="予約一覧" description="すべての予約" />
        <LoadingCardList count={4} />
      </div>
    )
  }

  const activeData = showEmpty
    ? []
    : data.filter((r) => !cancelledIds.has(r.id))

  return (
    <div>
      <PageHeader title="予約一覧" description="すべての予約" />

      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <button
          onClick={() => setShowEmpty((prev) => !prev)}
          className="text-xs text-primary underline underline-offset-2"
        >
          {showEmpty ? "ダミーデータ表示" : "空状態を確認"}
        </button>
        <span className="text-xs text-muted-foreground">
          {activeData.length}件
        </span>
      </div>

      {activeData.length === 0 ? (
        <EmptyState
          icon="📋"
          title="予約はまだありません"
          description="下の「予約」タブから会議室を予約できます"
        />
      ) : (
        <div className="px-4 pb-6 space-y-3 mt-2">
          {activeData.map((res) => {
            const room = getRoomById(res.roomId)
            return (
              <Card key={res.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{res.title}</p>
                      <div className="space-y-0.5 mt-1.5">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <DoorOpen className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {room?.emoji} {room?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">
                            {res.date} {res.startTime}〜{res.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="h-3 w-3 shrink-0" />
                          <span>
                            {res.organizer} ・ {res.participants}名
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9 p-0"
                      onClick={() => setCancelTarget(res)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog
        open={cancelTarget !== null}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null)
        }}
      >
        <DialogContent className="max-w-[calc(100vw-2rem)]">
          <DialogHeader>
            <DialogTitle>予約をキャンセル</DialogTitle>
            <DialogDescription>
              「{cancelTarget?.title}」をキャンセルしますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setCancelTarget(null)}
            >
              戻る
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleConfirmCancel}
            >
              キャンセルする
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
