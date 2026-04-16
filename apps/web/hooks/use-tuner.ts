"use client"

import {
  ALIGN_OBJECT_POSITION,
  type AlignPosition,
  ASPECT_RATIO_CLASS,
  type AspectRatio,
  CROP_ZOOM_ALIGN_PLUGIN_ID,
  DEFAULT_TUNER_CONFIG,
  type TunerConfig,
  tunerConfigToCropConfig,
  tunerUpdateToCropUpdate,
} from "@workspace/stream-config"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDebouncedCallback } from "./use-debounced-callback"
import { useStreamModifier } from "./use-stream-modifier"

const SYNC_DEBOUNCE_MS = 300

export interface UseTunerReturn {
  config: TunerConfig
  setAspectRatio: (v: AspectRatio) => void
  setZoom: (v: number) => void
  setAlign: (v: AlignPosition) => void
  setBarColor: (v: string) => void
  setMirror: (v: boolean) => void
  resetConfig: () => void
  aspectRatioClass: string
  objectPosition: string
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
    resetConfig,
    aspectRatioClass: ASPECT_RATIO_CLASS[config.aspectRatio],
    objectPosition: ALIGN_OBJECT_POSITION[config.align],
    outputStream,
    inputStream,
    error,
  }
}
