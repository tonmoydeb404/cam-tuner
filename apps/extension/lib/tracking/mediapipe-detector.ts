/**
 * MediaPipe Tasks Vision face detector adapter (extension-side).
 *
 * Lives in the extension (not stream-config) so that it — and the heavy
 * `@mediapipe/tasks-vision` runtime — can be code-split into a separate chunk
 * that the MAIN-world content script loads ON DEMAND only when Center Stage is
 * enabled. This keeps the per-page content script lightweight.
 */
import {
  type FaceDetector,
  toFaceBoxes,
} from "@workspace/stream-config"
import { FaceDetector as MPFaceDetector, FilesetResolver } from "@mediapipe/tasks-vision"

type DetectorHandle = {
  detectForVideo: (
    source: CanvasImageSource,
    timestamp: number
  ) => { detections: Parameters<typeof toFaceBoxes>[0] }
  close: () => void
}

export type MediaPipeDetectorOptions = {
  /** URL to the directory holding the MediaPipe WASM files (local for MV3). */
  filesetUrl: string
  /** URL to the BlazeFace `.tflite` model file. */
  modelAssetPath: string
  delegate?: "CPU" | "GPU"
  minDetectionConfidence?: number
  minSuppressionThreshold?: number
}

/**
 * Creates a FaceDetector backed by MediaPipe Tasks Vision.
 *
 * `detectForVideo` is synchronous in MediaPipe; we wrap it in a Promise to
 * satisfy the async FaceDetector contract. The timestamp passed to MediaPipe
 * must be strictly increasing across calls.
 */
export function createMediaPipeFaceDetector(
  options: MediaPipeDetectorOptions
): FaceDetector {
  let detector: DetectorHandle | null = null
  let initPromise: Promise<void> | null = null
  let lastTimestamp = -1

  async function ensureInitialised(): Promise<void> {
    if (detector) return
    if (!initPromise) {
      initPromise = (async () => {
        const fileset = await FilesetResolver.forVisionTasks(options.filesetUrl)
        detector = (await MPFaceDetector.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: options.modelAssetPath,
            delegate: options.delegate ?? "CPU",
          },
          runningMode: "VIDEO",
          minDetectionConfidence: options.minDetectionConfidence ?? 0.5,
          minSuppressionThreshold: options.minSuppressionThreshold ?? 0.3,
        })) as unknown as DetectorHandle
      })().catch((error) => {
        initPromise = null // allow a retry rather than caching the failure
        throw error
      })
    }
    return initPromise
  }

  return {
    isReady(): boolean {
      return detector !== null
    },

    async detect(
      source: CanvasImageSource,
      _width: number,
      _height: number
    ) {
      await ensureInitialised()
      if (!detector) return []

      const now =
        typeof performance !== "undefined" ? performance.now() : Date.now()
      const timestamp = Math.max(now, lastTimestamp + 1)
      lastTimestamp = timestamp

      const result = detector.detectForVideo(source, timestamp)
      return toFaceBoxes(result.detections)
    },

    destroy(): void {
      detector?.close()
      detector = null
      initPromise = null
    },
  }
}
