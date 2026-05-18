import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { buttonStyles } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
            Siap Digunakan
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Jalankan prediksi dan susun rekomendasi kebijakan dalam satu alur.
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Gunakan dashboard untuk demonstrasi proyek Machine Learning, presentasi akademik,
            atau analisis awal dampak indikator sosial ekonomi.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <Link href="/dashboard" className={buttonStyles({ size: "lg" })}>
            Buka Dashboard
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/scenario" className={buttonStyles({ variant: "outline", size: "lg" })}>
            Bandingkan Skenario
          </Link>
        </div>
      </div>
    </section>
  )
}
