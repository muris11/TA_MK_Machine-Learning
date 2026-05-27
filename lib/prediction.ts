import { getModelMetadata } from "@/lib/metadata"
import { classifyPriority, getRecommendationRule } from "@/lib/recommendation"
import type { PredictionInput, PredictionResult } from "@/lib/types"
import { roundTo } from "@/lib/utils"

export function simulatePrediction(input: PredictionInput): number {
  const inflasiImpact = (input.rata_rata_inflasi_tahunan - 2.5) * 1.6
  const giniImpact = (input.gini_ratio / 1000 - 0.4) * 2
  const unemploymentImpact = (input.tingkat_penganggur_terbuka - 7) * 0.05
  const ipmImpact = (73 - input.indeks_pembangunan_manusia) * 0.02

  return roundTo(
    Math.max(0, 7 + inflasiImpact + giniImpact + unemploymentImpact + ipmImpact),
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
