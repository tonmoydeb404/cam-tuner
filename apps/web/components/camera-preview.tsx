"use client"

import { TunerConfig } from "@/lib/tuner-types"
import { useEffect, useRef } from "react"

interface CameraPreviewProps {
  stream: MediaStream | null
  config: TunerConfig
}

export function CameraPreview({
  stream,
  config,
}: CameraPreviewProps) {
  const { gridVisible } = config
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
    <div
      className={`relative mx-auto flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-inner ring-1 ring-white/5 transition-all duration-500 ease-in-out`}
    >
      {/* Video Source */}
      <video
        autoPlay
        playsInline
        muted
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
      <div className="absolute inset-0 -z-10 flex items-center justify-center bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-black">
        <div className="flex flex-col items-center gap-3 font-mono text-sm tracking-widest text-neutral-700 uppercase">
          <svg
            className="h-8 w-8 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          No Video Feed
        </div>
      </div>

      {/* Alignment Grid Overlay */}
      {gridVisible && (
        <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border border-white/10" />
          ))}
          {/* Center Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[1px] w-4 bg-white/40" />
            <div className="absolute h-4 w-[1px] bg-white/40" />
          </div>
        </div>
      )}
    </div>
  )
}
