import Link from "next/link"
import { ArrowRight, Database, FileText, LineChart, ShieldCheck } from "lucide-react"
import { PredictionSummaryCard } from "@/components/prediction/PredictionSummaryCard"
import { buttonStyles } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { defaultPredictionInput } from "@/lib/constants"
import { formatMetric } from "@/lib/formatters"
import { getModelMetadata } from "@/lib/metadata"
import { buildPredictionResult } from "@/lib/prediction"

export function HeroSection() {
  const metadata = getModelMetadata()
  const result = buildPredictionResult(defaultPredictionInput)

  return (
    <section className="overflow-hidden border-b border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
            Machine Learning Decision Support
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-[56px]">
            Prediksi Kondisi Sosial Jawa Barat Berbasis Machine Learning
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Platform ini membantu memprediksi estimasi tingkat kemiskinan, menentukan
            prioritas intervensi sosial, dan menghasilkan rekomendasi kebijakan berdasarkan
            indikator ekonomi dan sosial.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className={buttonStyles({ size: "lg" })}>
              Mulai Prediksi
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/model-info"
              className={buttonStyles({ variant: "outline", size: "lg" })}
            >
              Lihat Informasi Model
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "R2 Score",
                value: formatMetric(metadata.metrics.r2_score),
                icon: LineChart,
              },
              {
                label: "Accuracy",
                value: formatMetric(metadata.metrics.classification_accuracy),
                icon: ShieldCheck,
              },
              {
                label: "Mode",
                value: "Static",
                icon: Database,
              },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <Icon className="h-5 w-5 text-blue-900" aria-hidden="true" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1 font-mono text-xl font-bold text-slate-950">
                    {item.value}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative flex items-center">
          <div className="w-full space-y-4">
            <Card className="p-5 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    Preview Dashboard Prediksi
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Estimasi, prioritas, rekomendasi, dan timeline kebijakan.
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </Card>
            <PredictionSummaryCard input={defaultPredictionInput} result={result} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-5">
                <p className="text-sm font-medium text-slate-500">Model regresi</p>
                <p className="mt-2 font-mono text-sm font-semibold text-slate-950">
                  {metadata.best_models.regression}
                </p>
              </Card>
              <Card className="p-5">
                <p className="text-sm font-medium text-slate-500">Model klasifikasi</p>
                <p className="mt-2 font-mono text-sm font-semibold text-slate-950">
                  {metadata.best_models.classification}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
