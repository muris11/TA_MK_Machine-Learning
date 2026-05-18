import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { siteConfig } from "@/lib/constants"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Prediksi Kemiskinan Jawa Barat | Machine Learning Dashboard Sosial",
    template: "%s | Prediksi Kemiskinan Jawa Barat",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Prediksi Kemiskinan Jawa Barat",
    "Machine Learning",
    "Dashboard Sosial",
    "Rekomendasi Kebijakan",
    "Decision Support System",
  ],
  authors: [{ name: "Kemiskinan Jabar ML" }],
  openGraph: {
    title: "Prediksi Kondisi Sosial Jawa Barat",
    description: siteConfig.description,
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E3A8A",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background text-foreground">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
