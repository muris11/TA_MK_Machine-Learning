import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { type NextRequest, type NextResponse } from "next/server"
import { getSupabaseConfig } from "@/utils/supabase/config"
import type { Database } from "@/utils/supabase/database.types"

type PendingCookie = {
  name: string
  value: string
  options: CookieOptions
}

export function createRouteClient(request: NextRequest) {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig()
  const pendingCookies: PendingCookie[] = []

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          pendingCookies.push({ name, value, options })
        })
      },
    },
  })

  function applyCookies<TResponse extends NextResponse>(response: TResponse) {
    pendingCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options)
    })

    return response
  }

  return {
    supabase,
    applyCookies,
  }
}
