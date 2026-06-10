"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  DoorOpen,
  CalendarDays,
  ClipboardList,
  PlusCircle,
  LogOut,
} from "lucide-react"
import { authSignOut } from "@/lib/supabase"

const navItems = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/rooms", label: "会議室一覧", icon: DoorOpen },
  { href: "/reservations/new", label: "新規予約", icon: PlusCircle },
  { href: "/reservations", label: "予約一覧", icon: ClipboardList },
  { href: "/calendar", label: "カレンダー", icon: CalendarDays },
] as const

function isItemActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/"
  // /reservations と /reservations/new を取り違えないよう厳密判定
  if (href === "/reservations") return pathname === "/reservations"
  return pathname.startsWith(href)
}

export function SideNav() {
  const pathname = usePathname()

  // ログイン画面ではナビを出さない
  if (pathname === "/login") return null

  function handleLogout() {
    authSignOut()
    window.location.href = "/login"
  }

  return (
    <aside className="hidden lg:flex lg:flex-col w-60 shrink-0 border-r border-border bg-background sticky top-0 h-screen">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <DoorOpen className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">会議室予約</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = isItemActive(item.href, pathname)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>ログアウト</span>
        </button>
      </div>
    </aside>
  )
}
