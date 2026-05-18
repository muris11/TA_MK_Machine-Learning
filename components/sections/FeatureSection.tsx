import { Activity, FileText, LineChart, ShieldCheck } from "lucide-react"
import { SectionHeader } from "@/components/sections/SectionHeader"
import { Card } from "@/components/ui/card"

const features = [
  {
    title: "Prediksi Kemiskinan",
    description:
      "Menghasilkan estimasi angka kemiskinan dari lima indikator sosial ekonomi utama.",
    note: "Regresi berbasis artifact model.",
    icon: LineChart,
  },
  {
    title: "Prioritas Intervensi",
    description:
      "Memetakan prediksi menjadi Low, Medium, atau High Priority memakai threshold model.",
    note: "Klasifikasi prioritas sosial.",
    icon: ShieldCheck,
  },
  {
    title: "Rekomendasi Kebijakan",
    description:
      "Memberikan alasan, aksi kebijakan, dan timeline implementasi yang dapat ditindaklanjuti.",
    note: "Rule-based recommendation.",
    icon: FileText,
  },
  {
    title: "Scenario Comparison",
    description:
      "Membandingkan kondisi awal dan skenario kebijakan untuk melihat dampak perubahan indikator.",
    note: "Delta dan narasi otomatis.",
    icon: Activity,
  },
]

export function FeatureSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Fitur MVP"
          title="Fitur utama untuk analisis sosial berbasis data"
          description="Setiap fitur dirancang untuk membantu pengguna memahami hasil model, bukan hanya melihat angka prediksi."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <Card key={feature.title} className="p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                  {feature.note}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
