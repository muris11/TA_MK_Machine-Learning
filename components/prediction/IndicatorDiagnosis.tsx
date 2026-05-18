import type { IndicatorDiagnosis as IndicatorDiagnosisType } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function severityVariant(severity: IndicatorDiagnosisType["severity"]) {
  if (severity === "prioritas") {
    return "danger" as const
  }

  if (severity === "perlu dipantau") {
    return "warning" as const
  }

  return "success" as const
}

export function IndicatorDiagnosis({
  diagnosis,
}: {
  diagnosis: IndicatorDiagnosisType[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnosis Indikator</CardTitle>
        <CardDescription>
          Faktor utama yang perlu dipantau setelah hasil prediksi terbentuk.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {diagnosis.map((item) => (
            <div
              key={`${item.indicator}-${item.label}`}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p>
                </div>
                <Badge variant={severityVariant(item.severity)}>{item.severity}</Badge>
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
                {item.recommendation}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
