"use client"

import { AlertTriangle, RefreshCcw } from "lucide-react"
import { PageShell } from "@/components/layout/PageShell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <PageShell>
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <AlertTriangle className="h-6 w-6 shrink-0 text-red-800" aria-hidden="true" />
            <div>
              <h1 className="text-xl font-bold text-red-950">Halaman belum dapat dimuat</h1>
              <p className="mt-2 text-sm leading-6 text-red-900">
                Terjadi kesalahan saat memproses halaman. Coba muat ulang halaman ini.
              </p>
              {error.digest ? (
                <p className="mt-2 font-mono text-xs text-red-800">Digest: {error.digest}</p>
              ) : null}
              <Button variant="danger" className="mt-4" onClick={reset}>
                <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                Muat Ulang
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
