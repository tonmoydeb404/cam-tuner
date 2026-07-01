"use client"

import type { BackgroundImageEntry } from "./use-background-images"
import {
  type BackgroundConfig,
  BACKGROUND_EFFECTS_PLUGIN_ID,
  createBackgroundEffectsPlugin,
  type StreamModifier,
} from "@workspace/stream-config"
import { useEffect, useRef } from "react"

/**
 * Manages the background-effects plugin lifecycle on a StreamModifier.
 *
 * Mirrors `use-center-stage.ts`: dynamically imports the matting backends (ONNX
 * + MediaPipe, ~1 MB) ON DEMAND via Next.js code-splitting — the chunk is only
 * fetched when a background effect is actually enabled.
 *
 * The plugin is (re)created when `mode` transitions to active or when `quality`
 * changes (which requires a different matte backend). Non-structural updates
 * (blurAmount, imageId) are pushed via `updatePluginConfig` by the caller.
 *
 * @param stream  Output stream — a new object each time the modifier is rebuilt
 *                (acts as a "modifier ready" signal).
 * @param background  Current background config (only `.mode` and `.quality` are
 *                    effect deps; the rest update in place).
 * @param imagesRef  Ref to the uploads map, read by the `resolveImage` closure
 *                   so it always sees the latest uploads without re-running.
 */
export function useBackgroundEffects(
  modifierRef: React.RefObject<StreamModifier | null>,
  stream: MediaStream | null,
  background: BackgroundConfig,
  imagesRef: React.RefObject<Map<string, BackgroundImageEntry>>
) {
  // Keep a ref to the latest config so the async setup reads fresh values.
  const backgroundRef = useRef(background)
  backgroundRef.current = background

  useEffect(() => {
    if (!stream || background.mode === "none") return

    let cancelled = false
    let matteProvider: { destroy: () => void } | null = null

    ;(async () => {
      try {
        const { createMatteProvider } = await import("../lib/matting")
        if (cancelled || !modifierRef.current) return

        const { provider } = await createMatteProvider({
          quality: backgroundRef.current.quality,
        })
        if (cancelled || !modifierRef.current) {
          provider.destroy()
          return
        }
        matteProvider = provider

        modifierRef.current.addPlugin(
          createBackgroundEffectsPlugin(provider, {
            resolveImage: async (imageId: string) => {
              if (imageId.startsWith("preset:")) {
                const img = new Image()
                img.src = `/backgrounds/${imageId.slice("preset:".length)}`
                await img.decode()
                return img
              }
              const upload = imagesRef.current.get(imageId)
              if (!upload) return null
              const img = new Image()
              img.src = upload.dataUrl
              await img.decode()
              return img
            },
          }),
          backgroundRef.current
        )
      } catch (error) {
        if (!cancelled) {
          console.error("[CamTuner] Background effects failed:", error)
        }
      }
    })()

    return () => {
      cancelled = true
      modifierRef.current?.removePlugin(BACKGROUND_EFFECTS_PLUGIN_ID)
      matteProvider?.destroy()
    }
    // Only re-run when mode or quality changes — blurAmount/imageId updates
    // go through updatePluginConfig in the setter, not here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modifierRef, stream, background.mode, background.quality])
}
