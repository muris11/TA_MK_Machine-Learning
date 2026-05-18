"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { formatPercent } from "@/lib/formatters"
import type { PriorityDistribution } from "@/lib/types"

const priorityColors: Record<string, string> = {
  "Low Priority": "#047857",
  "Medium Priority": "#B45309",
  "High Priority": "#B91C1C",
}

export function PriorityDistributionChart({ data }: { data: PriorityDistribution[] }) {
  return (
    <div className="h-[280px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 16, left: -16, bottom: 4 }}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="priority"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748B", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748B", fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value) => [formatPercent(Number(value), 0), "Proporsi"]}
            contentStyle={{
              border: "1px solid #E2E8F0",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            }}
          />
          <Bar dataKey="value" name="Distribusi prioritas" radius={8}>
            {data.map((entry) => (
              <Cell key={entry.priority} fill={priorityColors[entry.priority]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
