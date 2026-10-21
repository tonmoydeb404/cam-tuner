import { glossary, glossaryBySlug } from "@/data/pseo/glossary"
import { OG_CONTENT_TYPE, OG_SIZE, OgImage } from "@/lib/og-image"

export const alt = "CamTuner — Professional Webcam Configurator"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return glossary.map((entry) => ({ term: entry.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ term: string }>
}) {
  const { term: slug } = await params
  const entry = glossaryBySlug(slug)
  return OgImage({
    title: entry ? `What is ${entry.term}?` : "Webcam terms, explained",
    subtitle:
      entry?.definition ?? "Clear definitions of webcam and video-call terms.",
  })
}
