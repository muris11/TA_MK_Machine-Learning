# DESIGN.md
# Design Specification
# Website Prediksi Kondisi Sosial Jawa Barat

## 1. Ringkasan Desain

Dokumen ini menjelaskan rancangan tampilan website Prediksi Kondisi Sosial Jawa Barat. Desain dibuat untuk mendukung presentasi proyek Machine Learning secara profesional, rapi, responsif, dan mudah dipahami. Arah desain menggabungkan gaya dashboard data, government technology, dan decision support system.

Website harus terlihat kredibel, bersih, tidak ramai, dan tidak menggunakan emoji atau emoticon pada elemen UI formal. Fokus utama desain adalah memudahkan pengguna memahami hasil prediksi, level prioritas intervensi, dan rekomendasi kebijakan.

## 2. Prinsip Desain

### 2.1 Clarity

Setiap halaman harus langsung menjelaskan tujuannya. Pengguna harus dapat memahami:

1. Apa fungsi halaman.
2. Data apa yang harus diinput.
3. Hasil apa yang diberikan sistem.
4. Rekomendasi apa yang harus dilakukan.

### 2.2 Trust

Karena produk berkaitan dengan prediksi sosial dan kebijakan, tampilan harus terasa formal dan terpercaya. Hindari warna terlalu mencolok, dekorasi berlebihan, dan gaya terlalu playful.

### 2.3 Data-first

Angka prediksi, level prioritas, grafik, dan rekomendasi harus menjadi pusat perhatian. Elemen visual harus mendukung pemahaman data, bukan mengganggu.

### 2.4 Responsive by default

Semua halaman harus nyaman digunakan di mobile, tablet, laptop, dan desktop. Layout tidak boleh overflow horizontal.

### 2.5 Modular

Komponen harus reusable dan dapat dikembangkan. Form, card, chart, panel rekomendasi, dan timeline harus dipisah menjadi komponen kecil.

## 3. Identitas Visual

### 3.1 Gaya Visual

Gaya utama:

```text
Clean
Formal
Modern
Data-driven
Government technology
Decision support system
```

Hindari:

```text
Emoji
Emoticon
Warna neon
Gradient berlebihan
Shadow terlalu keras
Ilustrasi kartun
Dekorasi tidak relevan
```

### 3.2 Kesan yang Diharapkan

Website harus memberi kesan:

1. Serius.
2. Profesional.
3. Analitis.
4. Terpercaya.
5. Mudah dipresentasikan.
6. Cocok untuk konteks akademik dan pemerintahan.

## 4. Color System

### 4.1 Warna Utama

| Token | Warna | Penggunaan |
|---|---|---|
| `--background` | `#F8FAFC` | Background utama |
| `--foreground` | `#0F172A` | Teks utama |
| `--primary` | `#1E3A8A` | Tombol utama, heading penting |
| `--primary-hover` | `#1D4ED8` | Hover tombol utama |
| `--secondary` | `#0F766E` | Aksen data positif |
| `--muted` | `#64748B` | Teks sekunder |
| `--border` | `#E2E8F0` | Border card dan input |
| `--card` | `#FFFFFF` | Card background |
| `--danger` | `#B91C1C` | High risk |
| `--warning` | `#B45309` | Medium risk |
| `--success` | `#047857` | Low risk |

### 4.2 Risk Color

| Priority | Background | Text | Border |
|---|---|---|---|
| Low Priority | `#ECFDF5` | `#047857` | `#A7F3D0` |
| Medium Priority | `#FFFBEB` | `#B45309` | `#FCD34D` |
| High Priority | `#FEF2F2` | `#B91C1C` | `#FECACA` |

### 4.3 Chart Color

Gunakan warna yang konsisten dan mudah dibaca:

| Data | Warna |
|---|---|
| Historical poverty trend | `#1E3A8A` |
| Prediction point | `#B91C1C` |
| Scenario baseline | `#64748B` |
| Scenario improved | `#0F766E` |
| Feature importance | `#1D4ED8` |

Catatan: Jangan gunakan terlalu banyak warna dalam satu chart. Maksimal 3 sampai 4 warna utama per chart.

## 5. Typography

### 5.1 Font

Gunakan font modern dan mudah dibaca:

```text
Inter
Geist
system-ui
sans-serif
```

Rekomendasi untuk Next.js:

```ts
import { Geist } from "next/font/google"
```

### 5.2 Type Scale

| Element | Desktop | Mobile | Weight |
|---|---:|---:|---:|
| Hero title | 56px | 36px | 700 |
| Page title | 40px | 30px | 700 |
| Section title | 28px | 24px | 700 |
| Card title | 18px | 16px | 600 |
| Body text | 16px | 15px | 400 |
| Small text | 14px | 13px | 400 |
| Label | 14px | 14px | 500 |
| Metric number | 32px | 28px | 700 |

### 5.3 Line Height

| Text | Line Height |
|---|---:|
| Heading | 1.1 sampai 1.2 |
| Body | 1.6 sampai 1.75 |
| Label | 1.3 |
| Caption | 1.4 |

## 6. Spacing System

Gunakan spacing konsisten berbasis Tailwind.

| Token | Value | Penggunaan |
|---|---:|---|
| `space-1` | 4px | Spasi kecil |
| `space-2` | 8px | Gap item kecil |
| `space-3` | 12px | Gap form |
| `space-4` | 16px | Padding card kecil |
| `space-6` | 24px | Padding card normal |
| `space-8` | 32px | Gap section kecil |
| `space-12` | 48px | Gap section |
| `space-16` | 64px | Section padding |
| `space-24` | 96px | Hero padding desktop |

## 7. Layout System

### 7.1 Container

Gunakan container global:

```text
max-width: 1280px
padding mobile: 16px
padding tablet: 24px
padding desktop: 32px
```

Tailwind:

```tsx
<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
```

### 7.2 Grid

Desktop dashboard:

```text
Left column: form
Right column: result and recommendation
```

Tailwind:

```tsx
<div className="grid gap-6 lg:grid-cols-[420px_1fr]">
```

Mobile dashboard:

```text
Single column
Form di atas
Result di bawah
Recommendation langsung di bawah result
```

### 7.3 Section Layout

Default section:

```tsx
<section className="py-16 sm:py-20 lg:py-24">
```

Default card:

```tsx
<Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
```

## 8. Responsive Breakpoints

Gunakan breakpoint Tailwind standar:

| Breakpoint | Width | Penggunaan |
|---|---:|---|
| default | kurang dari 640px | Mobile |
| sm | 640px ke atas | Mobile besar |
| md | 768px ke atas | Tablet |
| lg | 1024px ke atas | Laptop |
| xl | 1280px ke atas | Desktop |
| 2xl | 1536px ke atas | Wide desktop |

Responsive behavior:

1. Mobile: single column.
2. Tablet: two column untuk metric cards.
3. Laptop: form dan result dua kolom.
4. Desktop: dashboard lebih lebar, chart lebih luas.
5. Wide desktop: konten tetap max-width agar tidak terlalu melebar.

## 9. Page Design

## 9.1 Landing Page

### Tujuan

Mengenalkan produk sebagai platform prediksi sosial berbasis Machine Learning.

### Struktur

```text
Header
Hero Section
Metric Summary
Feature Section
Workflow Section
Model Summary Section
CTA Section
Footer
```

### Hero Section

Layout desktop:

```text
Kiri:
- Eyebrow text
- Title besar
- Deskripsi
- CTA utama
- CTA sekunder

Kanan:
- Preview dashboard card
- Metric cards mini
```

Layout mobile:

```text
Semua elemen single column
Preview dashboard di bawah teks
CTA stacked
```

Konten hero:

```text
Prediksi Kondisi Sosial Jawa Barat Berbasis Machine Learning
```

Deskripsi:

```text
Platform ini membantu memprediksi estimasi tingkat kemiskinan, menentukan prioritas intervensi sosial, dan menghasilkan rekomendasi kebijakan berdasarkan indikator ekonomi dan sosial.
```

CTA:

```text
Mulai Prediksi
Lihat Informasi Model
```

### Feature Section

Tampilkan 4 card:

1. Prediksi Kemiskinan.
2. Prioritas Intervensi.
3. Rekomendasi Kebijakan.
4. Scenario Comparison.

Setiap card:

```text
Title
Description
Small technical note
```

Tidak menggunakan icon emoji. Jika butuh icon, gunakan Lucide icon yang formal seperti `LineChart`, `ShieldCheck`, `FileText`, `Activity`.

## 9.2 Dashboard Page

### Tujuan

Menjadi halaman utama untuk input indikator dan melihat hasil prediksi.

### Struktur Desktop

```text
Header Page
Description
Main Grid
  Left: Prediction Form
  Right: Result Summary
         Recommendation Panel
         Chart
         Timeline
```

### Struktur Mobile

```text
Header Page
Prediction Form
Result Summary
Recommendation Panel
Chart
Timeline
```

### Prediction Form

Field:

1. Tahun Prediksi.
2. Gini Ratio.
3. Tingkat Pengangguran Terbuka.
4. Rata-rata Inflasi Tahunan.
5. Indeks Pembangunan Manusia.

Setiap field wajib memiliki:

1. Label.
2. Helper text.
3. Error text.
4. Validasi min dan max.
5. Input number yang mudah digunakan.

Contoh field:

```text
Label: Indeks Pembangunan Manusia
Helper: Masukkan nilai IPM pada skala 0 sampai 100.
Error: Nilai IPM harus berada pada rentang 0 sampai 100.
```

### Result Summary

Card utama harus menampilkan:

1. Tahun target.
2. Estimasi angka kemiskinan.
3. Level prioritas intervensi.
4. Status risiko.
5. Short explanation.

Visual hierarchy:

```text
Estimasi angka kemiskinan sebagai angka terbesar
Priority badge di dekat angka
Status risiko sebagai subheading
```

### Recommendation Panel

Panel rekomendasi harus langsung terlihat setelah hasil analisis.

Konten:

1. Rekomendasi utama.
2. Alasan sistem.
3. Aksi kebijakan.
4. Indikator yang perlu dipantau.
5. Catatan kehati-hatian.

Struktur:

```text
Recommendation Card
  Header: Rekomendasi Kebijakan
  Subheader: Berdasarkan hasil prediksi dan diagnosis indikator
  Main recommendation
  Reason list
  Policy action list
```

### Policy Timeline

Timeline dibagi menjadi:

1. 0 sampai 3 bulan.
2. 3 sampai 12 bulan.
3. 1 sampai 3 tahun.

Tampilan desktop:

```text
3 card sejajar
```

Tampilan mobile:

```text
3 card stacked
```

## 9.3 Scenario Page

### Tujuan

Membandingkan dampak skenario kebijakan terhadap prediksi kemiskinan.

### Struktur

```text
Page Header
Two Column Input
  Baseline Condition
  Scenario Condition
Comparison Result
Delta Cards
Narrative Recommendation
```

### Baseline and Scenario Form

Gunakan dua card sejajar di desktop.

```text
Card 1: Kondisi Awal
Card 2: Skenario Kebijakan
```

Mobile:

```text
Card 1 di atas
Card 2 di bawah
```

### Comparison Result

Tampilkan:

1. Prediksi baseline.
2. Prediksi scenario.
3. Selisih angka kemiskinan.
4. Perubahan priority level.
5. Narasi apakah skenario membaik, stabil, atau memburuk.

### Delta Card

Warna:

1. Penurunan kemiskinan: hijau.
2. Tidak berubah signifikan: abu atau biru.
3. Kenaikan kemiskinan: merah.

## 9.4 Report Page

### Tujuan

Menampilkan hasil analisis dalam format narasi siap salin ke laporan.

### Struktur

```text
Report Header
Executive Summary
Input Indicator Table
Prediction Result
Recommendation Section
Policy Timeline
Model Limitation
Copy and Download Actions
```

### Report Preview

Gunakan card besar seperti dokumen.

```tsx
<Card className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm">
```

### Actions

Button:

1. Salin Laporan.
2. Download Markdown.
3. Download PDF, opsional.

## 9.5 Model Info Page

### Tujuan

Menjelaskan model Machine Learning secara transparan.

### Struktur

```text
Page Header
Model Metrics
Feature Columns
Priority Threshold
Training Artifact
Model Limitation
```

### Metric Cards

Tampilkan:

1. R2 Score.
2. MAE.
3. Classification Accuracy.
4. Model Type.

Metric card harus ringkas dan mudah dibaca.

## 10. Component Specification

## 10.1 SiteHeader

### Purpose

Navigasi utama website.

### Desktop Navigation

Links:

1. Beranda.
2. Dashboard.
3. Scenario.
4. Report.
5. Model Info.

### Mobile Navigation

Gunakan sheet atau drawer dari shadcn/ui.

Behavior:

1. Tombol menu muncul di mobile.
2. Drawer dari kanan atau atas.
3. Link mudah ditekan.
4. Drawer tertutup setelah link diklik.

## 10.2 PredictionForm

### Props

```ts
type PredictionFormProps = {
  defaultValues?: PredictionInput
  onSubmit: (values: PredictionInput) => void
  isLoading?: boolean
}
```

### Behavior

1. Validasi dengan Zod.
2. Submit disabled saat loading.
3. Error tampil di bawah field.
4. Default value tersedia untuk demo.

## 10.3 PredictionResult

### Props

```ts
type PredictionResultProps = {
  result: PredictionResult
}
```

### Content

1. Prediksi angka kemiskinan.
2. Priority badge.
3. Status.
4. Model confidence note.
5. Ringkasan rekomendasi.

## 10.4 RecommendationPanel

### Props

```ts
type RecommendationPanelProps = {
  priorityLevel: PriorityLevel
  recommendation: RecommendationRule
  diagnosis: IndicatorDiagnosis[]
}
```

### Content

1. Rekomendasi utama.
2. Alasan.
3. Aksi kebijakan.
4. Diagnosis indikator.

## 10.5 PolicyTimeline

### Props

```ts
type PolicyTimelineProps = {
  timeline: {
    "0-3 bulan": string[]
    "3-12 bulan": string[]
    "1-3 tahun": string[]
  }
}
```

### Layout

Desktop:

```text
3 columns
```

Mobile:

```text
1 column
```

## 10.6 PovertyTrendChart

### Library

Gunakan Recharts.

### Chart Type

Line chart dengan prediction marker.

### Requirements

1. Responsive container.
2. Axis label jelas.
3. Tooltip.
4. Legend.
5. Tidak terlalu banyak warna.

## 10.7 ScenarioComparison

### Content

1. Baseline result.
2. Scenario result.
3. Delta value.
4. Narrative.
5. Recommendation.

## 10.8 ReportPreview

### Content

1. Markdown-like preview.
2. Section heading.
3. Table input.
4. Result.
5. Recommendation.

## 11. State Design

## 11.1 Loading State

Gunakan skeleton card:

```text
Form tetap terlihat
Result area menampilkan skeleton
Button disabled
```

## 11.2 Empty State

Jika belum ada prediksi:

```text
Masukkan indikator sosial ekonomi untuk melihat estimasi kemiskinan dan rekomendasi kebijakan.
```

## 11.3 Error State

Jika prediksi gagal:

```text
Prediksi belum dapat diproses. Periksa input dan coba kembali.
```

Jika metadata gagal dimuat:

```text
Informasi model belum tersedia.
```

## 11.4 Success State

Setelah prediksi berhasil:

1. Result card muncul.
2. Recommendation panel muncul.
3. Timeline muncul.
4. Report preview dapat dibuat.

## 12. Form Design

### 12.1 Input Number

Gunakan komponen input shadcn/ui.

Style:

```tsx
<Input
  type="number"
  className="h-11 rounded-xl border-slate-200 bg-white"
/>
```

### 12.2 Label

```tsx
<Label className="text-sm font-medium text-slate-700">
```

### 12.3 Helper Text

```tsx
<p className="text-xs text-slate-500">
```

### 12.4 Error Text

```tsx
<p className="text-xs font-medium text-red-700">
```

## 13. Button Design

### 13.1 Primary Button

Usage:

1. Submit prediksi.
2. Mulai prediksi.
3. Lihat dashboard.

Style:

```tsx
<Button className="h-11 rounded-xl bg-blue-900 px-5 text-white hover:bg-blue-800">
```

### 13.2 Secondary Button

Usage:

1. Lihat model info.
2. Reset form.
3. Salin laporan.

Style:

```tsx
<Button variant="outline" className="h-11 rounded-xl border-slate-300">
```

### 13.3 Disabled State

```text
Opacity 50 persen
Cursor not-allowed
No hover effect
```

## 14. Card Design

### 14.1 Default Card

```tsx
<Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
```

### 14.2 Important Result Card

```tsx
<Card className="rounded-2xl border border-blue-100 bg-white shadow-md">
```

### 14.3 Risk Card

Low:

```tsx
<Card className="border-emerald-200 bg-emerald-50 text-emerald-900">
```

Medium:

```tsx
<Card className="border-amber-200 bg-amber-50 text-amber-900">
```

High:

```tsx
<Card className="border-red-200 bg-red-50 text-red-900">
```

## 15. Chart Design

### 15.1 Chart Container

```tsx
<div className="h-[320px] w-full rounded-2xl border border-slate-200 bg-white p-4">
```

Mobile:

```tsx
<div className="h-[260px]">
```

### 15.2 Chart Tooltip

Tooltip harus:

1. Background putih.
2. Border halus.
3. Text kecil.
4. Menampilkan satuan persen.

### 15.3 Axis

1. Font 12px.
2. Warna slate.
3. Label jelas.
4. Hindari label terlalu padat.

### 15.4 Legend

1. Posisi atas kanan atau bawah.
2. Jangan terlalu banyak item.
3. Gunakan label formal.

## 16. Table Design

### 16.1 General Table

Gunakan untuk:

1. Input summary.
2. Model features.
3. Recommendation details.
4. Timeline.

Style:

```text
Header background: #F8FAFC
Border: #E2E8F0
Cell padding: 12px sampai 16px
Font size: 14px
```

### 16.2 Mobile Table

Jika tabel terlalu lebar:

```tsx
<div className="overflow-x-auto">
```

Tabel tidak boleh menyebabkan page overflow.

## 17. Navigation Design

### 17.1 Header Desktop

Height:

```text
72px
```

Style:

```text
Background white with backdrop blur
Bottom border light
Sticky top
```

### 17.2 Header Mobile

1. Logo kiri.
2. Menu button kanan.
3. Drawer navigation.
4. CTA dashboard di dalam drawer.

### 17.3 Active Link

Active link:

```text
Text primary
Font semibold
Border bottom atau background muted
```

## 18. Content Writing Guidelines

### 18.1 Tone

Gunakan bahasa:

1. Formal.
2. Ringkas.
3. Akademik.
4. Mudah dipahami.
5. Tidak berlebihan.

### 18.2 Jangan Gunakan

1. Emoji.
2. Emoticon.
3. Bahasa terlalu santai.
4. Klaim absolut tanpa catatan.
5. Istilah teknis tanpa penjelasan.

### 18.3 Contoh Copy yang Benar

```text
Sistem memprediksi estimasi angka kemiskinan sebesar 7,70 persen dengan level prioritas intervensi Medium Priority.
```

```text
Rekomendasi utama adalah melakukan intervensi pencegahan melalui pelatihan kerja, penguatan UMKM, dan subsidi tepat sasaran.
```

### 18.4 Contoh Copy yang Dihindari

```text
Hasilnya keren banget.
```

```text
Model ini pasti akurat.
```

## 19. Accessibility Checklist

1. Semua input memiliki label.
2. Button memiliki teks yang jelas.
3. Kontras warna cukup.
4. Fokus keyboard terlihat.
5. Tidak bergantung hanya pada warna untuk menjelaskan risiko.
6. Chart memiliki caption atau ringkasan teks.
7. Tabel memiliki header.
8. Link memiliki nama yang jelas.
9. Font body minimal 14px.
10. Touch target mobile minimal 44px.

## 20. Animation Guidelines

Animasi boleh digunakan secara ringan.

Rekomendasi:

1. Fade in section.
2. Subtle slide up card.
3. Loading skeleton.
4. Button hover.
5. Chart transition.

Hindari:

1. Animasi berlebihan.
2. Parallax berat.
3. Motion cepat.
4. Animasi yang mengganggu pembacaan data.

Default transition:

```tsx
transition-all duration-200 ease-out
```

Framer Motion opsional:

```tsx
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.25 }}
```

## 21. Responsive Detail Per Halaman

### 21.1 Landing Page

Mobile:

```text
Hero single column
Text centered atau left aligned konsisten
CTA stacked
Preview card full width
```

Tablet:

```text
Hero tetap single column atau dua column ringan
Feature card dua kolom
```

Desktop:

```text
Hero dua kolom
Feature card empat kolom
```

### 21.2 Dashboard

Mobile:

```text
Form full width
Result full width
Recommendation full width
Chart height 260px
```

Tablet:

```text
Metric card dua kolom
Form tetap nyaman
```

Desktop:

```text
Form kiri fixed width
Result kanan fluid
Chart 320px sampai 360px
```

### 21.3 Scenario

Mobile:

```text
Baseline form di atas
Scenario form di bawah
Comparison stacked
```

Desktop:

```text
Baseline dan scenario sejajar
Delta card tiga kolom
```

### 21.4 Report

Mobile:

```text
Report preview full width
Table horizontal scroll jika perlu
Action buttons stacked
```

Desktop:

```text
Report preview max width 896px
Action buttons sejajar
```

## 22. Page Wireframe Text

## 22.1 Landing Page Wireframe

```text
[Header]
Logo                       Beranda Dashboard Scenario Report Model Info

[Hero]
Prediksi Kondisi Sosial Jawa Barat Berbasis Machine Learning
Deskripsi singkat sistem dan manfaatnya.
[Mulai Prediksi] [Lihat Informasi Model]

[Preview Dashboard Card]
Estimasi Kemiskinan
Priority Level
Rekomendasi Utama

[Feature Cards]
Prediksi Kemiskinan | Prioritas Intervensi | Rekomendasi Kebijakan | Scenario Comparison

[Workflow]
Input Indikator -> Model Prediksi -> Prioritas -> Rekomendasi

[Model Summary]
R2 Score | MAE | Accuracy

[Footer]
```

## 22.2 Dashboard Wireframe

```text
[Page Header]
Dashboard Prediksi Kondisi Sosial Jawa Barat

[Grid]
Left:
  Prediction Form
  Submit Button

Right:
  Result Summary
  Recommendation Panel
  Policy Timeline
  Trend Chart
```

## 22.3 Scenario Wireframe

```text
[Page Header]
Scenario Comparison

[Two Column]
Kondisi Awal        Skenario Kebijakan

[Result]
Baseline Prediction
Scenario Prediction
Delta Kemiskinan
Priority Change

[Narrative Recommendation]
```

## 22.4 Report Wireframe

```text
[Page Header]
Laporan Hasil Prediksi

[Report Preview]
Executive Summary
Input Indicator
Prediction Result
Recommendation
Timeline
Model Limitation

[Actions]
Salin Laporan
Download Markdown
```

## 23. Implementation Class Examples

### 23.1 Page Shell

```tsx
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  )
}
```

### 23.2 Section Header

```tsx
export function SectionHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-7 text-slate-600">
          {description}
        </p>
      ) : null}
    </div>
  )
}
```

### 23.3 Metric Card

```tsx
export function MetricCard({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description?: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {description}
        </p>
      ) : null}
    </div>
  )
}
```

## 24. shadcn/ui Components yang Digunakan

Komponen yang direkomendasikan:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add sheet
npx shadcn@latest add tabs
npx shadcn@latest add table
npx shadcn@latest add alert
npx shadcn@latest add skeleton
```

## 25. Suggested Dependencies

```bash
pnpm add recharts lucide-react zod react-hook-form @hookform/resolvers clsx tailwind-merge
pnpm add framer-motion
```

Jika menggunakan ONNX:

```bash
pnpm add onnxruntime-node
```

## 26. Design QA Checklist

Sebelum dianggap selesai, cek:

1. Tidak ada emoji atau emoticon.
2. Tidak ada horizontal overflow di mobile.
3. Header mobile berfungsi.
4. Button punya hover dan focus state.
5. Semua field form punya label.
6. Error validation jelas.
7. Result card terlihat jelas.
8. Recommendation panel muncul langsung setelah prediksi.
9. Timeline mudah dibaca.
10. Chart responsif.
11. Report page bisa dibaca seperti dokumen.
12. Model info page transparan.
13. Loading state tersedia.
14. Empty state tersedia.
15. Error state tersedia.
16. Build berhasil tanpa TypeScript error.
17. UI tetap rapi pada 360px, 768px, 1024px, dan 1440px.

## 27. Design Acceptance Criteria

Desain dianggap selesai jika:

1. Landing page terlihat profesional.
2. Dashboard mudah digunakan.
3. Hasil prediksi terlihat jelas.
4. Rekomendasi tampil lengkap dan tidak tersembunyi.
5. Scenario comparison mudah dipahami.
6. Report page bisa digunakan sebagai bahan laporan.
7. Semua halaman responsif.
8. Komponen rapi dan konsisten.
9. UI tidak menggunakan emoji atau emoticon.
10. Warna, spacing, dan typography konsisten.

## 28. Referensi Resmi

1. Next.js App Router Documentation: https://nextjs.org/docs/app
2. Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers
3. Tailwind CSS Responsive Design: https://tailwindcss.com/docs/responsive-design
4. shadcn/ui Documentation: https://ui.shadcn.com/docs
5. shadcn/ui Components: https://ui.shadcn.com/docs/components
6. Recharts Documentation: https://recharts.org
7. Vercel Next.js Documentation: https://vercel.com/docs/frameworks/full-stack/nextjs
