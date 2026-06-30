"use client"

import {
  CENTER_STAGE_PLUGIN_ID,
  createCenterStagePlugin,
  type StreamModifier,
} from "@workspace/stream-config"
import { useEffect, useRef } from "react"

const CDN_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
const FACE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"

/**
 * Manages the Center Stage plugin lifecycle on a StreamModifier.
 *
 * Loads the MediaPipe adapter (and its ~146 KB runtime) ON DEMAND via dynamic
 * import — Next.js code-splits it into a separate chunk fetched only when
 * Center Stage is enabled.
 *
 * @param stream  The current output stream (acts as a "modifier ready" signal;
 *                a new object is created each time the modifier is rebuilt).
 */
export function useCenterStage(
  modifierRef: React.RefObject<StreamModifier | null>,
  stream: MediaStream | null,
  enabled: boolean
) {
  const attachedRef = useRef(false)

  useEffect(() => {
    if (!stream || !enabled) {
      if (attachedRef.current) {
        modifierRef.current?.removePlugin(CENTER_STAGE_PLUGIN_ID)
        attachedRef.current = false
      }
      return
    }

    if (attachedRef.current) return
    attachedRef.current = true

    let cancelled = false
    ;(async () => {
      try {
        const { createMediaPipeFaceDetector } = await import(
          "../lib/tracking/mediapipe-detector"
        )
        if (cancelled || !modifierRef.current) return

        const detector = createMediaPipeFaceDetector({
          filesetUrl: CDN_WASM_URL,
          modelAssetPath: FACE_MODEL_URL,
        })
        if (cancelled || !modifierRef.current) {
          detector.destroy()
          return
        }

        modifierRef.current.addPlugin(
          createCenterStagePlugin(modifierRef.current, detector, {
            enabled: true,
          }),
          { enabled: true }
        )
      } catch (error) {
        if (!cancelled) {
          attachedRef.current = false
          console.error("[CamTuner] Center Stage failed:", error)
        }
      }
    })()

    return () => {
      cancelled = true
      modifierRef.current?.removePlugin(CENTER_STAGE_PLUGIN_ID)
      attachedRef.current = false
    }
  }, [modifierRef, stream, enabled])
}
