import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "outline" | "success" | "warning" | "danger" | "neutral"

const badgeVariants: Record<BadgeVariant, string> = {
  default: "border-blue-200 bg-blue-50 text-blue-900",
  outline: "border-slate-200 bg-white text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-800",
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
}

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  )
}
