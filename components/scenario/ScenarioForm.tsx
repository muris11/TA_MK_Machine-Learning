"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { RotateCcw, Scale } from "lucide-react"
import { useForm } from "react-hook-form"
import { defaultPredictionInput, defaultScenarioInput } from "@/lib/constants"
import type { ScenarioRequest } from "@/lib/types"
import { scenarioPayloadSchema } from "@/lib/validators"
import { PredictionFields } from "@/components/prediction/PredictionFields"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const defaultValues: ScenarioRequest = {
  baseline: defaultPredictionInput,
  scenario: defaultScenarioInput,
}

export function ScenarioForm({
  isLoading,
  onSubmit,
}: {
  isLoading?: boolean
  onSubmit: (values: ScenarioRequest) => Promise<void> | void
}) {
  const form = useForm<ScenarioRequest>({
    resolver: zodResolver(scenarioPayloadSchema),
    defaultValues,
    mode: "onBlur",
  })

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kondisi Awal</CardTitle>
            <CardDescription>
              Nilai indikator sebelum skenario kebijakan diterapkan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PredictionFields
              prefix="baseline"
              register={form.register}
              errors={form.formState.errors}
              disabled={isLoading}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skenario Kebijakan</CardTitle>
            <CardDescription>
              Nilai indikator setelah intervensi atau perubahan kebijakan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PredictionFields
              prefix="scenario"
              register={form.register}
              errors={form.formState.errors}
              disabled={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          <Scale className="h-4 w-4" aria-hidden="true" />
          {isLoading ? "Membandingkan" : "Bandingkan Skenario"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          className="w-full sm:w-auto"
          onClick={() => form.reset(defaultValues)}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset Contoh
        </Button>
      </div>
    </form>
  )
}
