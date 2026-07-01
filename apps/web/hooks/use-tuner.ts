"use client"

import {
  ALIGN_OBJECT_POSITION,
  type AlignPosition,
  ASPECT_RATIO_CLASS,
  type AspectRatio,
  CROP_ZOOM_ALIGN_PLUGIN_ID,
  CENTER_STAGE_PLUGIN_ID,
  BACKGROUND_EFFECTS_PLUGIN_ID,
  type BackgroundConfig,
  DEFAULT_BACKGROUND_CONFIG,
  DEFAULT_TUNER_CONFIG,
  type TunerConfig,
  tunerConfigToCropConfig,
  tunerUpdateToCropUpdate,
} from "@workspace/stream-config"
import { type BackgroundPreset } from "@workspace/ui/components/tuner/background-control"
import { useCallback, useEffect, useRef, useState } from "react"
import { useBackgroundEffects } from "./use-background-effects"
import { useBackgroundImages } from "./use-background-images"
import { useCenterStage } from "./use-center-stage"
import type { ZoomMode } from "@workspace/stream-config"
import { useDebouncedCallback } from "./use-debounced-callback"
import { useStreamModifier } from "./use-stream-modifier"

const SYNC_DEBOUNCE_MS = 300

// Bundled background presets. `id` is what the background-effects plugin
// resolves; `thumb` is the web-served URL for the popup/gallery thumbnail.
const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { id: "preset:gradient-blue.svg", label: "Ocean", thumb: "/backgrounds/gradient-blue.svg" },
  { id: "preset:gradient-emerald.svg", label: "Forest", thumb: "/backgrounds/gradient-emerald.svg" },
  { id: "preset:gradient-warm.svg", label: "Sunset", thumb: "/backgrounds/gradient-warm.svg" },
  { id: "preset:solid-charcoal.svg", label: "Charcoal", thumb: "/backgrounds/solid-charcoal.svg" },
  { id: "preset:solid-navy.svg", label: "Navy", thumb: "/backgrounds/solid-navy.svg" },
]

export interface UseTunerReturn {
  config: TunerConfig
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
  setBackground: (partial: Partial<BackgroundConfig>) => void
  resetConfig: () => void
  aspectRatioClass: string
  objectPosition: string
  backgroundPresets: BackgroundPreset[]
  backgroundUploads: { id: string; name: string; thumb: string }[]
  onBackgroundUpload: (file: File) => void
  onRemoveBackgroundUpload: (id: string) => void
  /** The processed/modified output stream with tuner effects applied. */
  outputStream: MediaStream | null
  /** The original raw camera stream before any tuner processing. */
  inputStream: MediaStream | null
  error: string | null
}

function syncConfigToExtension(config: TunerConfig) {
  window.postMessage({ type: "syncConfig", config }, window.location.origin)
}

function useConfigSetter<K extends keyof TunerConfig>(
  key: K,
  setConfig: React.Dispatch<React.SetStateAction<TunerConfig>>,
  syncToExtension: (c: TunerConfig) => void,
  modifierRef: React.RefObject<
    import("@workspace/stream-config").StreamModifier | null
  >
) {
  return useCallback(
    (value: TunerConfig[K]) => {
      const update = { [key]: value } as Partial<TunerConfig>
      setConfig((c) => {
        const next = { ...c, ...update }
        syncToExtension(next)
        return next
      })
      modifierRef.current?.updatePluginConfig(
        CROP_ZOOM_ALIGN_PLUGIN_ID,
        tunerUpdateToCropUpdate(update)
      )
    },
    [key, setConfig, syncToExtension, modifierRef]
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

  const syncToExtension = useCallback(
    (next: TunerConfig) => {
      configRef.current = next
      if (syncExtension) debouncedSync(next)
    },
    [debouncedSync, syncExtension]
  )

  const { outputStream, error, modifierRef } = useStreamModifier(
    inputStream,
    configRef
  )

  const bgImages = useBackgroundImages()

  useCenterStage(
    modifierRef,
    outputStream,
    {
      centerStageEnabled: config.centerStageEnabled === true,
      zoomMode: config.zoomMode ?? "fixed",
      autoZoomMin: config.autoZoomMin ?? 1.0,
      autoZoomMax: config.autoZoomMax ?? 2.5,
    }
  )

  useBackgroundEffects(
    modifierRef,
    outputStream,
    config.background ?? DEFAULT_BACKGROUND_CONFIG,
    bgImages.imagesRef
  )

  // Sync config from extension storage via content script messages
  useEffect(() => {
    if (!syncExtension) return
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "camtuner:config-update") return
      const newConfig: TunerConfig = event.data.config
      if (!newConfig) return
      setConfig(newConfig)
      configRef.current = newConfig
      modifierRef.current?.updatePluginConfig(
        CROP_ZOOM_ALIGN_PLUGIN_ID,
        tunerConfigToCropConfig(newConfig)
      )
      modifierRef.current?.updatePluginConfig(
        BACKGROUND_EFFECTS_PLUGIN_ID,
        newConfig.background ?? DEFAULT_BACKGROUND_CONFIG
      )
    }
    window.addEventListener("message", handleMessage)
    window.dispatchEvent(new CustomEvent("camtuner:request-config"))
    return () => window.removeEventListener("message", handleMessage)
  }, [modifierRef, syncExtension])

  const setAspectRatio = useConfigSetter(
    "aspectRatio",
    setConfig,
    syncToExtension,
    modifierRef
  )
  const setZoom = useConfigSetter(
    "zoom",
    setConfig,
    syncToExtension,
    modifierRef
  )
  const setAlign = useConfigSetter(
    "align",
    setConfig,
    syncToExtension,
    modifierRef
  )
  const setBarColor = useConfigSetter(
    "barColor",
    setConfig,
    syncToExtension,
    modifierRef
  )
  const setMirror = useConfigSetter(
    "mirror",
    setConfig,
    syncToExtension,
    modifierRef
  )
  const setCenterStageEnabled = useConfigSetter(
    "centerStageEnabled",
    setConfig,
    syncToExtension,
    modifierRef
  )
  const setLetterbox = useConfigSetter(
    "letterbox",
    setConfig,
    syncToExtension,
    modifierRef
  )

  // Zoom-mode controls drive the Center Stage controller (auto-zoom channel),
  // not the crop-zoom-align plugin, so they need a dedicated setter that pushes
  // to CENTER_STAGE_PLUGIN_ID.
  const setZoomMode = useCallback(
    (value: ZoomMode) => {
      setConfig((c) => {
        const next = { ...c, zoomMode: value }
        syncToExtension(next)
        return next
      })
      modifierRef.current?.updatePluginConfig(CENTER_STAGE_PLUGIN_ID, {
        zoomMode: value,
      })
    },
    [setConfig, syncToExtension, modifierRef]
  )

  const setAutoZoomMin = useCallback(
    (value: number) => {
      const max = configRef.current.autoZoomMax ?? 2.5
      // Keep min within bounds and never above the current max.
      const clamped = Math.min(Math.max(value, 1), max)
      setConfig((c) => {
        const next = { ...c, autoZoomMin: clamped }
        syncToExtension(next)
        return next
      })
      modifierRef.current?.updatePluginConfig<{ minZoom: number }>(
        CENTER_STAGE_PLUGIN_ID,
        { minZoom: clamped }
      )
    },
    [setConfig, syncToExtension, modifierRef]
  )

  const setAutoZoomMax = useCallback(
    (value: number) => {
      const min = configRef.current.autoZoomMin ?? 1.0
      // Keep max within bounds and never below the current min.
      const clamped = Math.max(Math.min(value, 3), min)
      setConfig((c) => {
        const next = { ...c, autoZoomMax: clamped }
        syncToExtension(next)
        return next
      })
      modifierRef.current?.updatePluginConfig<{ maxZoom: number }>(
        CENTER_STAGE_PLUGIN_ID,
        { maxZoom: clamped }
      )
    },
    [setConfig, syncToExtension, modifierRef]
  )

  const setBackground = useCallback(
    (partial: Partial<BackgroundConfig>) => {
      const merged = {
        ...(configRef.current.background ?? DEFAULT_BACKGROUND_CONFIG),
        ...partial,
      }
      setConfig((c) => {
        const next = { ...c, background: merged }
        syncToExtension(next)
        return next
      })
      modifierRef.current?.updatePluginConfig(
        BACKGROUND_EFFECTS_PLUGIN_ID,
        merged
      )
    },
    [syncToExtension, modifierRef]
  )

  const handleBackgroundUpload = useCallback(
    async (file: File) => {
      const dataUrl = await readFileAsDataUrl(file)
      const id = await bgImages.addImage(file.name, dataUrl)
      setBackground({ mode: "image", imageId: id })
    },
    [bgImages, setBackground]
  )

  const handleRemoveBackgroundUpload = useCallback(
    async (id: string) => {
      await bgImages.removeImage(id)
      if (configRef.current.background?.imageId === id) {
        setBackground({ imageId: null })
      }
    },
    [bgImages, setBackground]
  )

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_TUNER_CONFIG)
    syncToExtension(DEFAULT_TUNER_CONFIG)
    modifierRef.current?.updatePluginConfig(
      CROP_ZOOM_ALIGN_PLUGIN_ID,
      tunerConfigToCropConfig(DEFAULT_TUNER_CONFIG)
    )
  }, [syncToExtension, modifierRef])

  return {
    config,
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
    setBackground,
    resetConfig,
    aspectRatioClass: ASPECT_RATIO_CLASS[config.aspectRatio],
    objectPosition: ALIGN_OBJECT_POSITION[config.align],
    backgroundPresets: BACKGROUND_PRESETS,
    backgroundUploads: bgImages.images.map((img) => ({
      id: img.id,
      name: img.name,
      thumb: img.dataUrl,
    })),
    onBackgroundUpload: handleBackgroundUpload,
    onRemoveBackgroundUpload: handleRemoveBackgroundUpload,
    outputStream,
    inputStream,
    error,
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
