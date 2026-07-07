/**
 * MediaPipe Tasks Vision person segmenter adapter (web-side).
 *
 * Identical to the extension adapter but lives in the web app so it can be
 * code-split by Next.js. Uses CDN-hosted WASM instead of local extension files.
 *
 * Supports both binary (selfie_segmenter: 2 masks) and multiclass
 * (selfie_multiclass_256x256: 6 masks) models. For multiclass, combines
 * all non-background class masks into a single person mask via per-pixel max.
 */
import type { PersonSegmenter } from "@workspace/stream-config"
import {
  ImageSegmenter as MPImageSegmenter,
  FilesetResolver,
} from "@mediapipe/tasks-vision"

type SegmenterHandle = {
  segmentForVideo: (
    source: CanvasImageSource,
    timestamp: number
  ) => {
    confidenceMasks?: Array<{ getAsFloat32Array: () => Float32Array }>
  }
  close: () => void
}

export type MediaPipeSegmenterOptions = {
  filesetUrl: string
  modelAssetPath: string
  delegate?: "CPU" | "GPU"
}

export function createMediaPipeSegmenter(
  options: MediaPipeSegmenterOptions
): PersonSegmenter {
  let segmenter: SegmenterHandle | null = null
  let initPromise: Promise<void> | null = null
  let lastTimestamp = -1

  async function ensureInitialised(): Promise<void> {
    if (segmenter) return
    if (!initPromise) {
      initPromise = (async () => {
        const fileset = await FilesetResolver.forVisionTasks(options.filesetUrl)
        segmenter = (await MPImageSegmenter.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: options.modelAssetPath,
            delegate: options.delegate ?? "CPU",
          },
          runningMode: "VIDEO",
          outputCategoryMask: false,
          outputConfidenceMasks: true,
        })) as unknown as SegmenterHandle
      })().catch((error) => {
        initPromise = null
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
      width: number,
      height: number
    ): Promise<Float32Array | null> {
      await ensureInitialised()
      if (!segmenter) return null

      const now =
        typeof performance !== "undefined" ? performance.now() : Date.now()
      const timestamp = Math.max(now, lastTimestamp + 1)
      lastTimestamp = timestamp

      const result = segmenter.segmentForVideo(source, timestamp)
      const masks = result.confidenceMasks
      if (!masks || masks.length === 0) return null

      const arrays = masks.map((m) => m.getAsFloat32Array())
      const len = arrays[0]?.length ?? 0
      if (len === 0) return null

      // Binary model (background + person): take the person mask directly
      if (arrays.length <= 2) {
        return arrays[arrays.length - 1] ?? null
      }

      // Multiclass model: combine all non-background classes via per-pixel max
      const personMask = new Float32Array(len)
      for (let c = 1; c < arrays.length; c++) {
        const arr = arrays[c]
        if (!arr) continue
        for (let i = 0; i < len; i++) {
          const v = arr[i] ?? 0
          if (v > (personMask[i] ?? 0)) personMask[i] = v
        }
      }
      return personMask
    },

    destroy(): void {
      segmenter?.close()
      segmenter = null
      initPromise = null
    },
  }
}
