"use client"

import { useMemo, useSyncExternalStore } from "react"
import { buildPredictionResult } from "@/lib/prediction"
import {
  latestPredictionStorageKey,
  parseLatestPredictionInput,
} from "@/lib/prediction-storage"
import { buildIndicatorDiagnosis } from "@/lib/recommendation"
import { buildReportMarkdown } from "@/lib/report"
import type { PredictionInput } from "@/lib/types"
import { ReportPreview } from "@/components/report/ReportPreview"

function buildReportData(input: PredictionInput) {
  const result = buildPredictionResult(input)
  const diagnosis = buildIndicatorDiagnosis(input)
  const markdown = buildReportMarkdown({ input, result, diagnosis })

  return { input, result, diagnosis, markdown }
}

function subscribeToLatestPrediction(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange)

  return () => window.removeEventListener("storage", onStoreChange)
}

function getLatestPredictionSnapshot() {
  return window.localStorage.getItem(latestPredictionStorageKey) ?? ""
}

function getServerPredictionSnapshot() {
  return ""
}

export function ReportWorkspace({ fallbackInput }: { fallbackInput: PredictionInput }) {
  const storedSnapshot = useSyncExternalStore(
    subscribeToLatestPrediction,
    getLatestPredictionSnapshot,
    getServerPredictionSnapshot,
  )
  const storedInput = useMemo(
    () => parseLatestPredictionInput(storedSnapshot),
    [storedSnapshot],
  )
  const input = storedInput ?? fallbackInput
  const reportData = useMemo(() => buildReportData(input), [input])

  return <ReportPreview {...reportData} />
}
