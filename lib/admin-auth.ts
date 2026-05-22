import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export type AdminSession = {
  id: string
  email: string
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id,email")
    .eq("user_id", user.id)
    .maybeSingle()

  if (adminError || !adminUser) {
    return null
  }

  return {
    id: adminUser.user_id,
    email: adminUser.email,
  }
}
