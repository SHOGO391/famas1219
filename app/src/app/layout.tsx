import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { BottomNav } from "@/components/bottom-nav"
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
      <body className="min-h-full flex flex-col pb-16">
        <main className="flex-1 max-w-md mx-auto w-full">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
