import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react"
import { predictionFieldMetadata } from "@/lib/constants"
import { formatMetric, formatPercent, formatSignedPercent } from "@/lib/formatters"
import type {
  PredictionInput,
  PriorityLevel,
  ScenarioComparisonResult,
  ScenarioRequest,
} from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function priorityVariant(priority: PriorityLevel) {
  if (priority === "Low Priority") {
    return "success" as const
  }

  if (priority === "Medium Priority") {
    return "warning" as const
  }

  return "danger" as const
}

function deltaVariant(value: number) {
  if (value < -0.1) {
    return {
      icon: ArrowDownRight,
      label: "Membaik",
      className: "border-emerald-200 bg-emerald-50 text-emerald-900",
    }
  }

  if (value > 0.1) {
    return {
      icon: ArrowUpRight,
      label: "Memburuk",
      className: "border-red-200 bg-red-50 text-red-900",
    }
  }

  return {
    icon: ArrowRight,
    label: "Stabil",
    className: "border-slate-200 bg-slate-50 text-slate-800",
  }
}

function formatInputValue(name: keyof PredictionInput, value: number) {
  if (
    name === "tingkat_penganggur_terbuka" ||
    name === "rata_rata_inflasi_tahunan"
  ) {
    return formatPercent(value)
  }

  if (name === "tahun") {
    return String(value)
  }

  return formatMetric(value)
}

function formatDeltaValue(name: keyof PredictionInput, value: number) {
  const sign = value > 0 ? "+" : ""

  if (name === "tahun") {
    return `${sign}${value}`
  }

  if (
    name === "tingkat_penganggur_terbuka" ||
    name === "rata_rata_inflasi_tahunan"
  ) {
    return `${sign}${formatPercent(value)}`
  }

  return `${sign}${formatMetric(value)}`
}

export function ScenarioComparison({
  request,
  comparison,
}: {
  request: ScenarioRequest
  comparison: ScenarioComparisonResult
}) {
  const variant = deltaVariant(comparison.delta.kemiskinan_change)
  const DeltaIcon = variant.icon

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Baseline</CardTitle>
            <CardDescription>Prediksi kondisi awal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-bold text-slate-950">
              {formatPercent(comparison.baseline_result.prediksi_kemiskinan)}
            </p>
            <Badge className="mt-3" variant={priorityVariant(comparison.baseline_result.priority_level)}>
              {comparison.baseline_result.priority_level}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Scenario</CardTitle>
            <CardDescription>Prediksi setelah perubahan indikator</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-bold text-slate-950">
              {formatPercent(comparison.scenario_result.prediksi_kemiskinan)}
            </p>
            <Badge className="mt-3" variant={priorityVariant(comparison.scenario_result.priority_level)}>
              {comparison.scenario_result.priority_level}
            </Badge>
          </CardContent>
        </Card>

        <Card className={variant.className}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-inherit">
              <DeltaIcon className="h-5 w-5" aria-hidden="true" />
              Delta Kemiskinan
            </CardTitle>
            <CardDescription className="text-inherit/80">
              Status perubahan: {variant.label}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-bold">
              {formatSignedPercent(comparison.delta.kemiskinan_change)}
            </p>
            <p className="mt-3 text-sm font-semibold">
              {comparison.delta.priority_change}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Narasi Dampak Kebijakan</CardTitle>
          <CardDescription>
            Ringkasan perubahan berdasarkan prediksi baseline dan skenario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-slate-700">{comparison.scenario_narrative}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Perubahan Indikator</CardTitle>
          <CardDescription>
            Tabel ini menunjukkan indikator yang berubah antara baseline dan skenario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                  <th className="px-4 py-3 font-semibold">Indikator</th>
                  <th className="px-4 py-3 text-right font-semibold">Baseline</th>
                  <th className="px-4 py-3 text-right font-semibold">Scenario</th>
                  <th className="px-4 py-3 text-right font-semibold">Delta</th>
                </tr>
              </thead>
              <tbody>
                {predictionFieldMetadata.map((field) => {
                  const key = field.name
                  const baselineValue = request.baseline[key]
                  const scenarioValue = request.scenario[key]
                  const delta = scenarioValue - baselineValue

                  return (
                    <tr key={key} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-slate-800">{field.label}</td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {formatInputValue(key, baselineValue)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {formatInputValue(key, scenarioValue)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800">
                        {formatDeltaValue(key, Number(delta.toFixed(2)))}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
