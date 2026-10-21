import { JsonLd } from "@/components/json-ld"
import { brand } from "@/data/brand"
import content from "@/data/content.json"
import { releaseNotes } from "@/data/release-notes"
import envLib from "@/lib/env"

export const SchemaMarkup = () => {
  const sameAs = [brand.social.github, envLib.chromeStoreUrl].filter(
    (url): url is string => Boolean(url)
  )

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${brand.baseUrl}/#website`,
        url: brand.baseUrl,
        name: brand.name,
        description: brand.description.schema,
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${brand.baseUrl}/#application`,
        name: brand.name,
        applicationCategory: "BrowserApplication",
        operatingSystem: "Chrome",
        description: brand.description.app,
        url: brand.baseUrl,
        softwareVersion: brand.version,
        dateModified: releaseNotes[0]?.date,
        author: { "@id": `${brand.baseUrl}/#developer` },
        publisher: { "@id": `${brand.baseUrl}/#organization` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Aspect ratio cropping",
          "Zoom control",
          "Video alignment",
          "Custom letterbox colors",
          "Zero-latency processing",
          "Local-only processing",
        ],
      },
      {
        "@type": "Organization",
        "@id": `${brand.baseUrl}/#organization`,
        name: brand.name,
        url: brand.baseUrl,
        founder: { "@id": `${brand.baseUrl}/#developer` },
        sameAs,
      },
      {
        "@type": "Person",
        "@id": `${brand.baseUrl}/#developer`,
        name: brand.developer.name,
        url: brand.developer.website,
        sameAs: [brand.developer.website],
      },
      {
        "@type": "WebPage",
        "@id": `${brand.baseUrl}/#webpage`,
        url: brand.baseUrl,
        name: brand.title,
        isPartOf: { "@id": `${brand.baseUrl}/#website` },
        about: { "@id": `${brand.baseUrl}/#application` },
        description: brand.description.short,
      },
    ],
  }

  return <JsonLd data={schema} />
}

/**
 * FAQPage schema for the homepage FAQ section. Lives on the homepage only —
 * one FAQPage entity per page, so guide pages render their own.
 */
export const HomeFaqSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${brand.baseUrl}/#faq`,
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }

  return <JsonLd data={schema} />
}
