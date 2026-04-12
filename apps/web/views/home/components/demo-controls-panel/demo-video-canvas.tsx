"use client"

import {
  CamState,
  DeniedState,
  ErrorState,
  IdleState,
  RequestingState,
} from "@/components/camera-states"
import { IconPlayerStopFilled } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { AnimatePresence, motion } from "framer-motion"

interface DemoVideoCanvasProps {
  camState: CamState
  videoRef: (el: HTMLVideoElement | null) => void
  onStart: () => void
  onStop: () => void
  error: string | null
}

export const DemoVideoCanvas = (props: DemoVideoCanvasProps) => {
  const { camState, videoRef, onStart, error, onStop } = props

  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-stone-900 max-md:h-80 md:flex-1">
      <AnimatePresence mode="wait">
        {camState === "active" && (
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
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
              <Button
                size={"icon-lg"}
                variant={"destructive"}
                className={"bg-destructive text-white"}
                onClick={onStop}
              >
                <IconPlayerStopFilled />
              </Button>
            </div>
          </motion.div>
        )}

        {camState === "idle" && (
          <IdleState
            onStart={onStart}
            title="Interactive Demo"
            description="Allow camera access to try the tuner with your own webcam feed."
            buttonLabel="Start Demo"
          />
        )}
        {camState === "requesting" && <RequestingState />}
        {camState === "denied" && <DeniedState onStart={onStart} />}
        {camState === "error" && <ErrorState onStart={onStart} error={error} />}
      </AnimatePresence>
    </div>
  )
}
