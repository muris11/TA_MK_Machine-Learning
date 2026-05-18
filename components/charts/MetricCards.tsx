import { Activity, Gauge, ShieldCheck, Workflow } from "lucide-react"
import { formatMetric } from "@/lib/formatters"
import type { ModelMetadata } from "@/lib/types"
import { Card } from "@/components/ui/card"

export function MetricCards({ metadata }: { metadata: ModelMetadata }) {
  const items = [
    {
      label: "R2 Score",
      value: formatMetric(metadata.metrics.r2_score),
      description: "Kinerja regresi untuk estimasi kemiskinan.",
      icon: Gauge,
    },
    {
      label: "MAE",
      value: formatMetric(metadata.metrics.mae),
      description: "Rata-rata galat absolut model regresi.",
      icon: Activity,
    },
    {
      label: "Classification Accuracy",
      value: formatMetric(metadata.metrics.classification_accuracy),
      description: "Akurasi klasifikasi prioritas intervensi.",
      icon: ShieldCheck,
    },
    {
      label: "Model Type",
      value: metadata.model_type,
      description: `${metadata.best_models.regression} dan ${metadata.best_models.classification}.`,
      icon: Workflow,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <Card key={item.label} className="p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-slate-950">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
