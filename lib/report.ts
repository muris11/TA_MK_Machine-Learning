import { siteConfig } from "@/lib/constants"
import { formatMetric, formatModelDate, formatPercent } from "@/lib/formatters"
import { getModelMetadata } from "@/lib/metadata"
import type { IndicatorDiagnosis, PredictionInput, PredictionResult } from "@/lib/types"

export function buildReportMarkdown({
  input,
  result,
  diagnosis,
}: {
  input: PredictionInput
  result: PredictionResult
  diagnosis: IndicatorDiagnosis[]
}) {
  const metadata = getModelMetadata()
  const diagnosisText = diagnosis
    .map(
      (item) =>
        `- ${item.label}: ${item.summary} Rekomendasi: ${item.recommendation}`,
    )
    .join("\n")
  const actions = result.aksi_kebijakan.map((action) => `- ${action}`).join("\n")
  const timeline = Object.entries(result.timeline)
    .map(([period, items]) => `### ${period}\n${items.map((item) => `- ${item}`).join("\n")}`)
    .join("\n\n")

  return `# Laporan Hasil Prediksi Kemiskinan Jawa Barat

## Executive Summary
Sistem ${siteConfig.name} memprediksi estimasi angka kemiskinan sebesar ${formatPercent(
    result.prediksi_kemiskinan,
  )} pada tahun ${input.tahun}. Level prioritas intervensi adalah ${
    result.priority_level
  } dengan status ${result.status.toLowerCase()}.

## Input Indikator
| Indikator | Nilai |
|---|---:|
| Tahun prediksi | ${input.tahun} |
| Gini Ratio | ${formatMetric(input.gini_ratio)} |
| Tingkat Pengangguran Terbuka | ${formatPercent(input.tingkat_penganggur_terbuka)} |
| Rata-rata Inflasi Tahunan | ${formatPercent(input.rata_rata_inflasi_tahunan)} |
| Indeks Pembangunan Manusia | ${formatMetric(input.indeks_pembangunan_manusia)} |

## Hasil Prediksi
- Estimasi kemiskinan: ${formatPercent(result.prediksi_kemiskinan)}
- Level prioritas: ${result.priority_level}
- Status risiko: ${result.status}
- Model: ${result.metadata.model}

## Rekomendasi Kebijakan
${result.rekomendasi_utama}

## Alasan Sistem
${result.alasan.map((reason) => `- ${reason}`).join("\n")}

## Aksi Kebijakan
${actions}

## Diagnosis Indikator
${diagnosisText}

## Timeline Implementasi
${timeline}

## Catatan Risiko Model
Model menggunakan mode static demo berbasis formula simulasi yang meniru perilaku artifact ML. Artifact model asli dibuat pada ${formatModelDate(
    metadata.created_at,
  )}, dengan R2 Score ${formatMetric(metadata.metrics.r2_score)}, MAE ${formatMetric(
    metadata.metrics.mae,
    4,
  )}, dan classification accuracy ${formatMetric(metadata.metrics.classification_accuracy)}. Hasil prediksi perlu ditinjau bersama data terbaru dan konteks kebijakan daerah.
`
}
