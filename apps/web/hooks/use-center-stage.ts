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
 * Manages the Center Stage controller plugin on a StreamModifier.
 *
 * Framing (panning) and auto-zoom are independent channels that share a single
 * face detector, so the plugin is attached while *either* is active and fed
 * each channel's flag independently at runtime.
 *
 * Loads the MediaPipe adapter (and its ~146 KB runtime) ON DEMAND via dynamic
 * import — Next.js code-splits it into a separate chunk fetched only when a
 * face-tracking feature is enabled.
 *
 * @param stream  The current output stream (acts as a "modifier ready" signal;
 *                a new object is created each time the modifier is rebuilt).
 */
export function useCenterStage(
  modifierRef: React.RefObject<StreamModifier | null>,
  stream: MediaStream | null,
  options: UseCenterStageOptions
) {
  const { centerStageEnabled, zoomMode, autoZoomMin, autoZoomMax } = options
  // The plugin is needed while either channel is on.
  const active = centerStageEnabled || zoomMode === "auto"

  // Latest config, read at attach time so the freshly created plugin starts
  // with current values even if they changed during the async import.
  const optionsRef = useRef(options)
  optionsRef.current = options
  const attachedRef = useRef(false)

  // Attach / detach based on whether any face-tracking channel is active.
  useEffect(() => {
    if (!stream || !active) {
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

        const o = optionsRef.current
        modifierRef.current.addPlugin(
          createCenterStagePlugin(modifierRef.current, detector, {
            enabled: o.centerStageEnabled,
            zoomMode: o.zoomMode,
            minZoom: o.autoZoomMin,
            maxZoom: o.autoZoomMax,
          }),
          {
            enabled: o.centerStageEnabled,
            zoomMode: o.zoomMode,
            minZoom: o.autoZoomMin,
            maxZoom: o.autoZoomMax,
          }
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
  }, [modifierRef, stream, active])

  // Push runtime config changes to the attached plugin without re-attaching.
  useEffect(() => {
    if (!attachedRef.current) return
    modifierRef.current?.updatePluginConfig(CENTER_STAGE_PLUGIN_ID, {
      enabled: centerStageEnabled,
      zoomMode,
      minZoom: autoZoomMin,
      maxZoom: autoZoomMax,
    })
  }, [
    modifierRef,
    centerStageEnabled,
    zoomMode,
    autoZoomMin,
    autoZoomMax,
  ])
}
