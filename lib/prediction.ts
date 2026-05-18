import { getModelMetadata } from "@/lib/metadata"
import { classifyPriority, getRecommendationRule } from "@/lib/recommendation"
import type { PredictionInput, PredictionResult } from "@/lib/types"
import { roundTo } from "@/lib/utils"

export function simulatePrediction(input: PredictionInput): number {
  const base = 7.4
  const ipmImpact = (73.5 - input.indeks_pembangunan_manusia) * 0.085
  const unemploymentImpact = (input.tingkat_penganggur_terbuka - 5) * 0.09
  const giniImpact = (input.gini_ratio - 400) * 0.0008
  const inflationImpact = (input.rata_rata_inflasi_tahunan - 0.15) * 0.25
  const yearImpact = (input.tahun - 2029) * 0.01

  return roundTo(
    Math.max(
      0,
      base + ipmImpact + unemploymentImpact + giniImpact + inflationImpact + yearImpact,
    ),
  )
}

export function buildPredictionResult(input: PredictionInput): PredictionResult {
  const metadata = getModelMetadata()
  const prediction = simulatePrediction(input)
  const priorityLevel = classifyPriority(prediction)
  const rule = getRecommendationRule(priorityLevel)

  return {
    prediksi_kemiskinan: prediction,
    priority_level: priorityLevel,
    status: rule.status,
    rekomendasi_utama: rule.main_recommendation,
    alasan: rule.reason,
    aksi_kebijakan: rule.policy_actions,
    timeline: rule.timeline,
    metadata: {
      model: `${metadata.best_models.regression} + ${metadata.best_models.classification}`,
      r2_score: metadata.metrics.r2_score,
      mae: metadata.metrics.mae,
      classification_accuracy: metadata.metrics.classification_accuracy,
    },
  }
}
