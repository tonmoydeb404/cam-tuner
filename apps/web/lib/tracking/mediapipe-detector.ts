/**
 * MediaPipe Tasks Vision face detector adapter (web-side).
 *
 * Identical to the extension adapter but lives in the web app so it can be
 * code-split by Next.js. Uses CDN-hosted WASM instead of local extension files.
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
  filesetUrl: string
  modelAssetPath: string
  delegate?: "CPU" | "GPU"
  minDetectionConfidence?: number
  minSuppressionThreshold?: number
}

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
        initPromise = null
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
