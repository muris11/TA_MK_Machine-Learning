import { PageShell } from "@/components/layout/PageShell"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <PageShell>
      <div className="space-y-6">
        <Skeleton className="h-10 w-2/3 max-w-xl" />
        <Skeleton className="h-24 w-full max-w-3xl" />
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <Skeleton className="h-[520px]" />
          <Skeleton className="h-[520px]" />
        </div>
      </div>
    </PageShell>
  )
}
