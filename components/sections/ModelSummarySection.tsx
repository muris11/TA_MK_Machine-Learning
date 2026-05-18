import { DynamicFeatureImportanceChart } from "@/components/charts/DynamicCharts"
import { MetricCards } from "@/components/charts/MetricCards"
import { SectionHeader } from "@/components/sections/SectionHeader"
import { getFeatureImportance, getModelMetadata } from "@/lib/metadata"

export function ModelSummarySection() {
  const metadata = getModelMetadata()
  const featureImportance = getFeatureImportance()

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Model Summary"
          title="Performa model dan indikator yang dianalisis"
          description="Metrik model ditampilkan agar pengguna memahami dasar evaluasi dan batasan interpretasi."
        />
        <div className="space-y-6">
          <MetricCards metadata={metadata} />
          <DynamicFeatureImportanceChart data={featureImportance} />
        </div>
      </div>
    </section>
  )
}
