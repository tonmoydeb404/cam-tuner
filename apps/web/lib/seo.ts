import { brand } from "@/data/brand"
import type { Metadata } from "next"

interface PageMetadataInput {
  /** Absolute site path, e.g. "/on/google-meet". Used for canonical + og:url. */
  path: string
  /** Full <title> string, 50-60 chars recommended. */
  title: string
  /** Meta description, 150-160 chars recommended. */
  description: string
  /** Set for tool/utility pages that should stay out of the index. */
  noindex?: boolean
  /**
   * Set on routes that have their own file-based opengraph-image.tsx: omits
   * the default OG image config so Next injects the route's generated image
   * (with its build-time hash) automatically.
   */
  fileBasedImage?: boolean
}

/**
 * Per-page metadata. Every indexable page must set its own canonical — the
 * root layout deliberately does not set one, because Next.js cascades layout
 * metadata to all children (a root-level canonical would point every page at
 * the homepage).
 */
export function pageMetadata({
  path,
  title,
  description,
  noindex = false,
  fileBasedImage = false,
}: PageMetadataInput): Metadata {
  const defaultImage = {
    url: brand.ogImage.url,
    width: brand.ogImage.width,
    height: brand.ogImage.height,
    alt: brand.ogImage.alt,
  }

  return {
    title,
    description,
    alternates: noindex ? undefined : { canonical: path },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: path,
      siteName: brand.name,
      title,
      description,
      // Key must be absent (not undefined) for file-based OG to inject.
      ...(fileBasedImage ? {} : { images: [defaultImage] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(fileBasedImage ? {} : { images: [defaultImage.url] }),
    },
  }
}

/** Async variant for dynamic routes that must await params first. */
export async function asyncPageMetadata(
  input: PageMetadataInput
): Promise<Metadata> {
  return pageMetadata(input)
}

interface Crumb {
  name: string
  path: string
}

export function breadcrumbSchema(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${brand.baseUrl}${item.path}`,
    })),
  }
}

export function faqSchema(faqs: { q: string; a: string }[], id: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": id,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }
}
