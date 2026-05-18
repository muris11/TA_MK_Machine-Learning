"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { RotateCcw, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { defaultPredictionInput } from "@/lib/constants"
import type { PredictionInput } from "@/lib/types"
import { predictionInputSchema } from "@/lib/validators"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PredictionFields } from "@/components/prediction/PredictionFields"

export function PredictionForm({
  defaultValues = defaultPredictionInput,
  isLoading,
  onSubmit,
}: {
  defaultValues?: PredictionInput
  isLoading?: boolean
  onSubmit: (values: PredictionInput) => Promise<void> | void
}) {
  const form = useForm<PredictionInput>({
    resolver: zodResolver(predictionInputSchema),
    defaultValues,
    mode: "onBlur",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Indikator</CardTitle>
        <CardDescription>
          Masukkan indikator sosial ekonomi untuk menghitung estimasi kemiskinan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <PredictionFields
            register={form.register}
            errors={form.formState.errors}
            disabled={isLoading}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              <Send className="h-4 w-4" aria-hidden="true" />
              {isLoading ? "Memproses" : "Jalankan Prediksi"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="w-full sm:w-auto"
              onClick={() => form.reset(defaultValues)}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Gunakan Contoh
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
