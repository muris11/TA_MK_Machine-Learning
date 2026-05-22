import type { NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"

export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}

export const proxyConfig = config
