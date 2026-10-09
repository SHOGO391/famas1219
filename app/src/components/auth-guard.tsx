"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, onAuthChange } from "@/lib/supabase"
import type { AuthUser } from "@/lib/supabase"
import { LoadingCardList } from "@/components/loading-state"

type AuthGuardProps = {
  readonly children: (user: AuthUser) => React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    let active = true
    let unsubscribe: (() => void) | undefined
    getCurrentUser().then(current => {
      if (!active) return
      setUser(current)
      if (!current) router.replace("/login")
      unsubscribe = onAuthChange(next => {
        if (!active) return
        setUser(next)
        if (!next) router.replace("/login")
      })
    }).catch(err => {
      if (active) setError(err instanceof Error ? err.message : "認証を確認できませんでした")
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false; unsubscribe?.() }
  }, [router])

  if (loading) {
    return <LoadingCardList count={3} />
  }

  if (error) return <p role="alert" className="p-4">{error} <a href="/login">ログイン画面へ</a></p>

  if (!user) {
    return null
  }

  return <>{children(user)}</>
}
