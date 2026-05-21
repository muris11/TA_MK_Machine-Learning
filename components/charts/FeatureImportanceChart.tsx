"use client"

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"
import { formatPercent } from "@/lib/formatters"
import type { FeatureImportance } from "@/lib/types"

export function FeatureImportanceChart({ data }: { data: FeatureImportance[] }) {
  const chartData = data.map((item) => ({
    ...item,
    importancePercent: Math.round(item.importance * 100),
  }))

  return (
    <div className="h-[320px] min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <BarChart
        data={chartData}
        layout="vertical"
        responsive
        style={{ width: "100%", height: "100%" }}
        margin={{ top: 10, right: 18, left: 34, bottom: 0 }}
      >
        <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 45]}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#64748B", fontSize: 12 }}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={156}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#475569", fontSize: 12 }}
        />
        <Tooltip
          formatter={(value) => [formatPercent(Number(value), 0), "Importance"]}
          contentStyle={{
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          }}
        />
        <Bar dataKey="importancePercent" name="Feature importance" fill="#1D4ED8" radius={8} />
      </BarChart>
    </div>
  )
}
