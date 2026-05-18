import Link from "next/link"
import { navigationItems, siteConfig } from "@/lib/constants"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-slate-950">{siteConfig.name}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Platform demonstrasi Machine Learning untuk prediksi kemiskinan dan rekomendasi
            kebijakan sosial Provinsi Jawa Barat.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <nav aria-label="Navigasi footer" className="flex flex-wrap gap-x-4 gap-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-blue-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="text-sm text-slate-500">© {year}</p>
        </div>
      </div>
    </footer>
  )
}
