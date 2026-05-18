import { ArrowRight, ClipboardList, FileCheck2, Gauge, Settings2 } from "lucide-react"
import { SectionHeader } from "@/components/sections/SectionHeader"
import { Card } from "@/components/ui/card"

const steps = [
  {
    title: "Input Indikator",
    description: "Tahun, Gini Ratio, TPT, inflasi, dan IPM menjadi parameter analisis.",
    icon: ClipboardList,
  },
  {
    title: "Model Prediksi",
    description: "Sistem menghitung estimasi kemiskinan melalui logic prediksi MVP.",
    icon: Settings2,
  },
  {
    title: "Prioritas",
    description: "Prediksi dipetakan ke level intervensi berdasarkan threshold artifact.",
    icon: Gauge,
  },
  {
    title: "Rekomendasi",
    description: "Sistem menyusun alasan, aksi kebijakan, dan timeline implementasi.",
    icon: FileCheck2,
  },
]

export function WorkflowSection() {
  return (
    <section className="border-y border-slate-200 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Alur Sistem"
          title="Dari indikator ke rekomendasi kebijakan"
          description="Workflow dibuat modular agar mode static dapat diganti ke ONNX atau backend Python pada tahap production."
        />
        <div className="grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <div key={step.title} className="relative">
                <Card className="h-full p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                </Card>
                {index < steps.length - 1 ? (
                  <ArrowRight
                    className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-slate-300 lg:block"
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
