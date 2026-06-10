import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { BottomNav } from "@/components/bottom-nav"
import { SideNav } from "@/components/side-nav"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

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
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="flex min-h-full">
          {/* PC（lg以上）のみ表示される左サイドバー。スマホ/タブレットでは display:none */}
          <SideNav />
          <main className="flex-1 min-w-0 lg:flex lg:flex-col">
            {/*
              スマホは max-w-md / PC は広め。下部固定ナビの余白はスマホのみ。
              PCは上寄せ＋控えめな上下余白（lg:pt-8/pb-10）。lg:flex-1 で本文領域を
              ビューポート高いっぱいに広げ、各ページ側が lg:flex-1 を付けると縦に伸びる。
            */}
            <div className="max-w-md lg:max-w-5xl mx-auto w-full pb-16 lg:pt-8 lg:pb-10 lg:flex-1 lg:flex lg:flex-col">
              {children}
            </div>
          </main>
        </div>
        {/* スマホ用の下部固定ナビ。PCでは lg:hidden で非表示 */}
        <BottomNav />
      </body>
    </html>
  )
}
