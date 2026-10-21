import { personas, personaBySlug } from "@/data/pseo/personas"
import { OG_CONTENT_TYPE, OG_SIZE, OgImage } from "@/lib/og-image"

export const alt = "CamTuner — Professional Webcam Configurator"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return personas.map((persona) => ({ persona: persona.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ persona: string }>
}) {
  const { persona: slug } = await params
  const persona = personaBySlug(slug)
  return OgImage({
    title: persona
      ? `Better webcam framing for ${persona.name}`
      : "Better webcam framing",
    subtitle:
      persona?.metaDescription ??
      "Crop, zoom and center your webcam — free browser extension.",
  })
}
