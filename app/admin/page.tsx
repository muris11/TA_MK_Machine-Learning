import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AdminWorkspace } from "@/components/admin/AdminWorkspace"
import { PageShell } from "@/components/layout/PageShell"
import { getAdminSession } from "@/lib/admin-auth"
import { getRequiredCsvColumns, listCsvUploads } from "@/lib/admin-csv"

export const metadata: Metadata = {
  title: "Admin Dataset",
  description: "Dashboard admin untuk upload dan validasi dataset CSV.",
}

export default async function AdminPage() {
  const session = await getAdminSession()

  if (!session) {
    redirect("/admin/login?next=/admin")
  }

  const uploads = await listCsvUploads()

  return (
    <PageShell>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          Admin Dataset
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Kelola CSV Kemiskinan Jawa Barat
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Upload dataset CSV baru, validasi struktur kolom, dan lihat riwayat dataset yang
          sudah masuk ke aplikasi.
        </p>
      </div>

      <AdminWorkspace
        initialUploads={uploads}
        requiredColumns={getRequiredCsvColumns()}
        adminEmail={session.email}
      />
    </PageShell>
  )
}
