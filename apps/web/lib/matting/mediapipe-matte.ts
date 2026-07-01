/**
 * MediaPipe Tasks Vision person-segmentation adapter (web preview).
 *
 * The "performance" matting backend: MediaPipe's `selfie_segmenter` produces a
 * binary person/background category mask. It reuses the same lazy-loaded
 * `@mediapipe/tasks-vision` runtime that Center Stage already ships in the web
 * app, so there is no new dependency for this path.
 *
 * Dynamically imported by `use-background-effects` so Next.js code-splits the
 * heavy MediaPipe runtime into a chunk fetched only when a background effect is
 * enabled.
 */
import { type MatteProvider } from "@workspace/stream-config"
import type { Matte } from "@workspace/stream-config"
import {
  FilesetResolver,
  ImageSegmenter,
} from "@mediapipe/tasks-vision"

type SegmenterHandle = {
  segmentForVideo: (
    source: CanvasImageSource,
    timestamp: number
  ) => { categoryMask?: { getAsUint8Array(): Uint8Array; width: number; height: number } }
  getLabels: () => string[]
  close: () => void
}

export type MediaPipeMatteOptions = {
  /** URL to the directory holding the MediaPipe WASM files (CDN). */
  filesetUrl: string
  /** URL to the selfie_segmenter `.tflite` model file. */
  modelAssetPath: string
  /** "GPU" (default, faster) or "CPU". */
  delegate?: "CPU" | "GPU"
}

/**
 * Creates a MatteProvider backed by MediaPipe selfie segmentation.
 *
 * `segmentForVideo` is synchronous in MediaPipe; we wrap it in a Promise to
 * satisfy the async MatteProvider contract. The timestamp passed to MediaPipe
 * must be strictly increasing across calls.
 *
 * The mask is binary (person category → alpha 1, else 0); soft edges are
 * produced downstream by the background-effects plugin's mask feathering.
 */
export function createMediaPipeMatteProvider(
  options: MediaPipeMatteOptions
): MatteProvider {
  let segmenter: SegmenterHandle | null = null
  let initPromise: Promise<void> | null = null
  let lastTimestamp = -1
  let personCategoryIndex = 1 // selfie_segmenter: 0 = background, 1 = person

  async function ensureInitialised(): Promise<void> {
    if (segmenter) return
    if (!initPromise) {
      initPromise = (async () => {
        const fileset = await FilesetResolver.forVisionTasks(options.filesetUrl)
        const seg = (await ImageSegmenter.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: options.modelAssetPath,
            // CPU (XNNPACK) is required: the GPU delegate's WebGL texture
            // readback returns an all-zero category mask on some setups, which
            // would make background effects blur the whole frame. CPU matches
            // the face-detector adapter and is correct everywhere.
            delegate: options.delegate ?? "CPU",
          },
          runningMode: "VIDEO",
          outputCategoryMask: true,
          outputConfidenceMasks: false,
        })) as unknown as SegmenterHandle
        segmenter = seg
        // Resolve which category index means "person" from the model labels.
        const labels = seg.getLabels() ?? []
        const idx = labels.findIndex((l) => /person|human|foreground/i.test(l))
        if (idx >= 0) personCategoryIndex = idx
      })().catch((error) => {
        initPromise = null // allow a retry rather than caching the failure
        throw error
      })
    }
    return initPromise
  }

  return {
    isReady(): boolean {
      return segmenter !== null
    },

    async segment(
      source: CanvasImageSource,
      _width: number,
      _height: number
    ): Promise<Matte> {
      await ensureInitialised()
      if (!segmenter) {
        return { width: 1, height: 1, data: new Float32Array([1]) }
      }

      const now =
        typeof performance !== "undefined" ? performance.now() : Date.now()
      const timestamp = Math.max(now, lastTimestamp + 1)
      lastTimestamp = timestamp

      const result = segmenter.segmentForVideo(source, timestamp)
      const mask = result.categoryMask
      if (!mask) {
        return { width: 1, height: 1, data: new Float32Array([1]) }
      }

      const u8 = mask.getAsUint8Array()
      const data = new Float32Array(u8.length)
      for (let i = 0; i < u8.length; i++) {
        data[i] = (u8[i] ?? 0) === personCategoryIndex ? 1 : 0
      }
      return { width: mask.width, height: mask.height, data }
    },

    destroy(): void {
      segmenter?.close()
      segmenter = null
      initPromise = null
    },
  }
}
