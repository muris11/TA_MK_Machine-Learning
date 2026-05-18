import { NextResponse } from "next/server"
import { buildScenarioComparison } from "@/lib/scenario"
import { scenarioPayloadSchema } from "@/lib/validators"

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parsed = scenarioPayloadSchema.safeParse(payload)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Payload scenario tidak valid. Periksa input dan coba kembali.",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      buildScenarioComparison(parsed.data.baseline, parsed.data.scenario),
    )
  } catch {
    return NextResponse.json(
      { error: "Scenario belum dapat diproses. Periksa payload JSON dan coba kembali." },
      { status: 400 },
    )
  }
}
