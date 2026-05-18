import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function PageShell({
  children,
  className,
  contentClassName,
}: {
  children: ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <main className={cn("min-h-[calc(100vh-9rem)]", className)}>
      <div className={cn("mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8", contentClassName)}>
        {children}
      </div>
    </main>
  )
}
