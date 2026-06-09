"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { LoadingCardList } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { AuthGuard } from "@/components/auth-guard"
import { fetchRooms } from "@/lib/supabase"
import type { Room } from "@/lib/supabase"
import { Users, MapPin, Monitor } from "lucide-react"
import { RoomImage } from "@/components/room-image"

function RoomsContent() {
  const [rooms, setRooms] = useState<readonly Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
      .then(setRooms)
      .catch(() => setRooms([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="会議室一覧" description="利用可能な会議室" />

      {loading ? (
        <LoadingCardList count={4} />
      ) : rooms.length === 0 ? (
        <EmptyState
          icon="🚪"
          title="会議室が登録されていません"
          description="管理者に会議室の追加を依頼してください"
        />
      ) : (
        <div className="px-4 pb-6 space-y-3 mt-3">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <RoomImage emoji={room.emoji} name={room.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-base">{room.name}</h3>
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
                          key={eq.id}
                          variant="secondary"
                          className="text-[10px] font-normal"
                        >
                          <Monitor className="h-2.5 w-2.5 mr-0.5" />
                          {eq.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RoomsPage() {
  return <AuthGuard>{() => <RoomsContent />}</AuthGuard>
}
