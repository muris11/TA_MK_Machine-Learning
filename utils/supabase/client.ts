import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseConfig } from "@/utils/supabase/config"
import type { Database } from "@/utils/supabase/database.types"

export const createClient = () => {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig()

  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}
