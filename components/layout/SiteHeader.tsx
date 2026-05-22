"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, LogIn, Menu, X } from "lucide-react"
import { useState } from "react"
import { navigationItems, siteConfig } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { buttonStyles } from "@/components/ui/button"

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/"
  }

  return pathname.startsWith(href)
}

export function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-900">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold leading-tight text-slate-950 sm:text-base">
              {siteConfig.shortName}
            </span>
            <span className="hidden text-xs leading-tight text-slate-500 sm:block">
              Decision support system
            </span>
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950",
                isActive(pathname, item.href) && "bg-blue-50 text-blue-900",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/admin/login" className={buttonStyles({ variant: "outline", size: "sm" })}>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Login
          </Link>
          <Link href="/dashboard" className={buttonStyles({ size: "sm" })}>
            Mulai Prediksi
          </Link>
        </div>

        <button
          type="button"
          className={buttonStyles({ variant: "outline", size: "icon", className: "lg:hidden" })}
          aria-label="Buka navigasi"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" id="mobile-navigation">
          <button
            type="button"
            aria-label="Tutup navigasi"
            className="absolute inset-0 bg-slate-950/30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-dvh w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-2xl">
            <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-4">
              <span className="text-sm font-bold text-slate-950">{siteConfig.shortName}</span>
              <button
                type="button"
                className={buttonStyles({ variant: "ghost", size: "icon" })}
                aria-label="Tutup navigasi"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Navigasi mobile" className="flex flex-col gap-1 p-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100",
                    isActive(pathname, item.href) && "bg-blue-50 text-blue-900",
                  )}
                  >
                    {item.label}
                  </Link>
              ))}
              <Link
                href="/admin/login"
                onClick={() => setIsOpen(false)}
                className={buttonStyles({ variant: "outline", className: "mt-4 w-full" })}
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Login
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className={buttonStyles({ className: "w-full" })}
              >
                Mulai Prediksi
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  )
}
