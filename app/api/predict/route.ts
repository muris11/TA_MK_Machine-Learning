import { NextResponse } from "next/server"
import { buildPredictionResult } from "@/lib/prediction"
import { predictionInputSchema } from "@/lib/validators"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parsed = predictionInputSchema.safeParse(payload)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Payload prediksi tidak valid. Periksa input dan coba kembali.",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(buildPredictionResult(parsed.data))
  } catch {
    return NextResponse.json(
      { error: "Prediksi belum dapat diproses. Periksa payload JSON dan coba kembali." },
      { status: 400 },
    )
  }
}
