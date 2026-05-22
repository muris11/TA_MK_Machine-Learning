import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export async function POST() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  await supabase.auth.signOut()

  return NextResponse.json({ ok: true })
}
