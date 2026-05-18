import type { PriorityLevel } from "@/lib/types"

const idNumberFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 2,
})

const idMetricFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatNumber(value: number) {
  return idNumberFormatter.format(value)
}

export function formatMetric(value: number) {
  return idMetricFormatter.format(value)
}

export function formatPercent(value: number, digits = 2) {
  return `${value.toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`
}

export function formatSignedPercent(value: number) {
  const sign = value > 0 ? "+" : ""

  return `${sign}${formatPercent(value)}`
}

export function formatPriority(priority: PriorityLevel) {
  return priority
}

export function formatModelDate(value: string) {
  const [datePart, timePart] = value.split(" ")

  if (!datePart) {
    return value
  }

  const [year, month, day] = datePart.split("-").map(Number)

  if (!year || !month || !day) {
    return value
  }

  const date = new Date(year, month - 1, day)
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)

  return timePart ? `${formattedDate}, ${timePart}` : formattedDate
}
