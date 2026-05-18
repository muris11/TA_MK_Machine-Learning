import { getModelMetadata, getRecommendationRules } from "@/lib/metadata"
import type {
  IndicatorDiagnosis,
  PredictionInput,
  PriorityLevel,
  RecommendationRule,
} from "@/lib/types"

export function classifyPriority(prediction: number): PriorityLevel {
  const metadata = getModelMetadata()
  const { low_threshold: lowThreshold, high_threshold: highThreshold } =
    metadata.priority_thresholds

  if (prediction <= lowThreshold) {
    return "Low Priority"
  }

  if (prediction <= highThreshold) {
    return "Medium Priority"
  }

  return "High Priority"
}

export function getRecommendationRule(priorityLevel: PriorityLevel): RecommendationRule {
  const rules = getRecommendationRules()

  return rules[priorityLevel] ?? rules["Medium Priority"]
}

export function buildIndicatorDiagnosis(input: PredictionInput): IndicatorDiagnosis[] {
  const diagnosis: IndicatorDiagnosis[] = []

  if (input.indeks_pembangunan_manusia < 70) {
    diagnosis.push({
      indicator: "indeks_pembangunan_manusia",
      label: "IPM rendah",
      severity: "prioritas",
      summary: "Kualitas SDM berada di bawah batas aman untuk skenario sosial jangka menengah.",
      recommendation:
        "Prioritaskan akses pendidikan, layanan kesehatan dasar, dan program peningkatan produktivitas rumah tangga.",
    })
  } else if (input.indeks_pembangunan_manusia < 74) {
    diagnosis.push({
      indicator: "indeks_pembangunan_manusia",
      label: "IPM perlu dipantau",
      severity: "perlu dipantau",
      summary: "IPM masih berada dekat titik tengah dan perlu dijaga agar tidak menekan daya tahan sosial.",
      recommendation:
        "Jaga kualitas layanan pendidikan dan kesehatan serta perkuat program peningkatan keterampilan.",
    })
  } else {
    diagnosis.push({
      indicator: "indeks_pembangunan_manusia",
      label: "IPM stabil",
      severity: "stabil",
      summary: "IPM berada pada rentang yang relatif mendukung penurunan risiko kemiskinan.",
      recommendation:
        "Pertahankan program penguatan SDM dan pantau kesenjangan akses antarwilayah.",
    })
  }

  if (input.tingkat_penganggur_terbuka > 6.5) {
    diagnosis.push({
      indicator: "tingkat_penganggur_terbuka",
      label: "TPT tinggi",
      severity: "prioritas",
      summary: "Pengangguran terbuka menjadi sumber tekanan langsung terhadap pendapatan rumah tangga.",
      recommendation:
        "Percepat job matching, pelatihan kerja singkat, dan program padat karya di wilayah rentan.",
    })
  } else if (input.tingkat_penganggur_terbuka > 5) {
    diagnosis.push({
      indicator: "tingkat_penganggur_terbuka",
      label: "TPT perlu dipantau",
      severity: "perlu dipantau",
      summary: "TPT masih perlu dipantau agar tidak mengangkat risiko kemiskinan pada periode berikutnya.",
      recommendation:
        "Perluas akses pelatihan vokasi dan insentif penyerapan tenaga kerja lokal.",
    })
  } else {
    diagnosis.push({
      indicator: "tingkat_penganggur_terbuka",
      label: "TPT terkendali",
      severity: "stabil",
      summary: "TPT berada pada rentang yang relatif terkendali untuk skenario prediksi.",
      recommendation:
        "Pertahankan hubungan industri, pusat karier, dan dukungan UMKM padat karya.",
    })
  }

  if (input.gini_ratio > 430) {
    diagnosis.push({
      indicator: "gini_ratio",
      label: "Ketimpangan tinggi",
      severity: "prioritas",
      summary: "Ketimpangan pendapatan dapat memperlemah dampak program sosial umum.",
      recommendation:
        "Tingkatkan targeting bantuan, akses modal mikro, dan pemberdayaan ekonomi kelompok rentan.",
    })
  } else if (input.gini_ratio > 390) {
    diagnosis.push({
      indicator: "gini_ratio",
      label: "Ketimpangan perlu dipantau",
      severity: "perlu dipantau",
      summary: "Gini Ratio masih perlu dipantau agar pemerataan manfaat program tetap terjaga.",
      recommendation:
        "Pantau distribusi bantuan dan fokuskan intervensi pada kelompok pendapatan terbawah.",
    })
  } else {
    diagnosis.push({
      indicator: "gini_ratio",
      label: "Ketimpangan relatif terkendali",
      severity: "stabil",
      summary: "Gini Ratio berada pada rentang yang relatif mendukung stabilitas sosial.",
      recommendation:
        "Pertahankan program pemberdayaan ekonomi lokal dan monitoring kelompok rentan.",
    })
  }

  if (input.rata_rata_inflasi_tahunan > 3) {
    diagnosis.push({
      indicator: "rata_rata_inflasi_tahunan",
      label: "Inflasi tinggi",
      severity: "prioritas",
      summary: "Inflasi tinggi dapat menekan daya beli kelompok miskin dan rentan.",
      recommendation:
        "Siapkan stabilisasi harga kebutuhan pokok, bantuan pangan, dan operasi pasar terarah.",
    })
  } else if (input.rata_rata_inflasi_tahunan > 1) {
    diagnosis.push({
      indicator: "rata_rata_inflasi_tahunan",
      label: "Inflasi perlu dipantau",
      severity: "perlu dipantau",
      summary: "Inflasi masih perlu dijaga agar tidak mengurangi efektivitas bantuan sosial.",
      recommendation:
        "Perkuat pemantauan harga pangan dan sinkronkan bantuan dengan tekanan biaya hidup.",
    })
  } else {
    diagnosis.push({
      indicator: "rata_rata_inflasi_tahunan",
      label: "Inflasi terkendali",
      severity: "stabil",
      summary: "Inflasi berada pada rentang yang relatif tidak menekan hasil prediksi.",
      recommendation:
        "Lanjutkan pemantauan harga dan jaga pasokan komoditas dasar.",
    })
  }

  if (input.tahun >= 2032) {
    diagnosis.push({
      indicator: "tahun",
      label: "Horizon prediksi jauh",
      severity: "perlu dipantau",
      summary: "Prediksi semakin jauh dari data dasar sehingga perlu dibaca dengan kehati-hatian.",
      recommendation:
        "Gunakan hasil sebagai simulasi kebijakan dan perbarui input ketika data terbaru tersedia.",
    })
  }

  return diagnosis
}
