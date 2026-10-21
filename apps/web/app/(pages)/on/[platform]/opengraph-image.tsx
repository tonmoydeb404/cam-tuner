import { platformBySlug, platforms } from "@/data/pseo/platforms"
import { OG_CONTENT_TYPE, OG_SIZE, OgImage } from "@/lib/og-image"

export const alt = "CamTuner — Professional Webcam Configurator"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return platforms.map((platform) => ({ platform: platform.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ platform: string }>
}) {
  const { platform: slug } = await params
  const platform = platformBySlug(slug)
  return OgImage({
    title: platform
      ? `Fix your webcam on ${platform.name}`
      : "Fix your webcam everywhere",
    subtitle:
      platform?.metaDescription ??
      "Crop, zoom and align your live camera feed — free browser extension.",
  })
}
