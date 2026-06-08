"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getStoredUser } from "@/lib/supabase"
import type { AuthUser } from "@/lib/supabase"
import { LoadingCardList } from "@/components/loading-state"

type AuthGuardProps = {
  readonly children: (user: AuthUser) => React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = getStoredUser()
    if (!stored) {
      router.replace("/login")
    } else {
      setUser(stored)
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return <LoadingCardList count={3} />
  }

  if (!user) {
    return null
  }

  return <>{children(user)}</>
}
