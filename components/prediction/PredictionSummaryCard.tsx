import { ArrowRight } from "lucide-react"
import { formatPercent } from "@/lib/formatters"
import type { PredictionInput, PredictionResult } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

function variantForPriority(priority: PredictionResult["priority_level"]) {
  if (priority === "Low Priority") {
    return "success" as const
  }

  if (priority === "Medium Priority") {
    return "warning" as const
  }

  return "danger" as const
}

export function PredictionSummaryCard({
  input,
  result,
}: {
  input: PredictionInput
  result: PredictionResult
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Preview hasil model</p>
          <p className="mt-2 font-mono text-3xl font-bold text-slate-950">
            {formatPercent(result.prediksi_kemiskinan)}
          </p>
        </div>
        <Badge variant={variantForPriority(result.priority_level)}>
          {result.priority_level}
        </Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Tahun {input.tahun}. {result.rekomendasi_utama}
      </p>
      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-900">
        Lihat dashboard prediksi
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </div>
    </Card>
  )
}
