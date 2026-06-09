import { Monitor, Users, Headphones, Building2, Mic } from "lucide-react"

type RoomImageProps = Readonly<{
  emoji: string
  name: string
  size?: "sm" | "md" | "lg"
}>

const sizeMap = {
  sm: { box: "w-6 h-6", icon: "h-3.5 w-3.5" },
  md: { box: "w-10 h-10", icon: "h-5 w-5" },
  lg: { box: "w-12 h-12", icon: "h-6 w-6" },
} as const

const iconColorMap: Record<string, { bg: string; fg: string }> = {
  "/rooms/room-a.jpg": { bg: "bg-blue-100", fg: "text-blue-600" },
  "/rooms/room-b.jpg": { bg: "bg-emerald-100", fg: "text-emerald-600" },
  "/rooms/focus-booth.jpg": { bg: "bg-violet-100", fg: "text-violet-600" },
  "/rooms/boardroom.jpg": { bg: "bg-amber-100", fg: "text-amber-600" },
  "/rooms/seminar-hall.jpg": { bg: "bg-rose-100", fg: "text-rose-600" },
}

function RoomIcon({ emoji, className }: Readonly<{ emoji: string; className: string }>) {
  switch (emoji) {
    case "/rooms/room-a.jpg":
      return <Monitor className={className} />
    case "/rooms/room-b.jpg":
      return <Users className={className} />
    case "/rooms/focus-booth.jpg":
      return <Headphones className={className} />
    case "/rooms/boardroom.jpg":
      return <Building2 className={className} />
    case "/rooms/seminar-hall.jpg":
      return <Mic className={className} />
    default:
      return <Monitor className={className} />
  }
}

export function RoomImage({ emoji, name, size = "md" }: RoomImageProps) {
  const { box, icon } = sizeMap[size]
  const isPath = emoji.startsWith("/")

  if (isPath) {
    const colors = iconColorMap[emoji] ?? { bg: "bg-gray-100", fg: "text-gray-600" }
    return (
      <div
        className={`${box} ${colors.bg} rounded-lg flex items-center justify-center shrink-0`}
        title={name}
      >
        <RoomIcon emoji={emoji} className={`${icon} ${colors.fg}`} />
      </div>
    )
  }

  return (
    <span className={`${box} flex items-center justify-center text-2xl shrink-0`}>
      {emoji}
    </span>
  )
}
