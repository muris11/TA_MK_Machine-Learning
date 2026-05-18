"use client"

import { Check, Clipboard, Download } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function ReportActions({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  function handleDownload() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "laporan-prediksi-kemiskinan-jawa-barat.md"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button onClick={handleCopy} className="w-full sm:w-auto">
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Clipboard className="h-4 w-4" aria-hidden="true" />
        )}
        {copied ? "Tersalin" : "Salin Laporan"}
      </Button>
      <Button variant="outline" onClick={handleDownload} className="w-full sm:w-auto">
        <Download className="h-4 w-4" aria-hidden="true" />
        Download Markdown
      </Button>
    </div>
  )
}
