"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/rooms", label: "会議室", icon: "🚪" },
  { href: "/reservations", label: "予約一覧", icon: "📋" },
  { href: "/reservations/new", label: "予約作成", icon: "➕" },
  { href: "/calendar", label: "カレンダー", icon: "📅" },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors ${
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
