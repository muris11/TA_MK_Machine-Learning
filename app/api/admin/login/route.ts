import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { z } from "zod"
import { createRouteClient } from "@/utils/supabase/route"

export const runtime = "nodejs"

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

export async function POST(request: NextRequest) {
  try {
    const payload = loginSchema.safeParse(await request.json())

    if (!payload.success) {
      return NextResponse.json(
        { error: payload.error.issues[0]?.message ?? "Payload login tidak valid." },
        { status: 400 },
      )
    }

    const { supabase, applyCookies } = createRouteClient(request)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.data.email,
      password: payload.data.password,
    })

    if (error || !data.user || !data.session) {
      console.error("Supabase admin login failed:", error?.message ?? "No session returned")
      return applyCookies(
        NextResponse.json(
          { error: "Email atau password tidak valid, atau email belum dikonfirmasi." },
          { status: 401 },
        ),
      )
    }

    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle()

    if (adminError || !adminUser) {
      await supabase.auth.signOut()
      console.error("Supabase admin access check failed:", adminError?.message ?? "User is not in admin_users")
      return applyCookies(
        NextResponse.json(
          {
            error:
              "Login Supabase berhasil, tetapi akun ini belum ada di tabel public.admin_users.",
          },
          { status: 403 },
        ),
      )
    }

    return applyCookies(NextResponse.json({ next: sanitizeRedirect(payload.data.next) }))
  } catch (error) {
    console.error("Admin login route failed:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Login belum dapat diproses.",
      },
      { status: 400 },
    )
  }
}
