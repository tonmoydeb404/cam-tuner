import {
  createStreamModifier,
  CROP_PLUGIN_ID,
  PLUGIN_REGISTRY,
  tunerConfigToCropConfig,
  type PluginContext,
  type StreamModifier,
  type TunerConfig,
} from "@workspace/stream-config"
import { useEffect, useRef, useState } from "react"

/**
 * Manages a StreamModifier lifecycle bound to an input MediaStream.
 * Returns the output stream and any error that occurred.
 *
 * Plugins are derived entirely from PLUGIN_REGISTRY (sorted by executionOrder),
 * excluding manifest entries that require an external adapter — those are
 * managed dynamically by their own hooks (e.g. useBackgroundFilter).
 * Removing a manifest from the registry immediately disables that plugin.
 */
export function useStreamModifier(
  inputStream: MediaStream | null,
  configRef: React.RefObject<TunerConfig>
) {
  const [outputStream, setOutputStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const modifierRef = useRef<StreamModifier | null>(null)

  useEffect(() => {
    if (!inputStream) {
      modifierRef.current?.destroy()
      modifierRef.current = null
      setOutputStream(null)
      return
    }
    modifierRef.current?.destroy()
    try {
      const cfg = configRef.current
      const modifier = createStreamModifier(inputStream, true)
      const context: PluginContext = { modifier, wasmUrl: null }

      // Add every registry plugin that doesn't need an external adapter,
      // in ascending executionOrder so controller injections fire before
      // the crop renderer within each frame.
      const sortedManifests = [...PLUGIN_REGISTRY]
        .filter((m) => !m.adapter)
        .sort((a, b) => a.executionOrder - b.executionOrder)

      for (const manifest of sortedManifests) {
        const plugin = manifest.createPlugin(context)
        // Crop receives the full CropConfig so it has correct zoom/align/mirror
        // before the first frame; controllers refine it on every subsequent frame.
        const initialConfig =
          manifest.id === CROP_PLUGIN_ID
            ? tunerConfigToCropConfig(cfg)
            : manifest.configMapper(cfg)
        modifier.addPlugin(plugin, initialConfig)
      }

      modifierRef.current = modifier
      setOutputStream(modifier.outputStream)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create stream modifier"
      )
      setOutputStream(null)
    }
    return () => {
      modifierRef.current?.destroy()
      modifierRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputStream])

  return { outputStream, error, modifierRef }
}
