"use client"

import { getFaceTrackingService } from "@workspace/stream-config"
import { useEffect, useRef } from "react"

const CDN_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
const FACE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"

export type UseCenterStageOptions = {
  /** Auto-framing (alignCenter panning) on/off. */
  centerStageEnabled: boolean
  /** Auto-zoom vs manual zoom. */
  zoomMode: "auto" | "fixed"
  /** Auto-zoom bounds (only used when zoomMode === "auto"). */
  autoZoomMin: number
  autoZoomMax: number
}

/**
 * Manages the face detector lifecycle for the align and zoom plugins.
 *
 * When either auto-framing or auto-zoom is active, this hook loads the
 * MediaPipe face detector on demand and injects it into the shared
 * FaceTrackingService singleton.  The align and zoom controller plugins
 * read from that service each frame.
 *
 * Loads the adapter (~146 KB runtime) ON DEMAND via dynamic import — Next.js
 * code-splits it into a separate chunk fetched only when needed.
 *
 * @param stream  The current output stream (acts as a "modifier ready" signal;
 *                a new object is created each time the modifier is rebuilt).
 */
export function useCenterStage(
  _modifierRef: React.RefObject<unknown>,
  stream: MediaStream | null,
  options: UseCenterStageOptions
) {
  const { centerStageEnabled, zoomMode, autoZoomMin, autoZoomMax } = options
  const active = centerStageEnabled || zoomMode === "auto"

  const optionsRef = useRef(options)
  optionsRef.current = options
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!stream || !active) {
      if (loadedRef.current) {
        getFaceTrackingService().destroy()
        loadedRef.current = false
      }
      return
    }

    if (loadedRef.current) return
    loadedRef.current = true

    let cancelled = false
    ;(async () => {
      try {
        const { createMediaPipeFaceDetector } =
          await import("../lib/tracking/mediapipe-detector")
        if (cancelled) return

        const detector = createMediaPipeFaceDetector({
          filesetUrl: CDN_WASM_URL,
          modelAssetPath: FACE_MODEL_URL,
        })
        if (cancelled) {
          detector.destroy()
          return
        }

        getFaceTrackingService().init(detector)
      } catch (error) {
        if (!cancelled) {
          loadedRef.current = false
          console.error("[CamTuner] Face tracking failed:", error)
        }
      }
    })()

    return () => {
      cancelled = true
      getFaceTrackingService().destroy()
      loadedRef.current = false
    }
  }, [stream, active])
}
