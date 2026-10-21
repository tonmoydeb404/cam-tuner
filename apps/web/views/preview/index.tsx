"use client"

import { assets } from "@/assets"
import {
  DeniedState,
  ErrorState,
  IdleState,
  RequestingState,
  deriveCamState,
} from "@/components/camera-states"
import { brand } from "@/data/brand"
import { useTuner } from "@/hooks/use-tuner"
import { useWebcam } from "@/hooks/use-webcam"
import { IconVideoOff, IconWorld } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import PreviewSidebar from "./sidebar"
import PreviewVideo from "./video"

// Accepts "meet.google.com" (assumes https) or a full "http://localhost:3000".
function siteOriginFromParam(raw: string | null): string | null {
  if (!raw) return null
  try {
    const url = new URL(raw.includes("://") ? raw : `https://${raw}`)
    if (url.protocol !== "https:" && url.protocol !== "http:") return null
    return url.origin
  } catch {
    return null
  }
}

const PreviewView = () => {
  const searchParams = useSearchParams()
  const siteOrigin = siteOriginFromParam(searchParams.get("site"))
  const siteHostname = siteOrigin ? new URL(siteOrigin).hostname : null

  const webcam = useWebcam({ autoStart: true, bypassExtension: true })
  const tuner = useTuner(webcam.stream, {}, { siteOrigin })

  const camState = deriveCamState({
    isLoading: webcam.isLoading,
    stream: webcam.stream,
    error: webcam.error,
  })

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8">
      <Link
        href="/"
        className="fixed top-5 left-6 z-10 flex items-center gap-2"
      >
        <Image src={assets.logo} alt={brand.name} width={28} priority />
        <span className="font-heading text-base font-bold">{brand.name}</span>
      </Link>

      {siteHostname && (
        <div className="fixed top-5 left-1/2 z-20 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border bg-background/95 px-3.5 py-1.5 text-xs shadow-sm backdrop-blur">
            <IconWorld size={14} className="shrink-0 text-primary" />
            <span>
              Editing settings for{" "}
              <span className="font-semibold">{siteHostname}</span> — changes
              save for this site only
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 md:flex-row">
        {/* Main Camera Preview Area */}
        <div className="dark relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border bg-card">
          <AnimatePresence mode="wait">
            {camState === "active" && (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <PreviewVideo stream={tuner.outputStream} />
                <Button
                  onClick={webcam.stopCamera}
                  variant="destructive"
                  size="icon-lg"
                  className="absolute top-4 left-4 bg-destructive/60 text-white hover:bg-destructive/70"
                >
                  <IconVideoOff />
                </Button>
              </motion.div>
            )}
            {camState === "idle" && (
              <IdleState
                onStart={webcam.startCamera}
                title="Camera Preview"
                description="Start your camera to preview and tune your stream settings."
                buttonLabel="Start Camera"
              />
            )}
            {camState === "requesting" && <RequestingState />}
            {camState === "denied" && (
              <DeniedState onStart={webcam.startCamera} />
            )}
            {camState === "error" && (
              <ErrorState onStart={webcam.startCamera} error={webcam.error} />
            )}
          </AnimatePresence>
        </div>

        {/* Tuner Controls Sidebar */}
        <PreviewSidebar tuner={tuner} webcam={webcam} />
      </div>
    </div>
  )
}

export default PreviewView
