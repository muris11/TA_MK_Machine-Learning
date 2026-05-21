import type { Metadata } from "next"
import { PageShell } from "@/components/layout/PageShell"
import { ReportWorkspace } from "@/components/report/ReportWorkspace"
import { defaultPredictionInput } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Laporan Hasil Prediksi",
  description:
    "Ringkasan naratif hasil prediksi kemiskinan dan rekomendasi kebijakan untuk bahan presentasi.",
}

export default function ReportPage() {
  return (
    <PageShell contentClassName="max-w-5xl">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          Report
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Laporan Hasil Prediksi
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Ringkasan prediksi terbaru dalam format naratif yang siap disalin atau
          diunduh sebagai Markdown.
        </p>
      </div>
      <ReportWorkspace fallbackInput={defaultPredictionInput} />
    </PageShell>
  )
}
