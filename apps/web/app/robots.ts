import { brand } from "@/data/brand"
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${brand.baseUrl}/sitemap.xml`,
  }
}
