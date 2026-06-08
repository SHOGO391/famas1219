"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  DoorOpen,
  CalendarDays,
  ClipboardList,
  PlusCircle,
} from "lucide-react"

const navItems = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/rooms", label: "会議室", icon: DoorOpen },
  { href: "/reservations/new", label: "予約", icon: PlusCircle },
  { href: "/reservations", label: "一覧", icon: ClipboardList },
  { href: "/calendar", label: "暦", icon: CalendarDays },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 min-w-[44px] min-h-[44px] justify-center transition-colors ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
