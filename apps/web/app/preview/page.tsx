"use client"

import PreviewView from "@/views/preview"
import { useEffect, useState } from "react"

type SyncStatus = "idle" | "syncing" | "success" | "error"

const PreviewPage = () => {
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

  return <PreviewView syncStatus={syncStatus} setSyncStatus={setSyncStatus} />
}

export default PreviewPage
