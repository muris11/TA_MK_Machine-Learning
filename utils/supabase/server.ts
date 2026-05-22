import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getSupabaseConfig } from "@/utils/supabase/config"
import type { Database } from "@/utils/supabase/database.types"

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig()

  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Server Components cannot set cookies directly; proxy.ts refreshes sessions.
        }
      },
    },
  })
}
