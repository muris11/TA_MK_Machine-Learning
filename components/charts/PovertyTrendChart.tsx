"use client"

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { formatPercent } from "@/lib/formatters"
import type { PredictionInput, PredictionResult, TrendPoint } from "@/lib/types"
import { cn } from "@/lib/utils"

export function PovertyTrendChart({
  data,
  current,
  className,
}: {
  data: TrendPoint[]
  current?: {
    input: PredictionInput
    result: PredictionResult
  }
  className?: string
}) {
  const values = [
    ...data.map((point) => point.kemiskinan),
    ...(current ? [current.result.prediksi_kemiskinan] : []),
  ]
  const min = Math.max(0, Math.min(...values) - 0.3)
  const max = Math.max(...values) + 0.3

  return (
    <div
      className={cn(
        "h-[280px] w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:h-[320px]",
        className,
      )}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 14, left: -12, bottom: 4 }}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
          <XAxis
            dataKey="tahun"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748B", fontSize: 12 }}
          />
          <YAxis
            domain={[min, max]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748B", fontSize: 12 }}
            tickFormatter={(value) => `${Number(value).toFixed(1)}%`}
          />
          <Tooltip
            formatter={(value) => [formatPercent(Number(value ?? 0)), "Kemiskinan"]}
            labelFormatter={(value) => `Tahun ${value}`}
            contentStyle={{
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            }}
          />
          <Legend wrapperStyle={{ color: "#475569", fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="kemiskinan"
            name="Tren kemiskinan"
            stroke="#1E3A8A"
            strokeWidth={3}
            dot={{ r: 3, strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
          {current ? (
            <ReferenceDot
              x={current.input.tahun}
              y={current.result.prediksi_kemiskinan}
              r={7}
              fill="#B91C1C"
              stroke="#FFFFFF"
              strokeWidth={3}
              label={{
                value: "Prediksi",
                position: "top",
                fill: "#B91C1C",
                fontSize: 12,
                fontWeight: 600,
              }}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
