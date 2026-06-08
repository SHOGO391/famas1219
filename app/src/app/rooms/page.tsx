"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { LoadingCardList } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { rooms, getReservationsByRoomId } from "@/data/dummy"
import type { Room } from "@/data/dummy"
import { Users, MapPin, Monitor } from "lucide-react"

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
        <PageHeader title="会議室一覧" description="利用可能な会議室" />
        <LoadingCardList count={4} />
      </div>
    )
  }

  const displayData = showEmpty ? [] : data

  return (
    <div>
      <PageHeader title="会議室一覧" description="利用可能な会議室" />

      <div className="px-4 pt-3 pb-1">
        <button
          onClick={() => setShowEmpty((prev) => !prev)}
          className="text-xs text-primary underline underline-offset-2"
        >
          {showEmpty ? "ダミーデータ表示" : "空状態を確認"}
        </button>
      </div>

      {displayData.length === 0 ? (
        <EmptyState
          icon="🚪"
          title="会議室が登録されていません"
          description="管理者に会議室の追加を依頼してください"
        />
      ) : (
        <div className="px-4 pb-6 space-y-3 mt-2">
          {displayData.map((room) => {
            const resCount = getReservationsByRoomId(room.id).length
            return (
              <Card key={room.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl leading-none mt-0.5">
                      {room.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-base">
                          {room.name}
                        </h3>
                        <Badge
                          variant={resCount > 0 ? "default" : "outline"}
                          className="text-[10px]"
                        >
                          {resCount > 0 ? `${resCount}件予約` : "空き"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {room.capacity}名
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {room.floor}F
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {room.equipment.map((eq) => (
                          <Badge
                            key={eq}
                            variant="secondary"
                            className="text-[10px] font-normal"
                          >
                            <Monitor className="h-2.5 w-2.5 mr-0.5" />
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
