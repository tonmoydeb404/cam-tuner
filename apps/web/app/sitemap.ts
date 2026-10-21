import { brand } from "@/data/brand"
import { glossary } from "@/data/pseo/glossary"
import { personas } from "@/data/pseo/personas"
import { platforms } from "@/data/pseo/platforms"
import { ratios } from "@/data/pseo/ratios"
import { releaseNotes } from "@/data/release-notes"
import type { MetadataRoute } from "next"

// Only indexable pages belong here. Tool pages (/preview, /demo) are
// noindexed and intentionally excluded.
// At >100 URLs, split this into generateSitemaps() by page type.

// Dates below reflect when page content last meaningfully changed. Update
// them when you edit a page — never generate them dynamically.
const SITE_LAST_MODIFIED = new Date(releaseNotes[0]?.date ?? "2026-10-21")
const LEGAL_LAST_MODIFIED = new Date("2026-04-15")

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = brand.baseUrl

  const entry = (
    path: string,
    lastModified: Date,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: number
  ): MetadataRoute.Sitemap[number] => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  })

  return [
    entry("/", SITE_LAST_MODIFIED, "weekly", 1),
    // Guides hub + programmatic spokes
    entry("/webcam", SITE_LAST_MODIFIED, "weekly", 0.9),
    entry("/webcam-test", SITE_LAST_MODIFIED, "monthly", 0.9),
    ...platforms.map((p) =>
      entry(`/on/${p.slug}`, new Date(p.lastUpdated), "monthly", 0.8)
    ),
    ...ratios.map((r) =>
      entry(`/crop/${r.slug}`, new Date(r.lastUpdated), "monthly", 0.8)
    ),
    ...personas.map((p) =>
      entry(`/for/${p.slug}`, new Date(p.lastUpdated), "monthly", 0.7)
    ),
    ...glossary.map((g) =>
      entry(`/learn/${g.slug}`, new Date(g.lastUpdated), "monthly", 0.6)
    ),
    // Legal
    entry("/privacy", LEGAL_LAST_MODIFIED, "yearly", 0.3),
    entry("/terms", LEGAL_LAST_MODIFIED, "yearly", 0.3),
    // Press kit (store promo assets)
    entry("/screenshots", SITE_LAST_MODIFIED, "monthly", 0.3),
    // Changelog (indexed — dated release history)
    entry(
      "/whats-new",
      new Date(releaseNotes[0]?.date ?? "2026-10-21"),
      "weekly",
      0.5
    ),
  ]
}
