import { priorityOrder } from "@/lib/constants"
import { buildPredictionResult } from "@/lib/prediction"
import type { PredictionInput, ScenarioComparisonResult } from "@/lib/types"
import { roundTo } from "@/lib/utils"

function buildNarrative(
  baseline: ScenarioComparisonResult["baseline_result"],
  scenario: ScenarioComparisonResult["scenario_result"],
  change: number,
) {
  if (change < -0.1) {
    return `Skenario kebijakan menunjukkan penurunan estimasi kemiskinan sebesar ${Math.abs(
      change,
    ).toFixed(2)} poin persentase. Prioritas intervensi bergerak dari ${baseline.priority_level} ke ${scenario.priority_level}, sehingga peningkatan IPM, penurunan TPT, atau perbaikan ketimpangan perlu menjadi fokus utama.`
  }

  if (change > 0.1) {
    return `Skenario kebijakan menunjukkan kenaikan estimasi kemiskinan sebesar ${change.toFixed(
      2,
    )} poin persentase. Kondisi ini perlu ditangani dengan intervensi cepat pada indikator yang memburuk, terutama pengangguran, ketimpangan, dan tekanan harga.`
  }

  return `Skenario kebijakan belum mengubah estimasi kemiskinan secara signifikan. Pemerintah perlu menjaga indikator utama tetap stabil dan memperkuat program pencegahan agar risiko tidak meningkat.`
}

export function buildScenarioComparison(
  baselineInput: PredictionInput,
  scenarioInput: PredictionInput,
): ScenarioComparisonResult {
  const baselineResult = buildPredictionResult(baselineInput)
  const scenarioResult = buildPredictionResult(scenarioInput)
  const change = roundTo(
    scenarioResult.prediksi_kemiskinan - baselineResult.prediksi_kemiskinan,
  )
  const baselineRank = priorityOrder[baselineResult.priority_level]
  const scenarioRank = priorityOrder[scenarioResult.priority_level]
  const priorityChange =
    baselineRank === scenarioRank
      ? `${baselineResult.priority_level} tetap ${scenarioResult.priority_level}`
      : `${baselineResult.priority_level} to ${scenarioResult.priority_level}`

  return {
    baseline_result: baselineResult,
    scenario_result: scenarioResult,
    delta: {
      kemiskinan_change: change,
      priority_change: priorityChange,
    },
    scenario_narrative: buildNarrative(baselineResult, scenarioResult, change),
  }
}
