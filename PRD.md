# PRD.md
# Product Requirements Document
# Platform Prediksi Kondisi Sosial Jawa Barat Berbasis Machine Learning

## 1. Ringkasan Produk

Platform ini adalah website berbasis Next.js yang digunakan untuk menampilkan hasil prediksi kondisi sosial Provinsi Jawa Barat menggunakan model Machine Learning. Sistem menerima input indikator ekonomi dan sosial, melakukan prediksi tingkat kemiskinan, menentukan level prioritas intervensi, lalu menghasilkan rekomendasi kebijakan yang dapat digunakan sebagai dasar pengambilan keputusan.

Produk ini dikembangkan sebagai versi web profesional dari proyek Machine Learning yang sebelumnya sudah berjalan dalam notebook, Streamlit, dan Gradio. Website Next.js menjadi tampilan utama untuk pengguna umum, sedangkan notebook tetap digunakan sebagai tempat pelatihan model dan pembuatan artifact seperti `poverty_model_bundle.pkl`, `model_metadata.json`, dan `recommendation_rules.json`.

## 2. Latar Belakang

Kemiskinan merupakan salah satu indikator penting dalam pembangunan daerah. Pemerintah, peneliti, dan analis kebijakan membutuhkan alat bantu yang tidak hanya menampilkan angka prediksi, tetapi juga memberikan interpretasi, alasan, dan rekomendasi kebijakan yang dapat ditindaklanjuti.

Model Machine Learning yang sudah dibuat memiliki dua fungsi utama:

1. Regresi untuk memprediksi estimasi angka kemiskinan.
2. Klasifikasi untuk menentukan level prioritas intervensi sosial.

Agar hasil model lebih mudah dipahami, sistem perlu dikembangkan dalam bentuk website yang rapi, responsif, dan mudah digunakan. Website ini harus menampilkan hasil prediksi secara jelas, memberi rekomendasi otomatis, dan menyediakan halaman analisis tambahan seperti scenario comparison, metadata model, serta ringkasan laporan.

## 3. Tujuan Produk

### 3.1 Tujuan Utama

Membangun website prediksi kondisi sosial Jawa Barat berbasis Next.js yang mampu menampilkan hasil model Machine Learning secara interaktif, informatif, dan siap dipresentasikan sebagai sistem pendukung keputusan.

### 3.2 Tujuan Khusus

1. Menyediakan form input indikator sosial ekonomi.
2. Menampilkan estimasi angka kemiskinan berdasarkan model.
3. Menampilkan level prioritas intervensi: Low Priority, Medium Priority, atau High Priority.
4. Menampilkan rekomendasi kebijakan berdasarkan hasil prediksi.
5. Menyediakan scenario comparison antara kondisi awal dan skenario kebijakan.
6. Menampilkan metadata model, akurasi, MAE, R2 Score, dan classification accuracy.
7. Menyediakan halaman laporan yang bisa digunakan untuk bahan presentasi.
8. Menyusun struktur project yang rapi, scalable, dan siap deploy ke Vercel.
9. Menyediakan jalur integrasi ke model `pkl` atau ONNX untuk pengembangan berikutnya.

## 4. Ruang Lingkup Produk

### 4.1 Scope MVP

MVP wajib memiliki fitur berikut:

1. Landing page.
2. Dashboard prediksi.
3. Form input indikator.
4. Hasil prediksi kemiskinan.
5. Level prioritas intervensi.
6. Panel rekomendasi kebijakan.
7. Scenario comparison.
8. Model information page.
9. Report page.
10. API route untuk prediksi.
11. Data static dari artifact JSON.
12. Responsive layout untuk desktop, tablet, dan mobile.

### 4.2 Scope Lanjutan

Fitur lanjutan yang dapat ditambahkan setelah MVP:

1. Export laporan ke PDF.
2. Login admin.
3. Riwayat prediksi.
4. Database PostgreSQL.
5. Upload dataset baru.
6. Retraining model dari dashboard admin.
7. Integrasi ONNX Runtime agar model dapat berjalan di Vercel tanpa backend Python.
8. Visualisasi peta wilayah Jawa Barat.
9. Role-based dashboard untuk admin, dosen, dan pengguna umum.
10. Monitoring model drift.

### 4.3 Di Luar Scope MVP

Untuk versi awal, hal berikut belum wajib:

1. Database production.
2. Autentikasi pengguna.
3. Retraining model dari website.
4. Integrasi GIS tingkat kabupaten atau kota.
5. Deployment multi-service dengan Kubernetes.
6. Real-time data ingestion dari API pemerintah.

## 5. Target Pengguna

| Pengguna | Kebutuhan |
|---|---|
| Dosen | Melihat apakah proyek ML punya manfaat nyata dan bisa dijelaskan |
| Mahasiswa | Menunjukkan hasil model dalam bentuk website yang rapi |
| Analis Kebijakan | Melihat hasil prediksi dan rekomendasi berbasis indikator |
| Pemerintah Daerah | Mendapatkan gambaran prioritas intervensi |
| Pengguna Umum | Memahami dampak perubahan indikator terhadap kemiskinan |

## 6. Nilai Produk

Produk ini memberikan nilai utama sebagai berikut:

1. Mengubah model ML dari notebook menjadi website yang mudah digunakan.
2. Menampilkan prediksi dalam bentuk yang lebih informatif.
3. Menambahkan rekomendasi kebijakan, bukan hanya angka hasil model.
4. Menyediakan simulasi skenario untuk melihat dampak perubahan indikator.
5. Memberikan tampilan yang lebih profesional untuk presentasi tugas akhir, UTS, atau portofolio.
6. Memisahkan logic prediksi, UI, dan konfigurasi data agar project lebih rapi.

## 7. Arsitektur Produk

### 7.1 Arsitektur MVP

Arsitektur MVP menggunakan Next.js sebagai frontend dan backend ringan melalui Route Handler.

```text
User
  |
  v
Next.js App Router
  |
  |-- Landing Page
  |-- Dashboard Page
  |-- Scenario Page
  |-- Report Page
  |-- Model Info Page
  |
  v
Next.js API Route Handler
  |
  v
Prediction Service
  |
  |-- model_metadata.json
  |-- recommendation_rules.json
  |-- sample_input_output.json
  |
  v
Response Prediksi dan Rekomendasi
```

Pada MVP, prediksi dapat dibuat dengan dua pendekatan:

1. Mode static demo: menggunakan rules, metadata, dan sample output dari artifact.
2. Mode production: menggunakan API backend Python atau ONNX model.

### 7.2 Arsitektur Production Satu Hosting Vercel

Agar bisa tetap satu hosting di Vercel, model perlu dikonversi ke ONNX.

```text
Notebook Python
  |
  |-- Training Random Forest
  |-- Export .pkl untuk arsip Python
  |-- Export .onnx untuk web inference
  |
  v
Next.js on Vercel
  |
  |-- API Route /api/predict
  |-- ONNX Runtime Node
  |-- Recommendation Rules JSON
  |
  v
Result UI
```

### 7.3 Arsitektur Production Alternatif

Jika tetap ingin menggunakan file `.pkl`, maka model dijalankan di backend Python.

```text
Next.js Website
  |
  v
FastAPI Backend
  |
  v
poverty_model_bundle.pkl
```

Untuk kebutuhan satu hosting di Vercel, pendekatan ONNX lebih disarankan. Untuk kebutuhan paling cepat dan aman secara Python, gunakan FastAPI di hosting Python terpisah.

## 8. Teknologi yang Digunakan

### 8.1 Frontend

1. Next.js latest dengan App Router.
2. TypeScript.
3. Tailwind CSS.
4. shadcn/ui.
5. Recharts.
6. Lucide React.
7. React Hook Form.
8. Zod.
9. Framer Motion, opsional untuk animasi halus.

### 8.2 Backend Ringan

1. Next.js Route Handler.
2. API endpoint `/api/predict`.
3. Static JSON artifact.
4. ONNX Runtime Node untuk versi lanjutan.

### 8.3 Machine Learning Artifact

1. `poverty_model_bundle.pkl`.
2. `model_metadata.json`.
3. `recommendation_rules.json`.
4. `sample_input_output.json`.
5. `poverty_regression.onnx`, opsional.
6. `poverty_classifier.onnx`, opsional.

### 8.4 Deployment

1. Vercel untuk website Next.js.
2. GitHub untuk source code.
3. Streamlit Community Cloud sebagai dashboard tambahan jika tetap ingin memisahkan dashboard analitik.
4. Render atau Railway jika memilih backend Python terpisah.

## 9. Struktur Folder Next.js

Struktur folder yang direkomendasikan:

```text
kemiskinan-jabar-nextjs/
│
├── README.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── tailwind.config.ts
├── components.json
├── .env.example
├── .gitignore
│
├── docs/
│   ├── PRD.md
│   └── DESIGN.md
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   │
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   │
│   ├── scenario/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   │
│   ├── report/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   │
│   ├── model-info/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   │
│   └── api/
│       ├── predict/
│       │   └── route.ts
│       ├── scenario/
│       │   └── route.ts
│       └── model-info/
│           └── route.ts
│
├── components/
│   ├── layout/
│   │   ├── SiteHeader.tsx
│   │   ├── SiteFooter.tsx
│   │   ├── MobileNav.tsx
│   │   └── PageShell.tsx
│   │
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── FeatureSection.tsx
│   │   ├── WorkflowSection.tsx
│   │   ├── ModelSummarySection.tsx
│   │   └── CtaSection.tsx
│   │
│   ├── prediction/
│   │   ├── PredictionForm.tsx
│   │   ├── PredictionResult.tsx
│   │   ├── RecommendationPanel.tsx
│   │   ├── PolicyTimeline.tsx
│   │   ├── IndicatorDiagnosis.tsx
│   │   └── PredictionSummaryCard.tsx
│   │
│   ├── scenario/
│   │   ├── ScenarioForm.tsx
│   │   ├── ScenarioComparison.tsx
│   │   ├── ScenarioDeltaCard.tsx
│   │   └── ScenarioNarrative.tsx
│   │
│   ├── charts/
│   │   ├── PovertyTrendChart.tsx
│   │   ├── PriorityDistributionChart.tsx
│   │   ├── FeatureImportanceChart.tsx
│   │   └── MetricCards.tsx
│   │
│   ├── report/
│   │   ├── ReportPreview.tsx
│   │   ├── ReportSection.tsx
│   │   └── ReportActions.tsx
│   │
│   └── ui/
│       └── shadcn-ui-components
│
├── lib/
│   ├── constants.ts
│   ├── types.ts
│   ├── validators.ts
│   ├── formatters.ts
│   ├── risk.ts
│   ├── recommendation.ts
│   ├── prediction.ts
│   ├── scenario.ts
│   ├── metadata.ts
│   └── api-client.ts
│
├── data/
│   ├── model_metadata.json
│   ├── recommendation_rules.json
│   ├── sample_input_output.json
│   ├── feature_importance.json
│   └── trend_data.json
│
├── ml_artifacts/
│   ├── poverty_model_bundle.pkl
│   ├── poverty_regression.onnx
│   └── poverty_classifier.onnx
│
├── public/
│   ├── images/
│   ├── favicon.ico
│   └── og-image.png
│
└── scripts/
    ├── prepare-data.ts
    ├── validate-artifacts.ts
    └── export-report-template.ts
```

## 10. Halaman Website

### 10.1 Landing Page `/`

Landing page menjelaskan tujuan sistem, model yang digunakan, dan manfaat dashboard.

Konten utama:

1. Hero title.
2. Ringkasan produk.
3. Kartu fitur utama.
4. Alur kerja sistem.
5. Ringkasan performa model.
6. Tombol menuju dashboard.
7. Footer.

Komponen:

1. `HeroSection`.
2. `FeatureSection`.
3. `WorkflowSection`.
4. `ModelSummarySection`.
5. `CtaSection`.

### 10.2 Dashboard `/dashboard`

Dashboard adalah halaman utama prediksi.

Input:

1. Tahun prediksi.
2. Gini Ratio.
3. Tingkat Pengangguran Terbuka.
4. Rata-rata Inflasi Tahunan.
5. Indeks Pembangunan Manusia.

Output:

1. Estimasi angka kemiskinan.
2. Level prioritas intervensi.
3. Rekomendasi utama.
4. Alasan sistem.
5. Aksi kebijakan.
6. Timeline implementasi.
7. Diagnosis indikator.
8. Grafik tren.

### 10.3 Scenario Page `/scenario`

Halaman ini membandingkan kondisi awal dan kondisi skenario.

Fitur:

1. Form kondisi awal.
2. Form skenario kebijakan.
3. Perbandingan hasil prediksi.
4. Delta perubahan prediksi kemiskinan.
5. Narasi rekomendasi berbasis perubahan.
6. Tabel indikator yang berubah.

### 10.4 Report Page `/report`

Halaman ini menampilkan ringkasan hasil analisis dalam format naratif.

Isi:

1. Executive summary.
2. Input indikator.
3. Hasil prediksi.
4. Rekomendasi kebijakan.
5. Timeline aksi.
6. Catatan risiko model.
7. Tombol salin laporan.
8. Tombol download Markdown, opsional PDF.

### 10.5 Model Info Page `/model-info`

Halaman ini menjelaskan model ML yang digunakan.

Isi:

1. Jenis model.
2. Fitur input.
3. Target regresi.
4. Target klasifikasi.
5. Metrik evaluasi.
6. Threshold prioritas.
7. Catatan batasan model.
8. Tanggal pembuatan model.

## 11. API Requirement

### 11.1 Endpoint Prediksi

Endpoint:

```text
POST /api/predict
```

Request body:

```json
{
  "tahun": 2029,
  "gini_ratio": 400,
  "tingkat_penganggur_terbuka": 5,
  "rata_rata_inflasi_tahunan": 0.15,
  "indeks_pembangunan_manusia": 73.5
}
```

Response body:

```json
{
  "prediksi_kemiskinan": 7.7,
  "priority_level": "Medium Priority",
  "status": "Risiko sedang",
  "rekomendasi_utama": "Lakukan intervensi pencegahan agar risiko kemiskinan tidak meningkat.",
  "alasan": [
    "Prediksi kemiskinan berada pada kategori menengah berdasarkan distribusi historis data."
  ],
  "aksi_kebijakan": [
    "Pelatihan kerja untuk kelompok rentan",
    "Penguatan UMKM dan akses modal mikro"
  ],
  "timeline": {
    "0-3 bulan": ["Identifikasi wilayah dan kelompok rentan"],
    "3-12 bulan": ["Program pelatihan kerja dan bantuan UMKM"],
    "1-3 tahun": ["Penguatan pendidikan, kesehatan, dan produktivitas masyarakat"]
  },
  "metadata": {
    "model": "RandomForestRegressor + RandomForestClassifier",
    "r2_score": 0.9836,
    "classification_accuracy": 0.9933
  }
}
```

### 11.2 Endpoint Scenario

Endpoint:

```text
POST /api/scenario
```

Request body:

```json
{
  "baseline": {
    "tahun": 2029,
    "gini_ratio": 400,
    "tingkat_penganggur_terbuka": 5,
    "rata_rata_inflasi_tahunan": 0.15,
    "indeks_pembangunan_manusia": 73.5
  },
  "scenario": {
    "tahun": 2029,
    "gini_ratio": 370,
    "tingkat_penganggur_terbuka": 4.2,
    "rata_rata_inflasi_tahunan": 0.1,
    "indeks_pembangunan_manusia": 75
  }
}
```

Response body:

```json
{
  "baseline_result": {},
  "scenario_result": {},
  "delta": {
    "kemiskinan_change": -0.35,
    "priority_change": "Medium Priority to Low Priority"
  },
  "scenario_narrative": "Skenario kebijakan menunjukkan penurunan risiko kemiskinan jika IPM meningkat dan TPT menurun."
}
```

### 11.3 Endpoint Model Info

Endpoint:

```text
GET /api/model-info
```

Response:

```json
{
  "project_title": "Prediksi Kondisi Sosial Provinsi Jawa Barat",
  "model_type": "Supervised Learning",
  "best_models": {
    "regression": "RandomForestRegressor",
    "classification": "RandomForestClassifier"
  },
  "metrics": {
    "r2_score": 0.9836,
    "mae": 0.0041,
    "classification_accuracy": 0.9933
  }
}
```

## 12. Validasi Input

| Field | Type | Min | Max | Required |
|---|---:|---:|---:|---|
| tahun | number | 2020 | Tidak dibatasi | Ya |
| gini_ratio | number | 0 | 1000 | Ya |
| tingkat_penganggur_terbuka | number | 0 | 30 | Ya |
| rata_rata_inflasi_tahunan | number | -5 | 20 | Ya |
| indeks_pembangunan_manusia | number | 0 | 100 | Ya |

Error harus jelas dan formal.

Contoh:

```text
Nilai IPM harus berada pada rentang 0 sampai 100.
```

```text
Tahun prediksi wajib diisi.
```

```text
Gini Ratio harus berada pada rentang 0 sampai 1000.
```

## 13. Functional Requirements

### FR-001 Landing Page

Sistem harus menyediakan landing page yang menjelaskan tujuan, manfaat, dan alur kerja platform.

Acceptance Criteria:

1. Pengguna dapat melihat ringkasan platform.
2. Pengguna dapat menekan tombol menuju dashboard.
3. Halaman tampil baik di desktop dan mobile.

### FR-002 Prediction Form

Sistem harus menyediakan form prediksi dengan lima indikator input.

Acceptance Criteria:

1. Semua field input tersedia.
2. Validasi input aktif.
3. Tombol submit menampilkan loading state.
4. Hasil prediksi muncul setelah submit.

### FR-003 Prediction Result

Sistem harus menampilkan hasil prediksi kemiskinan dan level prioritas.

Acceptance Criteria:

1. Angka prediksi tampil dalam persentase.
2. Level prioritas tampil jelas.
3. Status risiko ditampilkan dengan visual hierarchy yang kuat.

### FR-004 Recommendation Panel

Sistem harus menampilkan rekomendasi kebijakan berdasarkan priority level.

Acceptance Criteria:

1. Rekomendasi utama tampil langsung setelah hasil prediksi.
2. Alasan sistem tampil dalam bentuk daftar.
3. Aksi kebijakan tampil dalam card atau list.
4. Timeline implementasi tampil dalam tiga horizon waktu.

### FR-005 Scenario Comparison

Sistem harus dapat membandingkan baseline dan skenario.

Acceptance Criteria:

1. Pengguna dapat memasukkan dua set indikator.
2. Sistem menampilkan prediksi baseline dan scenario.
3. Sistem menampilkan perubahan prediksi.
4. Sistem membuat narasi dampak kebijakan.

### FR-006 Model Info

Sistem harus menampilkan metadata model.

Acceptance Criteria:

1. Metrik model tampil jelas.
2. Fitur input ditampilkan.
3. Threshold priority ditampilkan.
4. Catatan batasan model tersedia.

### FR-007 Report Page

Sistem harus menampilkan narasi laporan otomatis.

Acceptance Criteria:

1. Ringkasan prediksi tersedia.
2. Rekomendasi tersedia.
3. Timeline tersedia.
4. Hasil bisa disalin atau diunduh sebagai Markdown.

### FR-008 Responsive Layout

Sistem harus responsif pada ukuran layar mobile, tablet, laptop, dan desktop.

Acceptance Criteria:

1. Layout mobile tidak overflow horizontal.
2. Navigation mobile mudah digunakan.
3. Card dan chart menyesuaikan lebar layar.
4. Form tetap mudah dipakai di layar kecil.

## 14. Non-Functional Requirements

### 14.1 Performance

1. Initial load harus ringan.
2. Komponen berat seperti chart dimuat seperlunya.
3. API response prediksi target di bawah 1 detik untuk mode static atau ONNX ringan.
4. Tidak ada gambar besar tanpa optimasi.

### 14.2 Accessibility

1. Semua input memiliki label.
2. Kontras teks memenuhi standar readability.
3. Tombol memiliki focus state.
4. Navigasi dapat digunakan dengan keyboard.
5. Tabel dapat dibaca dengan struktur heading yang jelas.

### 14.3 Maintainability

1. Logic prediksi dipisah dari UI.
2. Semua type disimpan di `lib/types.ts`.
3. Validasi input disimpan di `lib/validators.ts`.
4. Rekomendasi kebijakan disimpan di `lib/recommendation.ts`.
5. Komponen reusable disimpan berdasarkan domain.

### 14.4 Security

1. Input divalidasi dengan Zod.
2. Tidak menyimpan data pribadi pengguna.
3. Tidak menaruh secret di client.
4. Environment variable disimpan di `.env.local`.
5. API route tidak menerima payload besar.

### 14.5 Reliability

1. Jika API gagal, tampilkan fallback error.
2. Jika metadata tidak ditemukan, tampilkan pesan yang aman.
3. Jika rekomendasi tidak tersedia, gunakan fallback rekomendasi umum.
4. Loading dan empty state harus tersedia.

## 15. Data Contract

### 15.1 PredictionInput

```ts
export type PredictionInput = {
  tahun: number
  gini_ratio: number
  tingkat_penganggur_terbuka: number
  rata_rata_inflasi_tahunan: number
  indeks_pembangunan_manusia: number
}
```

### 15.2 PredictionResult

```ts
export type PredictionResult = {
  prediksi_kemiskinan: number
  priority_level: "Low Priority" | "Medium Priority" | "High Priority"
  status: string
  rekomendasi_utama: string
  alasan: string[]
  aksi_kebijakan: string[]
  timeline: {
    "0-3 bulan": string[]
    "3-12 bulan": string[]
    "1-3 tahun": string[]
  }
  metadata: {
    model: string
    r2_score: number
    mae: number
    classification_accuracy: number
  }
}
```

### 15.3 ModelMetadata

```ts
export type ModelMetadata = {
  project_title: string
  model_type: string
  tasks: {
    regression: string
    classification: string
  }
  best_models: {
    regression: string
    classification: string
  }
  metrics: {
    r2_score: number
    mae: number
    classification_accuracy: number
  }
  feature_columns: string[]
  priority_thresholds: {
    low_threshold: number
    high_threshold: number
  }
  created_at: string
}
```

## 16. Logic Prediksi MVP

Untuk MVP awal sebelum ONNX, prediksi dapat menggunakan static sample, formula simulasi, atau proxy ke backend.

Namun struktur tetap harus disiapkan agar nanti tinggal mengganti isi `lib/prediction.ts`.

Contoh mode simulasi sementara:

```ts
export function simulatePrediction(input: PredictionInput): number {
  const base = 7.7
  const ipmImpact = (73.5 - input.indeks_pembangunan_manusia) * 0.08
  const tptImpact = (input.tingkat_penganggur_terbuka - 5) * 0.06
  const giniImpact = (input.gini_ratio - 400) * 0.001
  const inflationImpact = (input.rata_rata_inflasi_tahunan - 0.15) * 0.04

  return Number((base + ipmImpact + tptImpact + giniImpact + inflationImpact).toFixed(2))
}
```

Catatan: formula simulasi hanya digunakan sebagai placeholder. Model final harus memakai hasil inference dari backend Python atau ONNX.

## 17. Recommendation Logic

Rekomendasi ditentukan berdasarkan `priority_level` dan diagnosis indikator.

### 17.1 Priority Rule

```ts
if (prediction <= low_threshold) {
  return "Low Priority"
}

if (prediction <= high_threshold) {
  return "Medium Priority"
}

return "High Priority"
```

### 17.2 Indicator Diagnosis

Diagnosis indikator:

1. IPM rendah: fokus pendidikan, kesehatan, dan kualitas SDM.
2. TPT tinggi: fokus pelatihan kerja, job matching, dan padat karya.
3. Gini tinggi: fokus pemerataan bantuan dan pemberdayaan ekonomi.
4. Inflasi tinggi: fokus stabilisasi harga dan bantuan pangan.
5. Tahun prediksi jauh ke depan: tampilkan catatan kehati-hatian.

## 18. SEO Requirement

1. Set metadata di `app/layout.tsx`.
2. Buat dynamic metadata untuk halaman utama.
3. Buat `app/sitemap.ts`.
4. Buat `app/robots.ts`.
5. Buat OG image di `public/og-image.png`.
6. Title harus mengandung kata kunci:
   - Prediksi Kemiskinan Jawa Barat
   - Machine Learning
   - Dashboard Sosial
7. Description harus menjelaskan manfaat produk.

Contoh metadata:

```ts
export const metadata = {
  title: "Prediksi Kondisi Sosial Jawa Barat",
  description:
    "Dashboard prediksi kemiskinan dan rekomendasi kebijakan sosial berbasis Machine Learning untuk Provinsi Jawa Barat.",
}
```

## 19. Responsive Requirement

Breakpoint desain mengikuti pendekatan Tailwind:

1. Mobile: 320px sampai 639px.
2. Tablet: 640px sampai 1023px.
3. Laptop: 1024px sampai 1279px.
4. Desktop: 1280px ke atas.
5. Wide desktop: 1536px ke atas.

Perilaku layout:

1. Mobile: single column.
2. Tablet: form dan result tetap single column, beberapa card bisa dua kolom.
3. Laptop: form dan result dua kolom.
4. Desktop: grid lebih luas dengan sidebar ringkas jika dibutuhkan.

## 20. Design Requirement

Arah visual:

1. Clean.
2. Formal.
3. Modern government-tech.
4. Data-driven.
5. Tidak menggunakan emoji atau emoticon.
6. Warna tenang dan kredibel.
7. Banyak whitespace.
8. Hierarki teks jelas.
9. Card-based layout.
10. Chart mudah dibaca.

## 21. Testing Requirement

### 21.1 Unit Test

1. Test validation schema.
2. Test risk calculation.
3. Test recommendation mapping.
4. Test scenario delta.

### 21.2 Integration Test

1. Test `/api/predict`.
2. Test `/api/scenario`.
3. Test `/api/model-info`.

### 21.3 UI Test

1. Form submit berhasil.
2. Error state muncul.
3. Loading state muncul.
4. Mobile navigation berfungsi.
5. Chart tampil setelah data tersedia.

### 21.4 Manual Test

1. Buka landing page.
2. Buka dashboard.
3. Input sample data.
4. Submit prediksi.
5. Cek rekomendasi.
6. Buka scenario page.
7. Bandingkan baseline dan scenario.
8. Buka report page.
9. Cek model info page.
10. Uji ukuran layar mobile.

## 22. Deployment Requirement

### 22.1 Vercel

1. Project tersambung ke GitHub.
2. Build command:
   ```text
   pnpm build
   ```
3. Install command:
   ```text
   pnpm install
   ```
4. Output framework:
   ```text
   Next.js
   ```
5. Environment variable:
   ```text
   NEXT_PUBLIC_APP_URL
   NEXT_PUBLIC_APP_NAME
   ```

### 22.2 Build Validation

Sebelum deploy:

```bash
pnpm lint
pnpm type-check
pnpm build
```

### 22.3 Environment

`.env.example`:

```env
NEXT_PUBLIC_APP_NAME="Prediksi Kondisi Sosial Jawa Barat"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_MODEL_MODE="static"
```

Jika memakai backend Python:

```env
ML_API_URL="https://nama-backend.example.com"
```

Jika memakai ONNX:

```env
NEXT_PUBLIC_MODEL_MODE="onnx"
```

## 23. Milestone Pengembangan

### Milestone 1: Setup Project

1. Init Next.js.
2. Install Tailwind, shadcn/ui, Recharts.
3. Setup struktur folder.
4. Import artifact JSON.

### Milestone 2: Landing Page

1. Buat layout dasar.
2. Buat hero section.
3. Buat feature section.
4. Buat model summary.

### Milestone 3: Dashboard Prediction

1. Buat prediction form.
2. Buat API route.
3. Buat result card.
4. Buat recommendation panel.

### Milestone 4: Scenario Comparison

1. Buat form baseline.
2. Buat form scenario.
3. Hitung delta.
4. Tampilkan narasi dampak.

### Milestone 5: Report dan Model Info

1. Buat report page.
2. Buat model info page.
3. Buat chart.
4. Buat export Markdown.

### Milestone 6: Polish dan Deploy

1. Responsive testing.
2. Accessibility check.
3. SEO metadata.
4. Build dan deploy ke Vercel.

## 24. Acceptance Criteria Akhir

Produk dianggap selesai jika:

1. Website bisa dijalankan dengan `pnpm dev`.
2. Website bisa di-build dengan `pnpm build`.
3. Landing page tampil rapi.
4. Dashboard prediksi berjalan.
5. Rekomendasi muncul setelah prediksi.
6. Scenario comparison berjalan.
7. Model info menampilkan metadata asli.
8. Layout responsif di mobile dan desktop.
9. Tidak ada horizontal overflow.
10. Tidak ada emoji atau emoticon pada UI formal.
11. Struktur folder rapi.
12. Siap deploy ke Vercel.

## 25. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Model `.pkl` tidak bisa langsung dijalankan di Next.js | Integrasi Vercel sulit | Gunakan ONNX atau backend Python |
| Akurasi terlalu tinggi terlihat overfit | Dosen mempertanyakan validitas | Jelaskan evaluasi dan batasan model |
| Chart tidak responsif | UI buruk di mobile | Gunakan ResponsiveContainer dari Recharts |
| Input tidak valid | Hasil prediksi tidak masuk akal | Gunakan Zod validation |
| Rekomendasi terlalu umum | Nilai analisis kurang kuat | Tambahkan diagnosis indikator |
| Vercel function terlalu besar | Deploy gagal | Simpan model sebagai ONNX atau pakai backend terpisah |
| UI terlalu ramai | Sulit dibaca | Gunakan card, spacing, dan hierarchy yang konsisten |

## 26. Catatan untuk Presentasi

Narasi yang dapat digunakan:

```text
Website ini merupakan pengembangan dari model Machine Learning yang sebelumnya dibuat di notebook. Model terbaik diekspor menjadi artifact sehingga dapat digunakan kembali oleh aplikasi. Next.js digunakan sebagai website utama karena mendukung tampilan modern, routing, API route, dan deployment yang mudah ke Vercel. Sistem tidak hanya menampilkan hasil prediksi kemiskinan, tetapi juga memberikan rekomendasi kebijakan berbasis level prioritas intervensi.
```

## 27. Referensi Resmi

1. Next.js App Router Documentation: https://nextjs.org/docs/app
2. Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers
3. Vercel Next.js Deployment: https://vercel.com/docs/frameworks/full-stack/nextjs
4. Tailwind CSS Responsive Design: https://tailwindcss.com/docs/responsive-design
5. shadcn/ui Documentation: https://ui.shadcn.com/docs
6. Recharts Documentation: https://recharts.org
7. Vercel Functions Limitations: https://vercel.com/docs/functions/limitations
8. ONNX Runtime JavaScript Node: https://onnxruntime.ai/docs/get-started/with-javascript/node.html
