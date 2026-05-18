import { CheckCircle2, ListChecks } from "lucide-react"
import type { PredictionResult } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function RecommendationPanel({ result }: { result: PredictionResult }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rekomendasi Kebijakan</CardTitle>
        <CardDescription>
          Disusun berdasarkan level prioritas dan rule rekomendasi pada artifact.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-950">Rekomendasi utama</p>
          <p className="mt-2 text-sm leading-6 text-blue-900">{result.rekomendasi_utama}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <ListChecks className="h-4 w-4 text-blue-900" aria-hidden="true" />
            Alasan sistem
          </div>
          <ul className="mt-3 grid gap-2">
            {result.alasan.map((reason) => (
              <li key={reason} className="flex gap-3 text-sm leading-6 text-slate-600">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <ListChecks className="h-4 w-4 text-teal-700" aria-hidden="true" />
            Aksi kebijakan
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {result.aksi_kebijakan.map((action) => (
              <div
                key={action}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700"
              >
                {action}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
