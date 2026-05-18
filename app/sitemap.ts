import type { MetadataRoute } from "next"
import { navigationItems, siteConfig } from "@/lib/constants"

export default function sitemap(): MetadataRoute.Sitemap {
  return navigationItems.map((item) => ({
    url: `${siteConfig.url}${item.href}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: item.href === "/" ? 1 : 0.8,
  }))
}
