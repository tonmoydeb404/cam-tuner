import { brand } from "@/data/brand"

export const SchemaMarkup = () => {
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
        potentialAction: {
          "@type": "SearchAction",
          target: `${brand.baseUrl}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${brand.baseUrl}/#application`,
        name: brand.name,
        applicationCategory: "BrowserApplication",
        operatingSystem: "Chrome",
        description: brand.description.app,
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
        sameAs: [brand.social.github, brand.social.twitter],
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
