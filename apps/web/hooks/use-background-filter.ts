"use client"

import {
  BACKGROUND_PLUGIN_ID,
  BACKGROUND_PRESETS,
  createBackgroundPlugin,
  resolveBackgroundConfig,
  type BackgroundMode,
  type StreamModifier,
} from "@workspace/stream-config"
import { useEffect, useRef } from "react"

const CDN_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
const SELFIE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite"

export type UseBackgroundFilterOptions = {
  mode: BackgroundMode
  blurAmount: number
  imageId: string | null
  resolveUploadedImage?: (id: string) => Promise<string | null>
}

function loadImageEl(src: string): Promise<CanvasImageSource | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export function useBackgroundFilter(
  modifierRef: React.RefObject<StreamModifier | null>,
  stream: MediaStream | null,
  options: UseBackgroundFilterOptions
) {
  const { mode, blurAmount, imageId } = options
  const active = mode !== "none"

  const optionsRef = useRef(options)
  optionsRef.current = options
  const attachedRef = useRef(false)

  useEffect(() => {
    if (!stream || !active) {
      if (attachedRef.current) {
        modifierRef.current?.removePlugin(BACKGROUND_PLUGIN_ID)
        attachedRef.current = false
      }
      return
    }

    if (attachedRef.current) return
    attachedRef.current = true

    let cancelled = false
    ;(async () => {
      try {
        const { createMediaPipeSegmenter } =
          await import("../lib/tracking/mediapipe-segmenter")
        if (cancelled || !modifierRef.current) return

        const segmenter = createMediaPipeSegmenter({
          filesetUrl: CDN_WASM_URL,
          modelAssetPath: SELFIE_MODEL_URL,
        })
        if (cancelled || !modifierRef.current) {
          segmenter.destroy()
          return
        }

        const o = optionsRef.current
        modifierRef.current.addPlugin(
          createBackgroundPlugin(segmenter, {
            resolveImage: async (id: string) => {
              if (id.startsWith("preset:")) {
                const preset = BACKGROUND_PRESETS.find((p) => p.id === id)
                if (!preset) return null
                return loadImageEl(preset.full)
              }
              if (o.resolveUploadedImage) {
                const dataUrl = await o.resolveUploadedImage(id)
                if (!dataUrl) return null
                return loadImageEl(dataUrl)
              }
              return null
            },
          }),
          resolveBackgroundConfig({
            mode: o.mode,
            blurAmount: o.blurAmount,
            imageId: o.imageId,
          })
        )
      } catch (error) {
        if (!cancelled) {
          attachedRef.current = false
          console.error("[CamTuner] Background filter failed:", error)
        }
      }
    })()

    return () => {
      cancelled = true
      modifierRef.current?.removePlugin(BACKGROUND_PLUGIN_ID)
      attachedRef.current = false
    }
  }, [modifierRef, stream, active])

  useEffect(() => {
    if (!attachedRef.current) return
    modifierRef.current?.updatePluginConfig(
      BACKGROUND_PLUGIN_ID,
      resolveBackgroundConfig({ mode, blurAmount, imageId })
    )
  }, [modifierRef, mode, blurAmount, imageId])
}
