import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createRouteClient } from "@/utils/supabase/route"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  const { supabase, applyCookies } = createRouteClient(request)

  await supabase.auth.signOut()

  return applyCookies(NextResponse.json({ ok: true }))
}
