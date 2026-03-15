"use client"

import { useSearchParams } from "next/navigation"
import type { AlignPosition, AspectRatio } from "@/lib/tuner-types"
import PreviewView from "@/views/preview"

const PreviewPage = () => {
  const searchParams = useSearchParams()

  const aspectRatio = searchParams.get("aspectRatio") as AspectRatio | null
  const zoom = searchParams.get("zoom")
  const align = searchParams.get("align") as AlignPosition | null
  const gridVisible = searchParams.get("gridVisible")

  return (
    <PreviewView
      initialAspectRatio={aspectRatio ?? undefined}
      initialZoom={zoom ? parseFloat(zoom) : undefined}
      initialAlign={align ?? undefined}
      initialGridVisible={gridVisible === "true"}
    />
  )
}

export default PreviewPage
