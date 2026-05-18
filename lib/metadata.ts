import featureImportanceJson from "@/data/feature_importance.json"
import modelMetadataJson from "@/data/model_metadata.json"
import recommendationRulesJson from "@/data/recommendation_rules.json"
import sampleInputOutputJson from "@/data/sample_input_output.json"
import trendDataJson from "@/data/trend_data.json"
import type {
  FeatureImportance,
  ModelMetadata,
  PredictionInput,
  PredictionResult,
  RecommendationRuleSet,
  TrendData,
} from "@/lib/types"

type SampleInputOutput = {
  created_at: string
  input: PredictionInput
  output: Omit<PredictionResult, "metadata">
}

export function getModelMetadata() {
  return modelMetadataJson as ModelMetadata
}

export function getRecommendationRules() {
  return recommendationRulesJson as RecommendationRuleSet
}

export function getSampleInputOutput() {
  return sampleInputOutputJson as SampleInputOutput
}

export function getFeatureImportance() {
  return featureImportanceJson as FeatureImportance[]
}

export function getTrendData() {
  return trendDataJson as TrendData
}

export function getModelInfoResponse() {
  const metadata = getModelMetadata()

  return {
    project_title: metadata.project_title,
    model_type: metadata.model_type,
    best_models: metadata.best_models,
    metrics: metadata.metrics,
  }
}
