"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LockKeyhole, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          next: searchParams.get("next") ?? "/admin",
        }),
      })
      const payload = (await response.json()) as { error?: string; next?: string }

      if (!response.ok) {
        setError(payload.error ?? "Login gagal diproses.")
        return
      }

      router.replace(payload.next ?? "/admin")
      router.refresh()
    } catch {
      setError("Login gagal diproses. Periksa koneksi browser dan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-900">
          <LockKeyhole className="h-5 w-5" aria-hidden="true" />
        </div>
        <CardTitle>Login Admin</CardTitle>
        <CardDescription>
          Masuk untuk mengelola dataset CSV yang dipakai pada dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? "Memproses..." : "Masuk Admin"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
