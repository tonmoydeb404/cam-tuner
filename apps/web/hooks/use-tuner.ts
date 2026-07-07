"use client"

import type { ZoomMode } from "@workspace/stream-config"
import {
  ALIGN_OBJECT_POSITION,
  type AlignPosition,
  ASPECT_RATIO_CLASS,
  type AspectRatio,
  type BackgroundMode,
  DEFAULT_TUNER_CONFIG,
  PLUGIN_REGISTRY,
  type TunerConfig,
} from "@workspace/stream-config"
import { useCallback, useEffect, useRef, useState } from "react"
import { fetchBgImage } from "../lib/extension-bridge"
import { useBackgroundFilter } from "./use-background-filter"
import { useCenterStage } from "./use-center-stage"
import { useDebouncedCallback } from "./use-debounced-callback"
import { useStreamModifier } from "./use-stream-modifier"

const SYNC_DEBOUNCE_MS = 300

export interface UseTunerReturn {
  config: TunerConfig
  updateConfig: (update: Partial<TunerConfig>) => void
  setAspectRatio: (v: AspectRatio) => void
  setZoom: (v: number) => void
  setAlign: (v: AlignPosition) => void
  setBarColor: (v: string) => void
  setMirror: (v: boolean) => void
  setCenterStageEnabled: (v: boolean) => void
  setLetterbox: (v: boolean) => void
  setZoomMode: (v: ZoomMode) => void
  setAutoZoomMin: (v: number) => void
  setAutoZoomMax: (v: number) => void
  setBackgroundMode: (v: BackgroundMode) => void
  setBlurStrength: (v: number) => void
  setBackgroundImage: (v: string | null) => void
  resetConfig: () => void
  aspectRatioClass: string
  objectPosition: string
  outputStream: MediaStream | null
  inputStream: MediaStream | null
  error: string | null
}

function syncConfigToExtension(config: TunerConfig) {
  window.postMessage({ type: "syncConfig", config }, window.location.origin)
}

function useConfigSetter<K extends keyof TunerConfig>(
  key: K,
  updateConfig: (update: Partial<TunerConfig>) => void
) {
  return useCallback(
    (value: TunerConfig[K]) => {
      updateConfig({ [key]: value } as Partial<TunerConfig>)
    },
    [key, updateConfig]
  )
}

export function useTuner(
  inputStream: MediaStream | null,
  initialConfig: Partial<TunerConfig> = {},
  { syncExtension = true }: { syncExtension?: boolean } = {}
): UseTunerReturn {
  const mergedConfig = { ...DEFAULT_TUNER_CONFIG, ...initialConfig }
  const [config, setConfig] = useState<TunerConfig>(mergedConfig)
  const configRef = useRef<TunerConfig>(mergedConfig)
  const debouncedSync = useDebouncedCallback(
    syncConfigToExtension,
    SYNC_DEBOUNCE_MS
  )

  const { outputStream, error, modifierRef } = useStreamModifier(
    inputStream,
    configRef
  )

  useCenterStage(modifierRef, outputStream, {
    centerStageEnabled: config.centerStageEnabled === true,
    zoomMode: config.zoomMode ?? "fixed",
    autoZoomMin: config.autoZoomMin ?? 1.0,
    autoZoomMax: config.autoZoomMax ?? 2.5,
  })

  useBackgroundFilter(modifierRef, outputStream, {
    mode: config.backgroundMode ?? "none",
    blurAmount: config.blurStrength ?? 14,
    imageId: config.backgroundImage ?? null,
    resolveUploadedImage: syncExtension ? fetchBgImage : undefined,
  })

  const updateConfig = useCallback(
    (update: Partial<TunerConfig>) => {
      const next = { ...configRef.current, ...update }
      configRef.current = next
      setConfig(next)
      if (syncExtension) debouncedSync(next)

      for (const manifest of PLUGIN_REGISTRY) {
        const affected = Object.keys(update).some((k) =>
          manifest.configFields.includes(k)
        )
        if (!affected) continue
        modifierRef.current?.updatePluginConfig(
          manifest.id,
          manifest.configMapper(next)
        )
      }
    },
    [debouncedSync, modifierRef, syncExtension]
  )

  useEffect(() => {
    if (!syncExtension) return
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "camtuner:config-update") return
      const newConfig: TunerConfig = event.data.config
      if (!newConfig) return
      configRef.current = newConfig
      setConfig(newConfig)
      for (const manifest of PLUGIN_REGISTRY) {
        modifierRef.current?.updatePluginConfig(
          manifest.id,
          manifest.configMapper(newConfig)
        )
      }
    }
    window.addEventListener("message", handleMessage)
    window.dispatchEvent(new CustomEvent("camtuner:request-config"))
    return () => window.removeEventListener("message", handleMessage)
  }, [modifierRef, syncExtension])

  const setAspectRatio = useConfigSetter("aspectRatio", updateConfig)
  const setZoom = useConfigSetter("zoom", updateConfig)
  const setAlign = useConfigSetter("align", updateConfig)
  const setBarColor = useConfigSetter("barColor", updateConfig)
  const setMirror = useConfigSetter("mirror", updateConfig)
  const setCenterStageEnabled = useConfigSetter(
    "centerStageEnabled",
    updateConfig
  )
  const setLetterbox = useConfigSetter("letterbox", updateConfig)
  const setBackgroundMode = useConfigSetter("backgroundMode", updateConfig)
  const setBlurStrength = useConfigSetter("blurStrength", updateConfig)
  const setBackgroundImage = useConfigSetter("backgroundImage", updateConfig)

  const setZoomMode = useCallback(
    (value: ZoomMode) => updateConfig({ zoomMode: value }),
    [updateConfig]
  )

  const setAutoZoomMin = useCallback(
    (value: number) => {
      const max = configRef.current.autoZoomMax ?? 2.5
      updateConfig({ autoZoomMin: Math.min(Math.max(value, 1), max) })
    },
    [updateConfig]
  )

  const setAutoZoomMax = useCallback(
    (value: number) => {
      const min = configRef.current.autoZoomMin ?? 1.0
      updateConfig({ autoZoomMax: Math.max(Math.min(value, 3), min) })
    },
    [updateConfig]
  )

  const resetConfig = useCallback(() => {
    updateConfig(DEFAULT_TUNER_CONFIG)
  }, [updateConfig])

  return {
    config,
    updateConfig,
    setAspectRatio,
    setZoom,
    setAlign,
    setBarColor,
    setMirror,
    setCenterStageEnabled,
    setLetterbox,
    setZoomMode,
    setAutoZoomMin,
    setAutoZoomMax,
    setBackgroundMode,
    setBlurStrength,
    setBackgroundImage,
    resetConfig,
    aspectRatioClass: ASPECT_RATIO_CLASS[config.aspectRatio],
    objectPosition: ALIGN_OBJECT_POSITION[config.align],
    outputStream,
    inputStream,
    error,
  }
}
