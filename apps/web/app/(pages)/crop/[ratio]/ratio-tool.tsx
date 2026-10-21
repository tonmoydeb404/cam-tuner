"use client"

import {
  DeniedState,
  ErrorState,
  IdleState,
  RequestingState,
  deriveCamState,
} from "@/components/camera-states"
import { useTuner } from "@/hooks/use-tuner"
import { useWebcam } from "@/hooks/use-webcam"
import type { AspectRatio } from "@workspace/stream-config"
import { Switch } from "@workspace/ui/components/switch"
import { AlignPluginControl } from "@workspace/ui/components/tuner/align-plugin-control"
import { ZoomControl } from "@workspace/ui/components/tuner/zoom-control"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef } from "react"

/**
 * Live crop tool embedded in /crop/[ratio] pages. The page's ratio is
 * preloaded; the visitor can zoom, align and toggle letterboxing on their
 * own camera. Processing stays local; nothing is synced to the extension.
 */
export const RatioTool = ({ ratio }: { ratio: AspectRatio }) => {
  const webcam = useWebcam({ autoStart: false, bypassExtension: true })
  const { isLoading, error, stream } = webcam
  const tuner = useTuner(
    stream,
    { aspectRatio: ratio },
    { syncExtension: false }
  )
  const camState = deriveCamState({ isLoading, stream, error })
  const videoElRef = useRef<HTMLVideoElement | null>(null)

  // Attach the tuner output stream (mirrors the homepage showcase).
  useEffect(() => {
    const el = videoElRef.current
    if (!el) return
    if (tuner.outputStream && el.srcObject !== tuner.outputStream) {
      el.srcObject = tuner.outputStream
      el.play().catch(() => {})
    } else if (!tuner.outputStream) {
      el.srcObject = null
    }
  }, [tuner.outputStream])

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div
        role="region"
        aria-label={`Live ${ratio} crop preview`}
        className="relative aspect-video overflow-hidden rounded-lg border border-border bg-black"
      >
        <AnimatePresence mode="wait">
          {camState === "active" ? (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <video
                ref={videoElRef}
                autoPlay
                playsInline
                muted
                aria-label="Cropped camera preview"
                className="h-full w-full object-contain"
              />
            </motion.div>
          ) : camState === "idle" ? (
            <div
              key="idle"
              className="absolute inset-0 flex items-center justify-center"
            >
              <IdleState
                onStart={webcam.startCamera}
                title={`See yourself in ${ratio}`}
                description="Start your camera and this preview applies the crop live. Nothing is recorded or uploaded."
                buttonLabel="Start camera"
              />
            </div>
          ) : camState === "requesting" ? (
            <div
              key="requesting"
              className="absolute inset-0 flex items-center justify-center"
            >
              <RequestingState />
            </div>
          ) : camState === "denied" ? (
            <div
              key="denied"
              className="absolute inset-0 flex items-center justify-center"
            >
              <DeniedState onStart={webcam.startCamera} />
            </div>
          ) : (
            <div
              key="error"
              className="absolute inset-0 flex items-center justify-center"
            >
              <ErrorState onStart={webcam.startCamera} error={webcam.error} />
            </div>
          )}
        </AnimatePresence>
        <span className="absolute top-3 left-3 rounded-sm bg-black/60 px-2 py-1 text-xs text-white/80">
          {ratio} · live preview
        </span>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-5 text-lg font-bold">Controls</h2>
        <div className="flex flex-col gap-6">
          <ZoomControl value={tuner.config.zoom} onChange={tuner.setZoom} />
          <AlignPluginControl
            config={tuner.config}
            onConfigChange={tuner.updateConfig}
          />
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Letterbox</span>
              <span className="text-xs text-muted-foreground">
                Pad instead of crop
              </span>
            </div>
            <Switch
              checked={tuner.config.letterbox ?? true}
              onCheckedChange={tuner.setLetterbox}
              aria-label="Letterbox"
            />
          </div>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Happy with the framing? The CamTuner extension keeps it on every call
          — this page only previews it.
        </p>
      </div>
    </div>
  )
}
