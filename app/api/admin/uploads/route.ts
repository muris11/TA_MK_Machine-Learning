import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getAdminSession } from "@/lib/admin-auth"
import { getRequiredCsvColumns, ingestCsvUpload, listCsvUploads } from "@/lib/admin-csv"
import { createClient } from "@/utils/supabase/server"

export const runtime = "nodejs"

export async function GET() {
  const session = await getAdminSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    return NextResponse.json({
      uploads: await listCsvUploads(),
      requiredColumns: getRequiredCsvColumns(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Riwayat CSV gagal dibaca." },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File CSV belum dipilih." }, { status: 400 })
    }

    const { upload, uploads } = await ingestCsvUpload({
      client: supabase,
      file,
      uploadedBy: session.id,
    })

    return NextResponse.json({ upload, uploads }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "CSV gagal diunggah." },
      { status: 400 },
    )
  }
}
