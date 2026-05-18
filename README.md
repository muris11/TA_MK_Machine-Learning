# TA_MK_Machine-Learning

Website prediksi kondisi sosial Provinsi Jawa Barat berbasis Machine Learning. Aplikasi ini mengubah artifact model dari proyek ML menjadi dashboard web profesional untuk memprediksi estimasi angka kemiskinan, menentukan level prioritas intervensi sosial, dan menghasilkan rekomendasi kebijakan.

Project ini dibangun dengan Next.js App Router, TypeScript, Tailwind CSS, Recharts, Zod, React Hook Form, dan artifact JSON dari folder `ml_artifacts`.

## Ringkasan

Platform ini menerima lima indikator sosial ekonomi:

- Tahun prediksi
- Gini Ratio
- Tingkat Pengangguran Terbuka
- Rata-rata Inflasi Tahunan
- Indeks Pembangunan Manusia

Berdasarkan input tersebut, sistem menghasilkan:

- Estimasi angka kemiskinan
- Level prioritas intervensi: `Low Priority`, `Medium Priority`, atau `High Priority`
- Status risiko
- Rekomendasi kebijakan utama
- Alasan sistem
- Aksi kebijakan
- Timeline implementasi
- Diagnosis indikator
- Scenario comparison
- Laporan naratif siap salin atau download Markdown
- Informasi metadata model

## Tujuan Project

Project ini dibuat sebagai versi web dari model Machine Learning yang sebelumnya berada di notebook, Streamlit, atau Gradio. Next.js digunakan sebagai aplikasi utama agar hasil model lebih mudah dipresentasikan, lebih rapi, responsif, dan siap dikembangkan untuk deployment.

Website ini cocok digunakan untuk:

- Presentasi tugas akhir atau mata kuliah Machine Learning
- Demonstrasi sistem pendukung keputusan
- Portofolio data science dan web development
- Simulasi kebijakan sosial berbasis indikator ekonomi

## Fitur Utama

### Landing Page

Halaman awal berisi ringkasan platform, manfaat sistem, alur kerja, fitur utama, performa model, dan tombol menuju dashboard.

Route:

```text
/
```

### Dashboard Prediksi

Halaman utama untuk input indikator sosial ekonomi dan menampilkan hasil prediksi.

Fitur:

- Form input dengan validasi Zod
- Loading state saat submit
- Error state jika input tidak valid
- Kartu hasil prediksi
- Priority badge
- Rekomendasi kebijakan
- Diagnosis indikator
- Timeline implementasi
- Grafik tren kemiskinan

Route:

```text
/dashboard
```

### Scenario Comparison

Halaman untuk membandingkan kondisi awal dan skenario kebijakan.

Fitur:

- Form baseline
- Form skenario kebijakan
- Prediksi baseline
- Prediksi skenario
- Delta perubahan kemiskinan
- Perubahan priority level
- Narasi dampak kebijakan
- Tabel perubahan indikator

Route:

```text
/scenario
```

### Report Page

Halaman laporan naratif berdasarkan sample prediksi. Laporan dapat disalin atau diunduh sebagai Markdown.

Fitur:

- Executive summary
- Tabel input indikator
- Hasil prediksi
- Rekomendasi kebijakan
- Diagnosis indikator
- Timeline aksi
- Catatan risiko model
- Copy report
- Download Markdown

Route:

```text
/report
```

### Model Info Page

Halaman transparansi model Machine Learning.

Fitur:

- Model type
- Model regresi terbaik
- Model klasifikasi terbaik
- R2 Score
- MAE
- Classification accuracy
- Feature columns
- Feature importance
- Priority threshold
- Catatan batasan model

Route:

```text
/model-info
```

## API Routes

### POST `/api/predict`

Endpoint untuk menjalankan prediksi.

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

Response:

```json
{
  "prediksi_kemiskinan": 7.4,
  "priority_level": "Low Priority",
  "status": "Risiko rendah",
  "rekomendasi_utama": "Pertahankan program sosial yang sudah berjalan dan lakukan monitoring berkala.",
  "alasan": [],
  "aksi_kebijakan": [],
  "timeline": {},
  "metadata": {
    "model": "RandomForestRegressor + RandomForestClassifier",
    "r2_score": 0.9836554026438189,
    "mae": 0.0041419141914586345,
    "classification_accuracy": 0.9933993399339934
  }
}
```

### POST `/api/scenario`

Endpoint untuk membandingkan baseline dan skenario kebijakan.

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

### GET `/api/model-info`

Endpoint untuk mengambil ringkasan metadata model.

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
    "r2_score": 0.9836554026438189,
    "mae": 0.0041419141914586345,
    "classification_accuracy": 0.9933993399339934
  }
}
```

## Teknologi

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React
- React Hook Form
- Zod
- ESLint
- pnpm

## Struktur Folder

```text
app/
  api/
    model-info/
    predict/
    scenario/
  dashboard/
  model-info/
  report/
  scenario/
  globals.css
  layout.tsx
  page.tsx

components/
  charts/
  layout/
  prediction/
  report/
  scenario/
  sections/
  ui/

data/
  feature_importance.json
  model_metadata.json
  recommendation_rules.json
  sample_input_output.json
  trend_data.json

lib/
  constants.ts
  formatters.ts
  metadata.ts
  prediction.ts
  recommendation.ts
  report.ts
  scenario.ts
  types.ts
  utils.ts
  validators.ts

ml_artifacts/
  artifact_test.json
  model_metadata.json
  poverty_model_bundle.pkl
  recommendation_rules.json
  sample_input_output.json

public/
  og-image.svg
```

## Artifact Machine Learning

Folder `ml_artifacts` berisi artifact dari proses Machine Learning:

- `poverty_model_bundle.pkl`
- `model_metadata.json`
- `recommendation_rules.json`
- `sample_input_output.json`
- `artifact_test.json`

Pada versi MVP, file PKL belum dijalankan langsung oleh Next.js. Aplikasi menggunakan mode static demo melalui JSON artifact dan formula simulasi di:

```text
lib/prediction.ts
```

Untuk production satu hosting di Vercel, model dapat dikonversi ke ONNX. Alternatif lain adalah menjalankan file PKL di backend Python terpisah seperti FastAPI.

## Logic Prediksi MVP

Prediksi sementara menggunakan formula simulasi:

```ts
const base = 7.4
const ipmImpact = (73.5 - input.indeks_pembangunan_manusia) * 0.085
const unemploymentImpact = (input.tingkat_penganggur_terbuka - 5) * 0.09
const giniImpact = (input.gini_ratio - 400) * 0.0008
const inflationImpact = (input.rata_rata_inflasi_tahunan - 0.15) * 0.25
const yearImpact = (input.tahun - 2029) * 0.01
```

Priority level dihitung menggunakan threshold dari `model_metadata.json`:

- Low Priority: prediksi <= `low_threshold`
- Medium Priority: prediksi > `low_threshold` dan <= `high_threshold`
- High Priority: prediksi > `high_threshold`

## Validasi Input

Validasi dilakukan dengan Zod pada file:

```text
lib/validators.ts
```

Rentang input:

| Field | Min | Max |
|---|---:|---:|
| Tahun prediksi | 2020 | 2035 |
| Gini Ratio | 0 | 1000 |
| Tingkat Pengangguran Terbuka | 0 | 30 |
| Rata-rata Inflasi Tahunan | -5 | 20 |
| Indeks Pembangunan Manusia | 0 | 100 |

## Instalasi

Pastikan Node.js dan pnpm sudah tersedia.

```bash
pnpm install
```

## Menjalankan Project

Development server:

```bash
pnpm dev
```

Buka aplikasi di browser:

```text
http://localhost:3000
```

Build production:

```bash
pnpm build
```

Menjalankan production build:

```bash
pnpm start
```

## Script

```bash
pnpm dev
pnpm lint
pnpm type-check
pnpm build
pnpm check
```

Keterangan:

- `pnpm dev`: menjalankan Next.js development server
- `pnpm lint`: menjalankan ESLint
- `pnpm type-check`: menjalankan TypeScript check
- `pnpm build`: membuat production build
- `pnpm check`: menjalankan lint, type-check, dan build berurutan

## Environment Variable

Contoh environment tersedia di:

```text
.env.example
```

Isi default:

```env
NEXT_PUBLIC_APP_NAME="Prediksi Kondisi Sosial Jawa Barat"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_MODEL_MODE="static"
ML_API_URL="https://nama-backend.example.com"
```

## Deployment ke Vercel

Konfigurasi deployment:

```text
Framework: Next.js
Install command: pnpm install
Build command: pnpm build
Output: .next
```

Environment yang disarankan:

```env
NEXT_PUBLIC_APP_NAME="Prediksi Kondisi Sosial Jawa Barat"
NEXT_PUBLIC_APP_URL="https://domain-vercel-anda.vercel.app"
NEXT_PUBLIC_MODEL_MODE="static"
```

## Hasil Verifikasi

Project sudah diverifikasi dengan:

```bash
pnpm lint
pnpm type-check
pnpm build
```

Build menghasilkan route berikut:

```text
/
/dashboard
/scenario
/report
/model-info
/api/predict
/api/scenario
/api/model-info
/robots.txt
/sitemap.xml
```

## Batasan

- File `poverty_model_bundle.pkl` belum dijalankan langsung di Next.js.
- Prediksi MVP memakai formula simulasi berbasis artifact.
- Untuk inference model asli di web, gunakan ONNX Runtime atau backend Python.
- Metrik model perlu dijelaskan sebagai hasil evaluasi dataset tertentu, bukan jaminan akurasi absolut untuk semua kondisi.

## Pengembangan Lanjutan

Fitur yang dapat ditambahkan:

- Export laporan ke PDF
- Login admin
- Riwayat prediksi
- Database PostgreSQL
- Upload dataset baru
- Retraining model
- Integrasi ONNX Runtime
- Backend FastAPI untuk menjalankan file PKL
- Visualisasi peta wilayah Jawa Barat
- Monitoring model drift

## Lisensi

Project ini dibuat untuk kebutuhan pembelajaran dan presentasi mata kuliah Machine Learning.
