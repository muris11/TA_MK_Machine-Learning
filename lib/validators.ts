import { z } from "zod"

export const predictionInputSchema = z.object({
  tahun: z
    .number({ invalid_type_error: "Tahun prediksi harus berupa angka." })
    .int("Tahun prediksi harus berupa bilangan bulat.")
    .min(2020, "Tahun prediksi harus berada pada rentang 2020 sampai 2035.")
    .max(2035, "Tahun prediksi harus berada pada rentang 2020 sampai 2035."),
  gini_ratio: z
    .number({ invalid_type_error: "Gini Ratio harus berupa angka." })
    .min(0, "Gini Ratio harus berada pada rentang 0 sampai 1000.")
    .max(1000, "Gini Ratio harus berada pada rentang 0 sampai 1000."),
  tingkat_penganggur_terbuka: z
    .number({
      invalid_type_error: "Tingkat Pengangguran Terbuka harus berupa angka.",
    })
    .min(0, "TPT harus berada pada rentang 0 sampai 30.")
    .max(30, "TPT harus berada pada rentang 0 sampai 30."),
  rata_rata_inflasi_tahunan: z
    .number({
      invalid_type_error: "Rata-rata inflasi tahunan harus berupa angka.",
    })
    .min(-5, "Inflasi tahunan harus berada pada rentang -5 sampai 20.")
    .max(20, "Inflasi tahunan harus berada pada rentang -5 sampai 20."),
  indeks_pembangunan_manusia: z
    .number({ invalid_type_error: "Nilai IPM harus berupa angka." })
    .min(0, "Nilai IPM harus berada pada rentang 0 sampai 100.")
    .max(100, "Nilai IPM harus berada pada rentang 0 sampai 100."),
})

export const scenarioPayloadSchema = z.object({
  baseline: predictionInputSchema,
  scenario: predictionInputSchema,
})

export type PredictionInputSchema = z.infer<typeof predictionInputSchema>
export type ScenarioPayloadSchema = z.infer<typeof scenarioPayloadSchema>
