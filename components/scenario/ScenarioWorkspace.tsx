"use client"

import { AlertCircle, Scale } from "lucide-react"
import { useState } from "react"
import type { ScenarioComparisonResult, ScenarioRequest } from "@/lib/types"
import { ScenarioComparison } from "@/components/scenario/ScenarioComparison"
import { ScenarioForm } from "@/components/scenario/ScenarioForm"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ScenarioWorkspace() {
  const [comparison, setComparison] = useState<ScenarioComparisonResult | null>(null)
  const [request, setRequest] = useState<ScenarioRequest | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(values: ScenarioRequest) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/scenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      const payload = (await response.json()) as ScenarioComparisonResult | { error?: string }

      if (!response.ok) {
        throw new Error("error" in payload && payload.error ? payload.error : "Scenario gagal diproses.")
      }

      setComparison(payload as ScenarioComparisonResult)
      setRequest(values)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Scenario belum dapat diproses. Periksa input dan coba kembali.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <ScenarioForm isLoading={isLoading} onSubmit={handleSubmit} />

      {error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex gap-3 p-4 text-sm leading-6 text-red-900">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </CardContent>
        </Card>
      ) : null}

      {comparison && request ? (
        <ScenarioComparison request={request} comparison={comparison} />
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
              <Scale className="h-6 w-6" aria-hidden="true" />
            </div>
            <CardTitle>Belum ada scenario comparison</CardTitle>
            <CardDescription>
              Isi dua kondisi indikator untuk melihat perubahan prediksi, delta kemiskinan,
              dan narasi dampak kebijakan.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
