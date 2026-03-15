"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { AlignPosition, AspectRatio } from "@/lib/tuner-types"
import PreviewView from "@/views/preview"

type SyncStatus = "idle" | "syncing" | "success" | "error"

const PreviewPage = () => {
  const searchParams = useSearchParams()
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle")

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "syncConfigSuccess") {
        setSyncStatus("success")
        setTimeout(() => setSyncStatus("idle"), 3000)
      } else if (event.data.type === "syncConfigError") {
        setSyncStatus("error")
        setTimeout(() => setSyncStatus("idle"), 3000)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

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
      syncStatus={syncStatus}
      setSyncStatus={setSyncStatus}
    />
  )
}

export default PreviewPage
