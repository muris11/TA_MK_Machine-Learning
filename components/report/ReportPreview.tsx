import { ReportActions } from "@/components/report/ReportActions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { predictionFieldMetadata } from "@/lib/constants"
import { formatMetric, formatPercent } from "@/lib/formatters"
import type { IndicatorDiagnosis, PredictionInput, PredictionResult } from "@/lib/types"

function formatInputValue(key: keyof PredictionInput, value: number) {
  if (
    key === "tingkat_penganggur_terbuka" ||
    key === "rata_rata_inflasi_tahunan"
  ) {
    return formatPercent(value)
  }

  if (key === "tahun") {
    return String(value)
  }

  return formatMetric(value)
}

function priorityVariant(priority: PredictionResult["priority_level"]) {
  if (priority === "Low Priority") {
    return "success" as const
  }

  if (priority === "Medium Priority") {
    return "warning" as const
  }

  return "danger" as const
}

export function ReportPreview({
  input,
  result,
  diagnosis,
  markdown,
}: {
  input: PredictionInput
  result: PredictionResult
  diagnosis: IndicatorDiagnosis[]
  markdown: string
}) {
  return (
    <div className="space-y-5">
      <ReportActions markdown={markdown} />
      <Card className="mx-auto max-w-4xl shadow-soft">
        <CardHeader className="border-b border-slate-200">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
            Executive Summary
          </p>
          <CardTitle className="text-2xl sm:text-3xl">
            Laporan Hasil Prediksi Kemiskinan Jawa Barat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-6 sm:p-8">
          <section>
            <p className="text-base leading-8 text-slate-700">
              Sistem memprediksi estimasi angka kemiskinan sebesar{" "}
              <span className="font-semibold text-slate-950">
                {formatPercent(result.prediksi_kemiskinan)}
              </span>{" "}
              pada tahun {input.tahun}. Level prioritas intervensi adalah{" "}
              <Badge variant={priorityVariant(result.priority_level)}>
                {result.priority_level}
              </Badge>{" "}
              dengan status {result.status.toLowerCase()}.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-lg font-semibold text-slate-950">Input Indikator</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                    <th className="px-4 py-3 font-semibold">Indikator</th>
                    <th className="px-4 py-3 text-right font-semibold">Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {predictionFieldMetadata.map((field) => (
                    <tr key={field.name} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-slate-800">{field.label}</td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {formatInputValue(field.name, input[field.name])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-950">Hasil Prediksi</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-950">
                <p className="text-sm font-semibold">Estimasi Kemiskinan</p>
                <p className="mt-2 font-mono text-2xl font-bold">
                  {formatPercent(result.prediksi_kemiskinan)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">Status</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">{result.status}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">Model</p>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {result.metadata.model}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-950">R2 Score</p>
                <p className="mt-2 font-mono text-xl font-bold text-slate-800">
                  {formatMetric(result.metadata.r2_score)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-950">MAE</p>
                <p className="mt-2 font-mono text-xl font-bold text-slate-800">
                  {formatMetric(result.metadata.mae, 4)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-950">Accuracy</p>
                <p className="mt-2 font-mono text-xl font-bold text-slate-800">
                  {formatMetric(result.metadata.classification_accuracy)}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-950">Rekomendasi Kebijakan</h2>
            <p className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-blue-900">
              {result.rekomendasi_utama}
            </p>
            <div className="mt-4 grid gap-2">
              {result.aksi_kebijakan.map((action) => (
                <div
                  key={action}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  {action}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-950">Diagnosis Indikator</h2>
            <div className="mt-4 grid gap-3">
              {diagnosis.map((item) => (
                <div key={`${item.indicator}-${item.label}`} className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.summary}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-950">Timeline Aksi</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {Object.entries(result.timeline).map(([period, items]) => (
                <div key={period} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-950">{period}</p>
                  <ul className="mt-3 space-y-2">
                    {items.map((item) => (
                      <li key={item} className="text-sm leading-6 text-slate-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-950">Catatan Risiko Model</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Hasil prediksi menggunakan mode static demo berbasis formula simulasi. Untuk
              production, inference dapat dipindahkan ke ONNX Runtime atau backend Python yang
              membaca file model PKL.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
