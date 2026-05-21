import type { PredictionInput } from "@/lib/types"

export const siteConfig = {
  name: "Prediksi Kondisi Sosial Jawa Barat",
  shortName: "Kemiskinan Jabar ML",
  description:
    "Dashboard prediksi kemiskinan dan rekomendasi kebijakan sosial berbasis Machine Learning untuk Provinsi Jawa Barat.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
}

export const navigationItems = [
  { href: "/", label: "Beranda" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scenario", label: "Scenario" },
  { href: "/report", label: "Report" },
  { href: "/model-info", label: "Model Info" },
]

export const defaultPredictionInput: PredictionInput = {
  tahun: 2029,
  gini_ratio: 400,
  tingkat_penganggur_terbuka: 5,
  rata_rata_inflasi_tahunan: 0.15,
  indeks_pembangunan_manusia: 73.5,
}

export const defaultScenarioInput: PredictionInput = {
  tahun: 2029,
  gini_ratio: 370,
  tingkat_penganggur_terbuka: 4.2,
  rata_rata_inflasi_tahunan: 0.1,
  indeks_pembangunan_manusia: 75,
}

export const predictionFieldMetadata = [
  {
    name: "tahun",
    label: "Tahun Prediksi",
    helper: "Masukkan tahun prediksi mulai 2020 tanpa batas maksimum.",
    min: 2020,
    step: 1,
  },
  {
    name: "gini_ratio",
    label: "Gini Ratio",
    helper: "Gunakan skala 0 sampai 1000, misalnya 400 untuk 0,400.",
    min: 0,
    max: 1000,
    step: 1,
  },
  {
    name: "tingkat_penganggur_terbuka",
    label: "Tingkat Pengangguran Terbuka",
    helper: "Masukkan persentase TPT pada rentang 0 sampai 30.",
    min: 0,
    max: 30,
    step: 0.1,
  },
  {
    name: "rata_rata_inflasi_tahunan",
    label: "Rata-rata Inflasi Tahunan",
    helper: "Masukkan inflasi tahunan pada rentang -5 sampai 20.",
    min: -5,
    max: 20,
    step: 0.01,
  },
  {
    name: "indeks_pembangunan_manusia",
    label: "Indeks Pembangunan Manusia",
    helper: "Masukkan nilai IPM pada skala 0 sampai 100.",
    min: 0,
    max: 100,
    step: 0.1,
  },
] as const

export const priorityOrder = {
  "Low Priority": 1,
  "Medium Priority": 2,
  "High Priority": 3,
} as const
