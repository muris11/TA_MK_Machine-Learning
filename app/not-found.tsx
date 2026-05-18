import Link from "next/link"
import { PageShell } from "@/components/layout/PageShell"
import { buttonStyles } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFoundPage() {
  return (
    <PageShell>
      <Card>
        <CardContent className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
            404
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Halaman tidak ditemukan
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Alamat yang dibuka tidak tersedia di aplikasi ini. Kembali ke dashboard untuk
            menjalankan prediksi.
          </p>
          <Link href="/dashboard" className={buttonStyles({ className: "mt-6" })}>
            Buka Dashboard
          </Link>
        </CardContent>
      </Card>
    </PageShell>
  )
}
