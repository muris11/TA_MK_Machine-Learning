import { NextResponse } from "next/server"
import { getModelInfoResponse } from "@/lib/metadata"

export async function GET() {
  return NextResponse.json(getModelInfoResponse())
}
