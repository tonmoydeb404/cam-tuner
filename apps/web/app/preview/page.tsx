"use client"

import PreviewView from "@/views/preview"
import type { AlignPosition, AspectRatio } from "@workspace/stream-config"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

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

  return (
    <PreviewView
      initialAspectRatio={aspectRatio ?? undefined}
      initialZoom={zoom ? parseFloat(zoom) : undefined}
      initialAlign={align ?? undefined}
      syncStatus={syncStatus}
      setSyncStatus={setSyncStatus}
    />
  )
}

export default PreviewPage
