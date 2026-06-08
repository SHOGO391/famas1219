"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authSignUp, authSignIn } from "@/lib/supabase"
import { Loader2, DoorOpen } from "lucide-react"

type Mode = "login" | "signup"

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    try {
      if (mode === "signup") {
        await authSignUp(trimmedEmail, trimmedPassword)
        router.replace("/")
      } else {
        await authSignIn(trimmedEmail, trimmedPassword)
        router.replace("/")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="flex items-center gap-2 mb-8">
        <DoorOpen className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">会議室予約</h1>
      </div>

      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-center mb-6">
            {mode === "login" ? "ログイン" : "アカウント作成"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@company.com"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="6文字以上"
                className="h-11"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                {error}
              </p>
            )}

            {message && (
              <p className="text-sm text-green-700 bg-green-50 rounded-lg p-3">
                {message}
              </p>
            )}

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "login" ? "ログイン" : "登録する"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode((prev) => (prev === "login" ? "signup" : "login"))
                setError("")
                setMessage("")
              }}
              className="text-sm text-primary underline underline-offset-2"
            >
              {mode === "login" ? "アカウントを作成する" : "ログインに戻る"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
