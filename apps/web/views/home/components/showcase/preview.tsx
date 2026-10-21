"use client"

import {
  CamState,
  DeniedState,
  ErrorState,
  IdleState,
  RequestingState,
} from "@/components/camera-states"
import { IconPlayerStopFilled } from "@tabler/icons-react"
import type { TunerConfig } from "@workspace/stream-config"
import { cn } from "@workspace/ui/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface ShowcasePreviewProps {
  camState: CamState
  videoRef: (el: HTMLVideoElement | null) => void
  onStart: () => void
  onStop: () => void
  error: string | null
  config: TunerConfig
  activeLabel: string
  activeIndex: number
  total: number
}

export const ShowcasePreview = ({
  camState,
  videoRef,
  onStart,
  onStop,
  error,
  config,
  activeLabel,
  activeIndex,
  total,
}: ShowcasePreviewProps) => {
  const isLive = camState === "active"
  const chips = [
    config.aspectRatio,
    config.zoomMode === "auto" ? "Auto zoom" : `${config.zoom.toFixed(1)}x`,
    config.align.replace("-", " "),
    config.centerStageEnabled ? "Center Stage" : null,
    config.mirror ? "Mirrored" : null,
  ].filter((chip): chip is string => Boolean(chip))

  return (
    <div
      role="region"
      aria-label="Live camera preview"
      className="relative aspect-[4/3] overflow-hidden rounded-[0.5rem] border border-border bg-black text-white sm:aspect-video"
    >
      <AnimatePresence mode="wait">
        {isLive && (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              aria-label="Camera preview"
              className="h-full w-full object-contain"
            />
          </motion.div>
        )}
        {camState === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <IdleState
              onStart={onStart}
              title="Try it with your camera"
              description="Nothing is recorded or uploaded. Your feed stays in this tab."
              buttonLabel="Start camera"
            />
          </div>
        )}
        {camState === "requesting" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <RequestingState />
          </div>
        )}
        {camState === "denied" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <DeniedState onStart={onStart} />
          </div>
        )}
        {camState === "error" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ErrorState onStart={onStart} error={error} />
          </div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
        <AnimatePresence mode="wait">
          <motion.span
            key={activeLabel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="max-w-[55%] truncate rounded-sm bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur"
          >
            {activeLabel}
          </motion.span>
        </AnimatePresence>

        {isLive ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop camera"
            className="pointer-events-auto flex cursor-pointer items-center gap-1.5 rounded-sm bg-black/60 py-1 pr-2.5 pl-2 text-xs font-medium text-white backdrop-blur transition hover:bg-destructive focus-visible:outline-2 focus-visible:outline-ring"
          >
            <IconPlayerStopFilled className="size-3" />
            Stop camera
          </button>
        ) : (
          <span className="rounded-sm bg-black/60 px-2.5 py-1 text-xs text-white/60 backdrop-blur">
            Camera off
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
        <ul className="flex min-w-0 flex-wrap gap-1.5">
          {chips.map((chip, i) => (
            <li
              key={chip}
              className={cn(
                "rounded-sm bg-black/60 px-2 py-1 text-xs leading-none text-white/80 capitalize backdrop-blur",
                // Keep the video visible on narrow screens: first 3 chips only.
                i > 2 && "hidden sm:block"
              )}
            >
              {chip}
            </li>
          ))}
        </ul>
        <div
          className="hidden shrink-0 gap-1 rounded-sm bg-black/60 px-2 py-2 backdrop-blur sm:flex"
          aria-hidden="true"
        >
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all motion-reduce:transition-none",
                i === activeIndex ? "w-4 bg-primary" : "w-1.5 bg-white/30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
