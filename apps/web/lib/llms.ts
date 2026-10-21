import { brand } from "@/data/brand"
import content from "@/data/content.json"
import { glossary } from "@/data/pseo/glossary"
import { personas } from "@/data/pseo/personas"
import { platforms } from "@/data/pseo/platforms"
import { ratios } from "@/data/pseo/ratios"
import { releaseNotes } from "@/data/release-notes"
import envLib from "@/lib/env"

/**
 * llms.txt (index) and llms-full.txt (full content) for AI assistants,
 * following the spec at llmstxt.org. Generated from the same data files
 * that render the site pages, so the two can never drift.
 */

const collapse = (text: string) => text.replace(/\s+/g, " ").trim()

const pageUrl = (path: string) => `${brand.baseUrl}${path}`

const storeLinks = [
  { label: "Install from the Chrome Web Store", url: envLib.chromeStoreUrl },
  { label: "Install from Firefox Add-ons", url: envLib.firefoxStoreUrl },
].filter((link): link is { label: string; url: string } => Boolean(link.url))

const mdLink = (title: string, path: string, description?: string) =>
  `- [${title}](${pageUrl(path)})${description ? `: ${collapse(description)}` : ""}`

/** "Webcam Setup for Teachers — Look Great" -> "Webcam Setup for Teachers" */
const shortTitle = (metaTitle: string) => metaTitle.split(" — ")[0] ?? metaTitle

const lastUpdated =
  [
    ...platforms.map((p) => p.lastUpdated),
    ...ratios.map((r) => r.lastUpdated),
    ...personas.map((p) => p.lastUpdated),
    ...glossary.map((g) => g.lastUpdated),
    releaseNotes[0]?.date ?? "2026-10-21",
  ]
    .sort()
    .at(-1) ?? "2026-10-21"

/** llms.txt — an annotated index of every page worth citing. */
export function buildLlmsIndex(): string {
  return [
    `# ${brand.name}`,
    "",
    `> ${collapse(brand.description.full)}`,
    "",
    `Free and open source. All processing happens locally in the browser — no video or audio ever leaves the user's machine. Current version: ${brand.version}.`,
    "",
    "## Project",
    mdLink(
      `${brand.name} homepage`,
      "/",
      content.hero.description
    ),
    ...storeLinks.map((l) => `- [${l.label}](${l.url})`),
    mdLink(
      "What's new",
      "/whats-new",
      "Full release history — every version, dated, with highlights"
    ),
    `- [Source code](${brand.social.github})`,
    mdLink("Privacy policy", "/privacy"),
    mdLink("Terms of service", "/terms"),
    mdLink(
      "Press kit",
      "/screenshots",
      "Promotional screenshots for stores and articles"
    ),
    "",
    "## Tools",
    mdLink(
      "Webcam test",
      "/webcam-test",
      "Check your camera in the browser — live preview, detected resolution and frame rate, nothing uploaded"
    ),
    mdLink(
      "Live demo",
      "/demo",
      "Tune your real camera feed in the browser with the same controls the extension adds"
    ),
    "",
    "## Platform guides",
    ...platforms.map((p) =>
      mdLink(`CamTuner for ${p.name}`, `/on/${p.slug}`, p.metaDescription)
    ),
    "",
    "## Aspect-ratio crop guides",
    ...ratios.map((r) =>
      mdLink(`Crop your webcam to ${r.name}`, `/crop/${r.slug}`, r.metaDescription)
    ),
    "",
    "## Guides by situation",
    ...personas.map((p) =>
      mdLink(shortTitle(p.metaTitle), `/for/${p.slug}`, p.metaDescription)
    ),
    "",
    "## Webcam glossary",
    ...glossary.map((g) =>
      mdLink(`What is ${g.term}?`, `/learn/${g.slug}`, g.metaDescription)
    ),
    "",
  ].join("\n")
}

/** llms-full.txt — same index, with each page's full content inlined. */
export function buildLlmsFull(): string {
  const out: string[] = [
    `# ${brand.name} — full content`,
    "",
    `> ${collapse(brand.description.full)}`,
    "",
    `Canonical index: ${pageUrl("/llms.txt")}. Content last updated: ${lastUpdated}.`,
    "",
    "## About",
    "",
    collapse(content.hero.description),
    "",
    "Everything runs locally: CamTuner hooks the browser's camera stream and adjusts it in real time (under 2 ms added latency) with WebCodecs. No video, audio or settings ever leave the machine.",
    "",
    `Works on any website that uses the webcam through the browser: ${content.worksWith.items.join(", ")}. Native desktop apps that don't use the browser's camera cannot be tuned.`,
    "",
    "### Features",
    "",
    ...content.features.cards.map((card) =>
      `- **${card.title}**: ${collapse(card.description)}${
        card.stat ? ` (${card.stat.value} ${card.stat.label.toLowerCase()})` : ""
      }`
    ),
    "",
    "### Install",
    "",
    ...content.install.steps.map(
      (step, i) => `${i + 1}. ${step.title} — ${collapse(step.description)}`
    ),
    "",
    "### FAQ",
    "",
    ...content.faq.items.flatMap((faq) => [
      `#### ${faq.q}`,
      "",
      collapse(faq.a),
      "",
    ]),
  ]

  for (const p of platforms) {
    out.push(
      `## CamTuner for ${p.name}`,
      "",
      `URL: ${pageUrl(`/on/${p.slug}`)} · Last updated: ${p.lastUpdated}`,
      "",
      ...p.intro.map(collapse),
      "",
      "### How to set it up",
      "",
      ...p.steps.map((s, i) => `${i + 1}. ${s.title} — ${collapse(s.description)}`),
      "",
      collapse(p.support.note),
      "",
      "### Platform quirks",
      "",
      ...p.quirks.map((q) => `- **${q.title}**: ${collapse(q.description)}`),
      "",
      "### FAQ",
      "",
      ...p.faqs.flatMap((faq) => [`#### ${faq.q}`, "", collapse(faq.a), ""])
    )
  }

  for (const r of ratios) {
    out.push(
      `## Crop your webcam to ${r.name}`,
      "",
      `URL: ${pageUrl(`/crop/${r.slug}`)} · Last updated: ${r.lastUpdated}`,
      "",
      ...r.intro.map(collapse),
      "",
      "### Use cases",
      "",
      ...r.useCases.map((u) => `- ${collapse(u)}`),
      "",
      "### Tips",
      "",
      ...r.tips.map((t) => `- ${collapse(t)}`),
      "",
      "### FAQ",
      "",
      ...r.faqs.flatMap((faq) => [`#### ${faq.q}`, "", collapse(faq.a), ""])
    )
  }

  for (const p of personas) {
    out.push(
      `## ${shortTitle(p.metaTitle)}`,
      "",
      `URL: ${pageUrl(`/for/${p.slug}`)} · Last updated: ${p.lastUpdated}`,
      "",
      ...p.intro.map(collapse),
      "",
      "### Common problems",
      "",
      ...p.pains.map((pain) => `- **${pain.title}**: ${collapse(pain.description)}`),
      "",
      "### What to turn on",
      "",
      ...p.features.map((f) => `- **${f.title}**: ${collapse(f.description)}`),
      "",
      "### Tips",
      "",
      ...p.tips.map((t) => `- ${collapse(t)}`),
      "",
      "### FAQ",
      "",
      ...p.faqs.flatMap((faq) => [`#### ${faq.q}`, "", collapse(faq.a), ""])
    )
  }

  for (const g of glossary) {
    out.push(
      `## What is ${g.term}?`,
      "",
      `URL: ${pageUrl(`/learn/${g.slug}`)} · Last updated: ${g.lastUpdated}`,
      "",
      collapse(g.definition),
      "",
      ...g.body.map(collapse),
      "",
      collapse(g.camtunerAngle),
      "",
      "### FAQ",
      "",
      ...g.faqs.flatMap((faq) => [`#### ${faq.q}`, "", collapse(faq.a), ""])
    )
  }

  out.push("## Changelog", "")
  for (const note of releaseNotes) {
    out.push(
      `### ${note.title} (v${note.version}, ${note.date})`,
      "",
      ...note.highlights.map((h) => `- ${collapse(h)}`),
      ""
    )
  }

  return out.join("\n")
}
