import {
  createCropZoomAlignPlugin,
  createStreamModifier,
  CROP_ZOOM_ALIGN_PLUGIN_ID,
  tunerConfigToCropConfig,
  type StreamModifier,
  type TunerConfig,
} from "@workspace/stream-config"
import { useEffect, useRef, useState } from "react"

/**
 * Manages a StreamModifier lifecycle bound to an input MediaStream.
 * Returns the output stream and any error that occurred.
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
      const modifier = createStreamModifier(inputStream, true)
      modifier.addPlugin(
        createCropZoomAlignPlugin(),
        tunerConfigToCropConfig(configRef.current)
      )
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
