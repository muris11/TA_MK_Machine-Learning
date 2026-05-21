"use client"

import dynamic from "next/dynamic"

export const DynamicPovertyTrendChart = dynamic(
  () => import("@/components/charts/PovertyTrendChart").then((mod) => mod.PovertyTrendChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:h-[320px]">
        <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
      </div>
    ),
  },
)

export const DynamicFeatureImportanceChart = dynamic(
  () =>
    import("@/components/charts/FeatureImportanceChart").then(
      (mod) => mod.FeatureImportanceChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
      </div>
    ),
  },
)

export const DynamicPriorityDistributionChart = dynamic(
  () =>
    import("@/components/charts/PriorityDistributionChart").then(
      (mod) => mod.PriorityDistributionChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
      </div>
    ),
  },
)
