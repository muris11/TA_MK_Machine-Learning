"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Loader2,
  LogOut,
  Upload,
} from "lucide-react"
import type { UploadedCsvRecord } from "@/lib/admin-csv"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

type AdminWorkspaceProps = {
  initialUploads: UploadedCsvRecord[]
  requiredColumns: string[]
  adminEmail: string
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function formatUploadDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export function AdminWorkspace({
  initialUploads,
  requiredColumns,
  adminEmail,
}: AdminWorkspaceProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploads, setUploads] = useState(initialUploads)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const latestUpload = uploads[0]
  const previewColumns = useMemo(
    () => latestUpload?.columns.slice(0, 6) ?? requiredColumns.slice(0, 6),
    [latestUpload, requiredColumns],
  )

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccessMessage("")

    if (!selectedFile) {
      setError("Pilih file CSV terlebih dahulu.")
      return
    }

    const formData = new FormData()
    formData.set("file", selectedFile)
    setIsUploading(true)

    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      })
      const payload = (await response.json()) as {
        error?: string
        uploads?: UploadedCsvRecord[]
        upload?: UploadedCsvRecord
      }

      if (!response.ok) {
        setError(payload.error ?? "CSV gagal diunggah.")
        return
      }

      setUploads(payload.uploads ?? (payload.upload ? [payload.upload, ...uploads] : uploads))
      setSelectedFile(null)
      setSuccessMessage("CSV berhasil diunggah dan dicatat pada riwayat dataset.")

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      router.refresh()
    } catch {
      setError("CSV gagal diunggah. Coba lagi dari browser.")
    } finally {
      setIsUploading(false)
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true)

    try {
      await fetch("/api/admin/logout", { method: "POST" })
    } finally {
      router.replace("/admin/login")
      router.refresh()
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total upload</CardDescription>
            <CardTitle className="flex items-baseline gap-2 text-3xl">
              {uploads.length}
              <span className="text-sm font-medium text-slate-500">dataset</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Kolom wajib</CardDescription>
            <CardTitle className="flex items-baseline gap-2 text-3xl">
              {requiredColumns.length}
              <span className="text-sm font-medium text-slate-500">kolom</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sesi aktif</CardDescription>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="truncate text-lg">{adminEmail}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Keluar
              </Button>
            </div>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-800">
              <Upload className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle>Upload Dataset CSV</CardTitle>
            <CardDescription>
              Unggah dataset baru dengan struktur kolom yang sama seperti dataset kemiskinan Jawa Barat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleUpload}>
              <div className="space-y-2">
                <Label htmlFor="csv-file">File CSV</Label>
                <Input
                  ref={fileInputRef}
                  id="csv-file"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                />
                <p className="text-xs leading-5 text-slate-500">
                  Maksimal 5 MB. Header CSV akan divalidasi sebelum file disimpan.
                </p>
              </div>

              {selectedFile ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                  <div className="flex items-start gap-3">
                    <FileSpreadsheet className="mt-0.5 h-5 w-5 text-teal-700" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950">{selectedFile.name}</p>
                      <p className="mt-1 text-slate-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                  {error}
                </p>
              ) : null}

              {successMessage ? (
                <p className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {successMessage}
                </p>
              ) : null}

              <Button type="submit" disabled={isUploading} className="w-full">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Upload className="h-4 w-4" aria-hidden="true" />
                )}
                {isUploading ? "Mengunggah..." : "Upload CSV"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div>
              <p className="text-sm font-semibold text-slate-950">Kolom yang diterima</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {requiredColumns.map((column) => (
                  <Badge key={column} variant="outline" className="font-mono">
                    {column}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-900">
              <Database className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle>Riwayat Dataset</CardTitle>
            <CardDescription>
              Dataset terbaru tampil paling atas beserta ringkasan baris dan preview data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <FileSpreadsheet className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-slate-950">Belum ada upload CSV</p>
                <p className="mt-1 text-sm text-slate-500">
                  Dataset yang diunggah admin akan muncul di sini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {uploads.map((upload) => (
                  <article
                    key={upload.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-950">
                          {upload.originalName}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatUploadDate(upload.uploadedAt)} · {formatFileSize(upload.size)}
                        </p>
                      </div>
                      <Badge variant="success">{upload.rowCount} baris</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {upload.columns.slice(0, 5).map((column) => (
                        <Badge key={column} variant="neutral" className="font-mono">
                          {column}
                        </Badge>
                      ))}
                      {upload.columns.length > 5 ? (
                        <Badge variant="outline">+{upload.columns.length - 5} kolom</Badge>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {latestUpload ? (
        <Card>
          <CardHeader>
            <CardTitle>Preview Dataset Terbaru</CardTitle>
            <CardDescription>
              Lima baris pertama dari CSV terakhir untuk pengecekan cepat setelah upload.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                    {previewColumns.map((column) => (
                      <th key={column} className="px-4 py-3 font-semibold">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {latestUpload.previewRows.map((row, rowIndex) => (
                    <tr key={`${latestUpload.id}-${rowIndex}`} className="border-b border-slate-100">
                      {previewColumns.map((column) => (
                        <td key={column} className="px-4 py-3 text-slate-700">
                          {row[column] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
