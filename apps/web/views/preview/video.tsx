"use client"

import { IconVideo } from "@tabler/icons-react"
import { useEffect, useRef } from "react"

interface CameraPreviewProps {
  stream: MediaStream | null
}

const PreviewVideo = (props: CameraPreviewProps) => {
  const { stream } = props
  const internalRef = useRef<HTMLVideoElement | null>(null)

  // Reactively update srcObject whenever `stream` changes
  useEffect(() => {
    const el = internalRef.current
    if (!el) return
    if (el.srcObject !== stream) {
      el.srcObject = stream
    }
  }, [stream])

  return (
    <>
      {/* Video Source */}
      <video
        autoPlay
        playsInline
        muted
        aria-label="Camera preview"
        className="absolute inset-0 h-full w-full text-transparent"
        style={{ objectFit: "contain" }}
        ref={(el) => {
          internalRef.current = el
          // Set srcObject on initial mount
          if (el && stream) {
            if (el.srcObject !== stream) el.srcObject = stream
          } else if (el && !stream) {
            el.srcObject = null
          }
        }}
      />

      {/* Fallback pattern while loading or if no camera */}
      <div className="flex flex-col items-center justify-center gap-y-2">
        <IconVideo className="size-8 text-muted-foreground" />
        <span className="text-muted-foreground">No Video Feed</span>
      </div>
    </>
  )
}

export default PreviewVideo
