import type { PredictionInput } from "@/lib/types"
import { predictionInputSchema } from "@/lib/validators"

export const latestPredictionStorageKey = "kemiskinan-jabar:last-prediction"

export function serializeLatestPredictionInput(input: PredictionInput) {
  return JSON.stringify({
    input,
    saved_at: new Date().toISOString(),
  })
}

export function parseLatestPredictionInput(value: string | null): PredictionInput | null {
  if (!value) {
    return null
  }

  try {
    const payload: unknown = JSON.parse(value)
    const candidate =
      typeof payload === "object" && payload !== null && "input" in payload
        ? (payload as { input: unknown }).input
        : payload
    const parsed = predictionInputSchema.safeParse(candidate)

    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}
