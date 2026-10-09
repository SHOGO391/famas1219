"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { AuthGuard } from "@/components/auth-guard"
import { fetchMyReservations, deleteReservation } from "@/lib/supabase"
import type { Reservation } from "@/lib/supabase"
import { Clock, Users, Trash2 } from "lucide-react"
import { RoomImage } from "@/components/room-image"

function ReservationsContent() {
  const [data, setData] = useState<readonly Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = useCallback(() => {
    fetchMyReservations()
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleConfirmCancel() {
    if (!cancelTarget) return
    setDeleting(true)
    try {
      await deleteReservation(cancelTarget.id)
      setCancelTarget(null)
      setLoading(true)
      loadData()
    } catch {
      // エラー時もダイアログを閉じる
      setCancelTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader title="予約一覧" description="あなたの予約" />

      <div className="px-4 pt-3 pb-1 flex justify-end">
        <span className="text-xs text-muted-foreground">
          {loading ? "..." : data.length}件
        </span>
      </div>

      {loading ? (
        <LoadingCardList count={4} />
      ) : data.length === 0 ? (
        <EmptyState
          icon="📋"
          title="予約はまだありません"
          description="下の「予約」タブから会議室を予約できます"
        />
      ) : (
        <div className="px-4 pb-6 space-y-3 mt-2">
          {data.map((res) => (
            <Card key={res.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{res.title}</p>
                    <div className="space-y-0.5 mt-1.5">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        {res.rooms?.emoji && (
                          <RoomImage emoji={res.rooms.emoji} name={res.rooms.name ?? ""} size="sm" />
                        )}
                        <span>{res.rooms?.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {res.date} {res.start_time.slice(0, 5)}〜
                          {res.end_time.slice(0, 5)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3 w-3 shrink-0" />
                        <span>
                          {res.organizer} ・ {res.participants.length}名
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
          ))}
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
              「{cancelTarget?.title}
              」をキャンセルしますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setCancelTarget(null)}
              disabled={deleting}
            >
              戻る
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleConfirmCancel}
              disabled={deleting}
            >
              {deleting ? "処理中..." : "キャンセルする"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function ReservationsPage() {
  return <AuthGuard>{() => <ReservationsContent />}</AuthGuard>
}
