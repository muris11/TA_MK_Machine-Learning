import type { Metadata } from "next"
import {
  DynamicFeatureImportanceChart,
  DynamicPriorityDistributionChart,
} from "@/components/charts/DynamicCharts"
import { MetricCards } from "@/components/charts/MetricCards"
import { PageShell } from "@/components/layout/PageShell"
import { SectionHeader } from "@/components/sections/SectionHeader"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatMetric, formatModelDate } from "@/lib/formatters"
import { getFeatureImportance, getModelMetadata, getTrendData } from "@/lib/metadata"

export const metadata: Metadata = {
  title: "Informasi Model",
  description:
    "Metadata model Machine Learning, metrik evaluasi, feature importance, threshold prioritas, dan batasan model.",
}

export default function ModelInfoPage() {
  const metadata = getModelMetadata()
  const featureImportance = getFeatureImportance()
  const trendData = getTrendData()

  return (
    <PageShell>
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          Model Info
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Transparansi Model Machine Learning
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Informasi model, fitur input, metrik evaluasi, threshold prioritas, dan
          catatan batasan agar hasil prediksi dapat dibaca secara proporsional.
        </p>
      </div>

      <div className="space-y-10">
        <MetricCards metadata={metadata} />

        <section>
          <SectionHeader
            title="Feature Importance dan Distribusi Prioritas"
            description="Visualisasi ringkas untuk memahami kontribusi indikator dan sebaran level prioritas."
          />
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <DynamicFeatureImportanceChart data={featureImportance} />
            <DynamicPriorityDistributionChart data={trendData.priority_distribution} />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Fitur Input</CardTitle>
              <CardDescription>
                Kolom fitur yang digunakan model untuk membuat prediksi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                      <th className="px-4 py-3 font-semibold">No</th>
                      <th className="px-4 py-3 font-semibold">Feature column</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metadata.feature_columns.map((feature, index) => (
                      <tr key={feature} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                        <td className="px-4 py-3 font-mono text-slate-800">{feature}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Threshold Prioritas</CardTitle>
              <CardDescription>
                Aturan klasifikasi level intervensi berdasarkan prediksi kemiskinan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="text-sm font-semibold">Low Priority</p>
                  <p className="mt-1 font-mono text-xl font-bold">
                    ≤ {formatMetric(metadata.priority_thresholds.low_threshold)}%
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  <p className="text-sm font-semibold">Medium Priority</p>
                  <p className="mt-1 font-mono text-xl font-bold">
                    &gt; {formatMetric(metadata.priority_thresholds.low_threshold)}% sampai{" "}
                    {formatMetric(metadata.priority_thresholds.high_threshold)}%
                  </p>
                </div>
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900">
                  <p className="text-sm font-semibold">High Priority</p>
                  <p className="mt-1 font-mono text-xl font-bold">
                    &gt; {formatMetric(metadata.priority_thresholds.high_threshold)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Artifact dan Catatan Batasan</CardTitle>
            <CardDescription>
              Ringkasan sumber model dan batasan pemakaian untuk presentasi akademik.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">Model regresi</p>
              <p className="mt-2 font-mono text-sm text-slate-700">
                {metadata.best_models.regression}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">Model klasifikasi</p>
              <p className="mt-2 font-mono text-sm text-slate-700">
                {metadata.best_models.classification}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">Dibuat pada</p>
              <p className="mt-2 text-sm text-slate-700">
                {formatModelDate(metadata.created_at)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-3">
              <p className="text-sm font-semibold text-slate-950">Catatan batasan model</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Aplikasi MVP memakai mode static demo berbasis artifact JSON dan formula
                simulasi. File PKL disimpan sebagai arsip model Python, sedangkan inference
                production di Vercel sebaiknya memakai ONNX atau backend Python terpisah.
                Metrik yang sangat tinggi tetap perlu dijelaskan sebagai hasil evaluasi dataset
                tertentu dan tidak boleh dibaca sebagai jaminan akurasi untuk semua kondisi.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
