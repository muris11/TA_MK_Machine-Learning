import type { Metadata } from "next"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { AdminLoginForm } from "@/components/admin/AdminLoginForm"
import { PageShell } from "@/components/layout/PageShell"
import { getAdminSession } from "@/lib/admin-auth"

export const metadata: Metadata = {
  title: "Login Admin",
  description: "Halaman login admin untuk pengelolaan dataset CSV.",
}

export const dynamic = "force-dynamic"

export default async function AdminLoginPage() {
  const session = await getAdminSession()

  if (session) {
    redirect("/admin")
  }

  return (
    <PageShell contentClassName="flex min-h-[calc(100vh-13rem)] items-center justify-center">
      <div className="w-full">
        <div className="mx-auto mb-8 max-w-md text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Manajemen Dataset
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Akses terbatas untuk upload CSV dan pengecekan dataset terbaru.
          </p>
        </div>
        <Suspense fallback={null}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </PageShell>
  )
}
