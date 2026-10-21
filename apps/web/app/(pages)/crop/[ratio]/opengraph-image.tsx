import { ratioBySlug, ratios } from "@/data/pseo/ratios"
import { OG_CONTENT_TYPE, OG_SIZE, OgImage } from "@/lib/og-image"

export const alt = "CamTuner — Professional Webcam Configurator"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return ratios.map((ratio) => ({ ratio: ratio.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ ratio: string }>
}) {
  const { ratio: slug } = await params
  const ratio = ratioBySlug(slug)
  return OgImage({
    title: ratio
      ? `Crop your webcam to ${ratio.name}`
      : "Crop your webcam to any shape",
    subtitle:
      ratio?.metaDescription ??
      "Try it live in your browser, then keep the framing on every call.",
  })
}
