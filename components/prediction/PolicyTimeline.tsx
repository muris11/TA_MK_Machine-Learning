import { CalendarRange } from "lucide-react"
import type { PredictionResult } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const timelineOrder: Array<keyof PredictionResult["timeline"]> = [
  "0-3 bulan",
  "3-12 bulan",
  "1-3 tahun",
]

export function PolicyTimeline({ timeline }: { timeline: PredictionResult["timeline"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline Implementasi</CardTitle>
        <CardDescription>
          Prioritas aksi dibagi dalam horizon cepat, menengah, dan struktural.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-3">
          {timelineOrder.map((period) => (
            <div key={period} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <CalendarRange className="h-4 w-4 text-blue-900" aria-hidden="true" />
                {period}
              </div>
              <ul className="mt-3 space-y-2">
                {timeline[period].map((item) => (
                  <li key={item} className="text-sm leading-6 text-slate-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
