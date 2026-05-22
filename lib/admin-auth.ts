import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export type AdminSession = {
  id: string
  email: string
}

export async function getAdminSession() {
  try {
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
      if (adminError) {
        console.error("Supabase admin session check failed:", adminError.message)
      }

      return null
    }

    return {
      id: adminUser.user_id,
      email: adminUser.email,
    }
  } catch (error) {
    console.error("Admin session could not be resolved:", error)
    return null
  }
}
