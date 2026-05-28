import { randomUUID } from "node:crypto"
import { cookies } from "next/headers"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/server"
import type { Database, Json } from "@/utils/supabase/database.types"

export type CsvPreviewRow = Record<string, string>

export type UploadedCsvRecord = {
  id: string
  uploadedBy: string
  originalName: string
  storedName: string
  size: number
  uploadedAt: string
  columns: string[]
  rowCount: number
  previewRows: CsvPreviewRow[]
}

export const maxCsvSizeBytes = 5 * 1024 * 1024

const columnAliases: Record<string, string[]> = {
  wilayah: ["wilayah", "nama_kabupaten_kota"],
  persentase_kemiskinan: ["persentase_kemiskinan", "persentase_penduduk_miskin"],
}

const requiredColumns = [
  "wilayah",
  "tahun",
  "gini_ratio",
  "tingkat_penganggur_terbuka",
  "rata_rata_inflasi_tahunan",
  "indeks_pembangunan_manusia",
  "persentase_kemiskinan",
]

const priorityThresholds = { low: 7.46, high: 7.88 }

const allowedPriorityLevels = new Set(["Low Priority", "Medium Priority", "High Priority"])

function computePriorityLevel(persentaseKemiskinan: number) {
  if (persentaseKemiskinan <= priorityThresholds.low) return "Low Priority"
  if (persentaseKemiskinan <= priorityThresholds.high) return "Medium Priority"
  return "High Priority"
}

function resolveColumn(normalizedColumns: string[], aliases: string[]) {
  for (const alias of aliases) {
    const index = normalizedColumns.indexOf(alias)
    if (index !== -1) return { name: alias, index }
  }
  return null
}

type CsvRowData = Record<string, string>

type CsvUploadRow = Database["public"]["Tables"]["admin_csv_uploads"]["Row"]
type CsvUploadInsert = Database["public"]["Tables"]["admin_csv_uploads"]["Insert"]
type CsvUploadEntry = UploadedCsvRecord
type CsvRowInsert = Database["public"]["Tables"]["admin_csv_rows"]["Insert"]

function sanitizeFileName(fileName: string) {
  const withoutPath = fileName.split(/[/\\]/).pop() ?? fileName
  const normalized = withoutPath
    .replace(/\.csv$/i, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

  return `${normalized || "dataset"}.csv`
}

function parseCsv(text: string) {
  const rows: string[][] = []
  let currentCell = ""
  let currentRow: string[] = []
  let inQuotes = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    const nextCharacter = text[index + 1]

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        currentCell += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (character === "," && !inQuotes) {
      currentRow.push(currentCell.trim())
      currentCell = ""
      continue
    }

    if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && nextCharacter === "\n") {
        index += 1
      }
      currentRow.push(currentCell.trim())
      rows.push(currentRow)
      currentCell = ""
      currentRow = []
      continue
    }

    currentCell += character
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim())
    rows.push(currentRow)
  }

  return rows.filter((row) => row.some((cell) => cell.length > 0))
}

function parseRequiredNumber(
  row: CsvRowData,
  key: keyof CsvRowData,
  label: string,
  rowNumber: number,
  { integer = false, smartScale = false }: { integer?: boolean; smartScale?: boolean } = {},
) {
  const rawValue = row[key]?.trim()

  if (!rawValue) {
    throw new Error(`Baris ${rowNumber}: kolom ${label} wajib diisi.`)
  }

  const normalizedValue = rawValue.replace(",", ".")
  let numericValue = Number(normalizedValue)

  if (!Number.isFinite(numericValue)) {
    throw new Error(`Baris ${rowNumber}: kolom ${label} harus berupa angka.`)
  }

  if (smartScale && Math.abs(numericValue) > 1000) {
    while (Math.abs(numericValue) > 20) numericValue /= 10
  }

  if (integer && !Number.isInteger(numericValue)) {
    throw new Error(`Baris ${rowNumber}: kolom ${label} harus berupa bilangan bulat.`)
  }

  return numericValue
}

function parseRequiredText(row: CsvRowData, key: keyof CsvRowData, label: string, rowNumber: number) {
  const value = row[key]?.trim()

  if (!value) {
    throw new Error(`Baris ${rowNumber}: kolom ${label} wajib diisi.`)
  }

  return value
}

function parsePriorityLevel(value: string, rowNumber: number) {
  const priority = value.trim()

  if (!allowedPriorityLevels.has(priority)) {
    throw new Error(
      `Baris ${rowNumber}: priority_level harus salah satu dari Low Priority, Medium Priority, atau High Priority.`,
    )
  }

  return priority
}

function toPreviewRows(headers: string[], rows: CsvRowData[]) {
  return rows.slice(0, 5).map((row) =>
    headers.reduce<CsvPreviewRow>((preview, column) => {
      preview[column] = row[column] ?? ""
      return preview
    }, {}),
  )
}

function mapUploadRow(row: CsvUploadRow): CsvUploadEntry {
  const previewRows =
    Array.isArray(row.preview_rows) &&
    row.preview_rows.every((entry) => entry && typeof entry === "object" && !Array.isArray(entry))
      ? (row.preview_rows as CsvPreviewRow[])
      : []

  return {
    id: row.id,
    uploadedBy: row.uploaded_by,
    originalName: row.original_name,
    storedName: row.stored_name,
    size: Number(row.size),
    uploadedAt: row.uploaded_at,
    columns: row.columns,
    rowCount: row.row_count,
    previewRows,
  }
}

function splitIntoChunks<T>(items: T[], size: number) {
  const chunks: T[][] = []

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }

  return chunks
}

async function resolveClient(client?: SupabaseClient<Database>) {
  if (client) {
    return client
  }

  const cookieStore = await cookies()
  return createClient(cookieStore)
}

export async function listCsvUploads(client?: SupabaseClient<Database>) {
  const supabase = await resolveClient(client)
  const { data, error } = await supabase
    .from("admin_csv_uploads")
    .select("*")
    .order("uploaded_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map(mapUploadRow)
}

export async function ingestCsvUpload({
  client,
  file,
  uploadedBy,
}: {
  client?: SupabaseClient<Database>
  file: File
  uploadedBy: string
}) {
  const supabase = await resolveClient(client)

  if (!file.name.toLowerCase().endsWith(".csv")) {
    throw new Error("File harus berformat .csv.")
  }

  if (file.size <= 0) {
    throw new Error("File CSV kosong.")
  }

  if (file.size > maxCsvSizeBytes) {
    throw new Error("Ukuran CSV maksimal 5 MB.")
  }

  const allowedTypes = new Set([
    "",
    "text/csv",
    "application/csv",
    "application/vnd.ms-excel",
    "text/plain",
    "application/octet-stream",
    "binary/octet-stream",
  ])

  if (!allowedTypes.has(file.type)) {
    throw new Error("Tipe file tidak dikenali sebagai CSV.")
  }

  const content = Buffer.from(await file.arrayBuffer()).toString("utf8")
  const rows = parseCsv(content)
  const [columns, ...dataRows] = rows

  if (!columns || columns.length === 0) {
    throw new Error("Header CSV tidak ditemukan.")
  }

  const normalizedColumns = columns.map((column) => column.trim())
  const missingColumns = requiredColumns.filter((column) => {
    const aliases = columnAliases[column]
    return aliases ? !resolveColumn(normalizedColumns, aliases) : !normalizedColumns.includes(column)
  })

  if (missingColumns.length > 0) {
    throw new Error(`Kolom wajib belum lengkap: ${missingColumns.join(", ")}.`)
  }

  const colName: Record<string, string> = {}
  for (const canonical of requiredColumns) {
    const aliases = columnAliases[canonical]
    if (aliases) {
      const resolved = resolveColumn(normalizedColumns, aliases)
      if (resolved) colName[canonical] = resolved.name
    } else {
      colName[canonical] = canonical
    }
  }

  const storedName = `${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID()}-${sanitizeFileName(
    file.name,
  )}`
  const uploadId = randomUUID()
  const parsedRows = dataRows.map((row) =>
    normalizedColumns.reduce<CsvRowData>((preview, column, index) => {
      preview[column] = row[index] ?? ""
      return preview
    }, {}),
  )
  const previewRows = toPreviewRows(normalizedColumns, parsedRows)

  const rowPayloads: CsvRowInsert[] = parsedRows.map((rawData, index) => {
    const rowNumber = index + 2

    const parsedPersentaseKemiskinan = parseRequiredNumber(
      rawData,
      colName.persentase_kemiskinan!,
      "persentase_kemiskinan",
      rowNumber,
      { smartScale: true },
    )

    let parsedGini = parseRequiredNumber(rawData, "gini_ratio", "gini_ratio", rowNumber, {
      smartScale: true,
    })
    if (parsedGini > 1) parsedGini /= 1000

    return {
      upload_id: uploadId,
      row_number: rowNumber - 1,
      wilayah: parseRequiredText(rawData, colName.wilayah!, "wilayah", rowNumber),
      tahun: parseRequiredNumber(rawData, "tahun", "tahun", rowNumber, { integer: true }),
      gini_ratio: parsedGini,
      tingkat_penganggur_terbuka: parseRequiredNumber(
        rawData,
        "tingkat_penganggur_terbuka",
        "tingkat_penganggur_terbuka",
        rowNumber,
        { smartScale: true },
      ),
      rata_rata_inflasi_tahunan: parseRequiredNumber(
        rawData,
        "rata_rata_inflasi_tahunan",
        "rata_rata_inflasi_tahunan",
        rowNumber,
        { smartScale: true },
      ),
      indeks_pembangunan_manusia: parseRequiredNumber(
        rawData,
        "indeks_pembangunan_manusia",
        "indeks_pembangunan_manusia",
        rowNumber,
      ),
      persentase_kemiskinan: parsedPersentaseKemiskinan,
      priority_level: computePriorityLevel(parsedPersentaseKemiskinan),
      raw_data: rawData as Json,
    }
  })

  const uploadPayload: CsvUploadInsert = {
    id: uploadId,
    uploaded_by: uploadedBy,
    original_name: file.name,
    stored_name: storedName,
    size: file.size,
    columns: normalizedColumns,
    row_count: dataRows.length,
    preview_rows: previewRows as Json,
  }

  const { data: insertedUpload, error: uploadError } = await supabase
    .from("admin_csv_uploads")
    .insert(uploadPayload)
    .select("*")
    .single()

  if (uploadError || !insertedUpload) {
    throw new Error(uploadError?.message ?? "CSV gagal disimpan ke database.")
  }

  for (const chunk of splitIntoChunks(rowPayloads, 250)) {
    const { error: rowsError } = await supabase.from("admin_csv_rows").insert(chunk)

    if (rowsError) {
      await supabase.from("admin_csv_uploads").delete().eq("id", uploadId)
      throw new Error(rowsError.message)
    }
  }

  return {
    upload: mapUploadRow(insertedUpload),
    uploads: await listCsvUploads(supabase),
  }
}

export type CsvColumnInfo = {
  name: string
  aliases: string[]
}

export function getRequiredCsvColumns() {
  return requiredColumns.map((col) => ({
    name: col,
    aliases: columnAliases[col] ?? [],
  }))
}

export function getCsvColumnHelp() {
  return `Kolom yang diterima: ${requiredColumns.join(", ")}. ${Object.entries(columnAliases)
    .filter(([, aliases]) => aliases.length > 1)
    .map(([canonical, aliases]) => `"${canonical}" bisa ditulis sebagai ${aliases.map((a) => `"${a}"`).join(" atau ")}`)
    .join(". ")}. Kolom "priority_level" akan dihitung otomatis dari persentase_kemiskinan.`
}
