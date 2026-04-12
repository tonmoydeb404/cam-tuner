"use client"

import { CamState } from "@/components/camera-states"
import { useTuner } from "@/hooks/use-tuner"
import { useWebcam } from "@/hooks/use-webcam"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { DemoBrowserMockup } from "./demo-browser-mockup"
import { DemoControlsPanel } from "./demo-controls-panel"
import { DemoVideoCanvas } from "./demo-controls-panel/demo-video-canvas"

export const DemoSection = () => {
  const webcam = useWebcam({ autoStart: false })
  const tuner = useTuner(webcam.stream)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [camState, setCamState] = useState<CamState>("idle")

  // Sync webcam state to local camState
  useEffect(() => {
    if (webcam.error) {
      const msg = webcam.error.toLowerCase()
      setCamState(
        msg.includes("denied") ||
          msg.includes("permission") ||
          msg.includes("notallowed")
          ? "denied"
          : "error"
      )
    } else if (webcam.stream) {
      setCamState("active")
    }
  }, [webcam.stream, webcam.error])

  // Keep stream attached when outputStream changes
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (tuner.outputStream && el.srcObject !== tuner.outputStream) {
      el.srcObject = tuner.outputStream
      el.play().catch(() => {})
    } else if (!tuner.outputStream) {
      el.srcObject = null
    }
  }, [tuner.outputStream])

  // Ref callback — fires the instant <video> mounts into DOM
  const attachVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el
    if (el && tuner.outputStream && el.srcObject !== tuner.outputStream) {
      el.srcObject = tuner.outputStream
      el.play().catch(() => {})
    }
  }

  const handleStart = async () => {
    setCamState("requesting")
    await webcam.startCamera()
  }

  const handleStop = () => {
    webcam.stopCamera()
    setCamState("idle")
  }

  return (
    <motion.div
      id="hero-demo"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative z-20 mt-16 w-full max-w-[95vw] scroll-mt-52 sm:mt-36 sm:max-w-6xl"
    >
      <DemoBrowserMockup>
        <div className="flex flex-col md:h-145 md:flex-row">
          <DemoVideoCanvas
            camState={camState}
            videoRef={attachVideoRef}
            onStart={handleStart}
            onStop={handleStop}
            error={webcam.error}
          />
          <DemoControlsPanel
            camState={camState}
            tuner={tuner}
            webcam={webcam}
          />
        </div>
      </DemoBrowserMockup>
    </motion.div>
  )
}
