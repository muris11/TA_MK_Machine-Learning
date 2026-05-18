import type { Metadata } from "next"
import { PageShell } from "@/components/layout/PageShell"
import { PredictionWorkspace } from "@/components/prediction/PredictionWorkspace"
import { getTrendData } from "@/lib/metadata"

export const metadata: Metadata = {
  title: "Dashboard Prediksi",
  description:
    "Dashboard input indikator sosial ekonomi, prediksi kemiskinan, dan rekomendasi kebijakan Jawa Barat.",
}

export default function DashboardPage() {
  const trendData = getTrendData()

  return (
    <PageShell>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          Dashboard Prediksi
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Prediksi Kondisi Sosial Jawa Barat
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Input indikator ekonomi dan sosial untuk melihat estimasi angka kemiskinan,
          level prioritas intervensi, diagnosis indikator, dan rekomendasi kebijakan.
        </p>
      </div>
      <PredictionWorkspace trendData={trendData} />
    </PageShell>
  )
}
