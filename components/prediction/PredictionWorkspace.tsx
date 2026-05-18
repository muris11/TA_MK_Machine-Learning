"use client"

import { AlertCircle, BarChart3 } from "lucide-react"
import { useMemo, useState } from "react"
import { buildIndicatorDiagnosis } from "@/lib/recommendation"
import type { PredictionInput, PredictionResult, TrendData } from "@/lib/types"
import { PredictionForm } from "@/components/prediction/PredictionForm"
import { PredictionResult as PredictionResultCard } from "@/components/prediction/PredictionResult"
import { RecommendationPanel } from "@/components/prediction/RecommendationPanel"
import { PolicyTimeline } from "@/components/prediction/PolicyTimeline"
import { IndicatorDiagnosis } from "@/components/prediction/IndicatorDiagnosis"
import { DynamicPovertyTrendChart } from "@/components/charts/DynamicCharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function PredictionWorkspace({ trendData }: { trendData: TrendData }) {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [input, setInput] = useState<PredictionInput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const diagnosis = useMemo(() => (input ? buildIndicatorDiagnosis(input) : []), [input])

  async function handleSubmit(values: PredictionInput) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      const payload = (await response.json()) as PredictionResult | { error?: string }

      if (!response.ok) {
        throw new Error("error" in payload && payload.error ? payload.error : "Prediksi gagal diproses.")
      }

      setResult(payload as PredictionResult)
      setInput(values)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Prediksi belum dapat diproses. Periksa input dan coba kembali.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <PredictionForm isLoading={isLoading} onSubmit={handleSubmit} />
      </div>

      <div className="space-y-6">
        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex gap-3 p-4 text-sm leading-6 text-red-900">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </CardContent>
          </Card>
        ) : null}

        {result && input ? (
          <>
            <PredictionResultCard input={input} result={result} />
            <RecommendationPanel result={result} />
            <IndicatorDiagnosis diagnosis={diagnosis} />
            <PolicyTimeline timeline={result.timeline} />
          </>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                <BarChart3 className="h-6 w-6" aria-hidden="true" />
              </div>
              <CardTitle>Belum ada hasil prediksi</CardTitle>
              <CardDescription>
                Masukkan indikator sosial ekonomi untuk melihat estimasi kemiskinan, level
                prioritas, dan rekomendasi kebijakan.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div>
          <div className="mb-3 flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-slate-950">Tren dan titik prediksi</h3>
            <p className="text-sm leading-6 text-slate-600">
              Grafik menggunakan data static untuk konteks historis dan menandai hasil prediksi
              terakhir.
            </p>
          </div>
          <DynamicPovertyTrendChart
            data={trendData.historical}
            current={result && input ? { input, result } : undefined}
          />
        </div>
      </div>
    </div>
  )
}
