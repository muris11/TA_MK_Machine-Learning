import { NextResponse } from "next/server"
import { z } from "zod"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

const loginSchema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(1, "Password wajib diisi."),
  next: z.string().optional(),
})

function sanitizeRedirect(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin"
  }

  return value
}

export async function POST(request: Request) {
  try {
    const payload = loginSchema.safeParse(await request.json())

    if (!payload.success) {
      return NextResponse.json(
        { error: payload.error.issues[0]?.message ?? "Payload login tidak valid." },
        { status: 400 },
      )
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.data.email,
      password: payload.data.password,
    })

    if (error || !data.user) {
      return NextResponse.json(
        { error: "Email atau password tidak valid." },
        { status: 401 },
      )
    }

    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle()

    if (adminError || !adminUser) {
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: "Akun Supabase ini belum diberi akses admin." },
        { status: 403 },
      )
    }

    return NextResponse.json({ next: sanitizeRedirect(payload.data.next) })
  } catch {
    return NextResponse.json({ error: "Login belum dapat diproses." }, { status: 400 })
  }
}
