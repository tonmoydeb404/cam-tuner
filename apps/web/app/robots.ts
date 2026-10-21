import { brand } from "@/data/brand"
import type { MetadataRoute } from "next"

// Policy decision (AEO): AI crawlers are explicitly allowed so CamTuner can
// be cited as a source by AI assistants. Blocking them would opt the site out
// of AI answers without protecting anything — the product is free and
// public. Review this list as the crawler landscape evolves.
const AI_CRAWLERS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${brand.baseUrl}/sitemap.xml`,
  }
}
