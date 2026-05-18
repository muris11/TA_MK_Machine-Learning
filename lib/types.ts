export type PriorityLevel = "Low Priority" | "Medium Priority" | "High Priority"

export type PredictionInput = {
  tahun: number
  gini_ratio: number
  tingkat_penganggur_terbuka: number
  rata_rata_inflasi_tahunan: number
  indeks_pembangunan_manusia: number
}

export type PredictionResult = {
  prediksi_kemiskinan: number
  priority_level: PriorityLevel
  status: string
  rekomendasi_utama: string
  alasan: string[]
  aksi_kebijakan: string[]
  timeline: {
    "0-3 bulan": string[]
    "3-12 bulan": string[]
    "1-3 tahun": string[]
  }
  metadata: {
    model: string
    r2_score: number
    mae: number
    classification_accuracy: number
  }
}

export type ModelMetadata = {
  project_title: string
  model_type: string
  tasks: {
    regression: string
    classification: string
  }
  best_models: {
    regression: string
    classification: string
  }
  metrics: {
    r2_score: number
    mae: number
    classification_accuracy: number
  }
  feature_columns: string[]
  priority_thresholds: {
    low_threshold: number
    high_threshold: number
  }
  created_at: string
}

export type RecommendationRule = {
  status: string
  main_recommendation: string
  reason: string[]
  policy_actions: string[]
  timeline: PredictionResult["timeline"]
}

export type RecommendationRuleSet = Record<PriorityLevel, RecommendationRule>

export type IndicatorDiagnosis = {
  indicator: keyof PredictionInput
  label: string
  severity: "stabil" | "perlu dipantau" | "prioritas"
  summary: string
  recommendation: string
}

export type ScenarioRequest = {
  baseline: PredictionInput
  scenario: PredictionInput
}

export type ScenarioComparisonResult = {
  baseline_result: PredictionResult
  scenario_result: PredictionResult
  delta: {
    kemiskinan_change: number
    priority_change: string
  }
  scenario_narrative: string
}

export type FeatureImportance = {
  feature: keyof PredictionInput
  label: string
  importance: number
  direction: string
}

export type TrendPoint = {
  tahun: number
  kemiskinan: number
  kategori: PriorityLevel
}

export type PriorityDistribution = {
  priority: PriorityLevel
  value: number
}

export type TrendData = {
  historical: TrendPoint[]
  priority_distribution: PriorityDistribution[]
  scenario_reference: Array<{
    label: string
    kemiskinan: number
  }>
}
