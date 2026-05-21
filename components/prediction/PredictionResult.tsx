import Link from "next/link"
import { Activity, Gauge, ShieldCheck } from "lucide-react"
import { formatMetric, formatPercent } from "@/lib/formatters"
import type { PredictionInput, PredictionResult as PredictionResultType } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { buttonStyles } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function priorityVariant(priority: PredictionResultType["priority_level"]) {
  if (priority === "Low Priority") {
    return "success" as const
  }

  if (priority === "Medium Priority") {
    return "warning" as const
  }

  return "danger" as const
}

export function PredictionResult({
  input,
  result,
}: {
  input: PredictionInput
  result: PredictionResultType
}) {
  return (
    <Card className="border-blue-100 shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Ringkasan Prediksi</CardTitle>
            <CardDescription>
              Hasil simulasi untuk tahun {input.tahun} dengan artifact model static.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={priorityVariant(result.priority_level)}>
              {result.priority_level}
            </Badge>
            <Link href="/report" className={buttonStyles({ variant: "outline", size: "sm" })}>
              Lihat Report
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-[1fr_220px] lg:items-end">
          <div>
            <p className="text-sm font-medium text-slate-500">Estimasi angka kemiskinan</p>
            <p className="mt-2 font-mono text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              {formatPercent(result.prediksi_kemiskinan)}
            </p>
            <p className="mt-3 text-base font-semibold text-slate-800">{result.status}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Sistem memetakan hasil regresi ke level prioritas intervensi memakai threshold
              dari artifact model.
            </p>
          </div>
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <Gauge className="h-5 w-5 text-blue-900" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                  R2 Score
                </p>
                <p className="font-mono text-lg font-bold text-slate-950">
                  {formatMetric(result.metadata.r2_score)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-teal-700" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                  MAE
                </p>
                <p className="font-mono text-lg font-bold text-slate-950">
                  {formatMetric(result.metadata.mae, 4)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                  Accuracy
                </p>
                <p className="font-mono text-lg font-bold text-slate-950">
                  {formatMetric(result.metadata.classification_accuracy)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
