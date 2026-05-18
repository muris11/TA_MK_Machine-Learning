import type { Metadata } from "next"
import { PageShell } from "@/components/layout/PageShell"
import { ScenarioWorkspace } from "@/components/scenario/ScenarioWorkspace"

export const metadata: Metadata = {
  title: "Scenario Comparison",
  description:
    "Bandingkan kondisi awal dan skenario kebijakan untuk melihat perubahan prediksi kemiskinan Jawa Barat.",
}

export default function ScenarioPage() {
  return (
    <PageShell>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          Scenario Comparison
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Simulasi Dampak Kebijakan
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Bandingkan baseline dan skenario perubahan indikator untuk melihat delta
          kemiskinan, perubahan prioritas, dan narasi dampak kebijakan.
        </p>
      </div>
      <ScenarioWorkspace />
    </PageShell>
  )
}
