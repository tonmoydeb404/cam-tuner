"use client"

import {
  ALIGN_OBJECT_POSITION,
  AlignPosition,
  ASPECT_RATIO_CLASS,
  AspectRatio,
  createCropZoomAlignPlugin,
  createStreamModifier,
  CROP_ZOOM_ALIGN_PLUGIN_ID,
  DEFAULT_TUNER_CONFIG,
  StreamModifier,
  TunerConfig,
} from "@workspace/stream-config"
import { useEffect, useRef, useState } from "react"

export interface UseTunerReturn {
  config: TunerConfig
  setAspectRatio: (v: AspectRatio) => void
  setZoom: (v: number) => void
  setAlign: (v: AlignPosition) => void
  // Derived CSS values
  aspectRatioClass: string
  objectPosition: string
  // Output stream
  outputStream: MediaStream | null
}

function parseAspectRatio(ratio: string): number {
  if (ratio === "16:9") return 16 / 9
  if (ratio === "4:3") return 4 / 3
  if (ratio === "1:1") return 1
  if (ratio === "9:16") return 9 / 16
  return 16 / 9 // fallback
}

export function useTuner(
  inputStream: MediaStream | null,
  initialConfig: Partial<TunerConfig> = {}
): UseTunerReturn {
  const mergedConfig = { ...DEFAULT_TUNER_CONFIG, ...initialConfig }
  const [config, setConfig] = useState<TunerConfig>(mergedConfig)
  const [outputStream, setOutputStream] = useState<MediaStream | null>(null)

  const modifierRef = useRef<StreamModifier | null>(null)

  // Sync config from extension storage via content script messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "camtuner:config-update") return
      const newConfig: TunerConfig = event.data.config
      if (!newConfig) return

      setConfig(newConfig)

      if (modifierRef.current) {
        let alignX: "left" | "center" | "right" = "center"
        if (newConfig.align.includes("left")) alignX = "left"
        else if (newConfig.align.includes("right")) alignX = "right"

        let alignY: "top" | "center" | "bottom" = "center"
        if (newConfig.align.includes("top")) alignY = "top"
        else if (newConfig.align.includes("bottom")) alignY = "bottom"

        modifierRef.current.updatePluginConfig(CROP_ZOOM_ALIGN_PLUGIN_ID, {
          aspectRatio: parseAspectRatio(newConfig.aspectRatio),
          zoom: newConfig.zoom,
          alignX,
          alignY,
        })
      }
    }

    window.addEventListener("message", handleMessage)
    window.dispatchEvent(new CustomEvent("camtuner:request-config"))
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  useEffect(() => {
    if (!inputStream) {
      if (modifierRef.current) {
        modifierRef.current.destroy()
        modifierRef.current = null
      }
      setOutputStream(null)
      return
    }

    if (modifierRef.current) {
      modifierRef.current.destroy()
    }

    const modifier = createStreamModifier(inputStream, true)

    let alignX: "left" | "center" | "right" = "center"
    if (config.align.includes("left")) alignX = "left"
    else if (config.align.includes("right")) alignX = "right"

    let alignY: "top" | "center" | "bottom" = "center"
    if (config.align.includes("top")) alignY = "top"
    else if (config.align.includes("bottom")) alignY = "bottom"

    modifier.addPlugin(createCropZoomAlignPlugin(), {
      aspectRatio: parseAspectRatio(config.aspectRatio),
      zoom: config.zoom,
      alignX,
      alignY,
    })

    modifierRef.current = modifier
    setOutputStream(modifier.outputStream)

    return () => {
      if (modifierRef.current) {
        modifierRef.current.destroy()
        modifierRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputStream])

  const setAspectRatio = (aspectRatio: AspectRatio) => {
    setConfig((c) => ({ ...c, aspectRatio }))
    modifierRef.current?.updatePluginConfig(CROP_ZOOM_ALIGN_PLUGIN_ID, {
      aspectRatio: parseAspectRatio(aspectRatio),
    })
  }

  const setZoom = (zoom: number) => {
    setConfig((c) => ({ ...c, zoom }))
    modifierRef.current?.updatePluginConfig(CROP_ZOOM_ALIGN_PLUGIN_ID, { zoom })
  }

  const setAlign = (align: AlignPosition) => {
    setConfig((c) => ({ ...c, align }))

    let alignX: "left" | "center" | "right" = "center"
    if (align.includes("left")) alignX = "left"
    else if (align.includes("right")) alignX = "right"

    let alignY: "top" | "center" | "bottom" = "center"
    if (align.includes("top")) alignY = "top"
    else if (align.includes("bottom")) alignY = "bottom"

    modifierRef.current?.updatePluginConfig(CROP_ZOOM_ALIGN_PLUGIN_ID, {
      alignX,
      alignY,
    })
  }

  return {
    config,
    setAspectRatio,
    setZoom,
    setAlign,
    aspectRatioClass: ASPECT_RATIO_CLASS[config.aspectRatio],
    objectPosition: ALIGN_OBJECT_POSITION[config.align],
    outputStream,
  }
}
