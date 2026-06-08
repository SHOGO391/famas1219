import type { Metadata } from "next"
import { BottomNav } from "@/components/nav"
import "./globals.css"

export const metadata: Metadata = {
  title: "会議室予約アプリ",
  description: "会議室の予約・管理ができるアプリケーション",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col pb-16">
        <main className="flex-1 max-w-md mx-auto w-full">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
