/**
 * Robust Video Matting (RVM) segmenter — ONNX Runtime Web / WebGL backend.
 *
 * Produces a high-quality alpha matte comparable to Apple's Center Stage /
 * macOS Portrait Mode by running the RVM MobileNetV3 ONNX model in-browser
 * via ORT WebGL (GPU, no SharedArrayBuffer required).
 *
 * Key quality advantages over MediaPipe selfie segmenter:
 * - Recurrent hidden states carry temporal context frame-to-frame natively,
 *   eliminating flickering without a post-process EMA pass.
 * - True alpha matting: soft, continuous per-pixel transparency (not a
 *   hard segmentation mask), preserving fine hair and translucent edges.
 *
 * Processing pipeline per frame:
 * 1. Downscale source to at most PROC_SIZE px (keeping aspect ratio, aligned
 *    to 16 px so recurrent state dims are integer).
 * 2. Unpack RGBA→normalised RGB CHW float32 tensor.
 * 3. Run RVM inference; recurrent states (r1–r4) are fed in from the
 *    previous frame and updated on every call.
 * 4. Bilinear-upsample the low-res alpha back to source resolution via
 *    canvas drawImage (GPU path in all major browsers).
 */
import type { PersonSegmenter } from "@workspace/stream-config"
import * as ort from "onnxruntime-web/webgl"

export type RVMSegmenterOptions = {
  /** URL of the rvm_mobilenetv3_fp32.onnx model file. */
  modelUrl: string
}

/** Maximum side length of the internal processing canvas (px). */
const PROC_SIZE = 256

function alignTo16(n: number): number {
  return Math.max(16, Math.round(n / 16) * 16)
}

/**
 * Returns (procW, procH) with the same aspect ratio as (srcW × srcH),
 * capped so max(procW, procH) ≤ PROC_SIZE, both sides aligned to 16 px.
 */
function computeProcSize(srcW: number, srcH: number): [number, number] {
  const scale = PROC_SIZE / Math.max(srcW, srcH)
  return [alignTo16(srcW * scale), alignTo16(srcH * scale)]
}

export function createRVMSegmenter(
  options: RVMSegmenterOptions
): PersonSegmenter {
  let session: ort.InferenceSession | null = null
  let initPromise: Promise<void> | null = null

  // Recurrent hidden states — null until first frame
  let r1: ort.Tensor | null = null
  let r2: ort.Tensor | null = null
  let r3: ort.Tensor | null = null
  let r4: ort.Tensor | null = null
  let lastProcW = 0
  let lastProcH = 0

  // Reused canvases to avoid per-frame allocations
  let procCanvas: HTMLCanvasElement | null = null
  let procCtx: CanvasRenderingContext2D | null = null
  let alphaCanvas: HTMLCanvasElement | null = null
  let alphaCtx: CanvasRenderingContext2D | null = null
  let upCanvas: HTMLCanvasElement | null = null
  let upCtx: CanvasRenderingContext2D | null = null

  function ensureInit(): Promise<void> {
    if (!initPromise) {
      initPromise = ort.InferenceSession.create(options.modelUrl, {
        executionProviders: ["webgl"],
        graphOptimizationLevel: "all",
      })
        .then((s) => {
          session = s
        })
        .catch((err) => {
          initPromise = null
          throw err
        })
    }
    return initPromise
  }

  /** Initialise zero recurrent states for a new processing resolution. */
  function resetStates(pw: number, ph: number): void {
    const z = (n: number) => new Float32Array(n)
    r1 = new ort.Tensor("float32", z(16 * (ph / 2) * (pw / 2)), [
      1,
      16,
      ph / 2,
      pw / 2,
    ])
    r2 = new ort.Tensor("float32", z(20 * (ph / 4) * (pw / 4)), [
      1,
      20,
      ph / 4,
      pw / 4,
    ])
    r3 = new ort.Tensor("float32", z(40 * (ph / 8) * (pw / 8)), [
      1,
      40,
      ph / 8,
      pw / 8,
    ])
    r4 = new ort.Tensor("float32", z(64 * (ph / 16) * (pw / 16)), [
      1,
      64,
      ph / 16,
      pw / 16,
    ])
    lastProcW = pw
    lastProcH = ph
  }

  function ensureProcCanvas(pw: number, ph: number): CanvasRenderingContext2D {
    if (!procCanvas || procCanvas.width !== pw || procCanvas.height !== ph) {
      procCanvas = procCanvas ?? document.createElement("canvas")
      procCanvas.width = pw
      procCanvas.height = ph
      procCtx = procCanvas.getContext("2d", {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D
    }
    return procCtx!
  }

  function ensureAlphaCanvas(pw: number, ph: number): CanvasRenderingContext2D {
    if (!alphaCanvas || alphaCanvas.width !== pw || alphaCanvas.height !== ph) {
      alphaCanvas = alphaCanvas ?? document.createElement("canvas")
      alphaCanvas.width = pw
      alphaCanvas.height = ph
      alphaCtx = alphaCanvas.getContext("2d") as CanvasRenderingContext2D
    }
    return alphaCtx!
  }

  function ensureUpCanvas(dw: number, dh: number): CanvasRenderingContext2D {
    if (!upCanvas || upCanvas.width !== dw || upCanvas.height !== dh) {
      upCanvas = upCanvas ?? document.createElement("canvas")
      upCanvas.width = dw
      upCanvas.height = dh
      upCtx = upCanvas.getContext("2d", {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D
    }
    return upCtx!
  }

  /**
   * Bilinear-upsample the RVM alpha (pw×ph Float32Array, values 0–1) to the
   * full source resolution (dw×dh) using canvas drawImage — GPU-accelerated
   * in all major browsers and avoids a CPU interpolation loop.
   */
  function upsampleAlpha(
    phaData: Float32Array,
    pw: number,
    ph: number,
    dw: number,
    dh: number
  ): Float32Array {
    const aCtx = ensureAlphaCanvas(pw, ph)
    const img = aCtx.createImageData(pw, ph)
    const d = img.data
    for (let i = 0; i < phaData.length; i++) {
      const a = Math.round((phaData[i] ?? 0) * 255)
      const o = i * 4
      d[o] = 255
      d[o + 1] = 255
      d[o + 2] = 255
      d[o + 3] = a
    }
    aCtx.putImageData(img, 0, 0)

    const uCtx = ensureUpCanvas(dw, dh)
    uCtx.imageSmoothingEnabled = true
    uCtx.imageSmoothingQuality = "high"
    uCtx.drawImage(alphaCanvas!, 0, 0, dw, dh)

    const raw = uCtx.getImageData(0, 0, dw, dh).data
    const result = new Float32Array(dw * dh)
    for (let i = 0; i < result.length; i++) {
      result[i] = (raw[i * 4 + 3] ?? 0) / 255
    }
    return result
  }

  return {
    isReady(): boolean {
      return session !== null
    },

    async segment(
      source: CanvasImageSource,
      width: number,
      height: number
    ): Promise<Float32Array | null> {
      await ensureInit()
      if (!session) return null

      const [pw, ph] = computeProcSize(width, height)

      // Reset recurrent states whenever the processing resolution changes
      if (pw !== lastProcW || ph !== lastProcH) {
        resetStates(pw, ph)
      }

      // --- Step 1: downscale source frame ---
      const pCtx = ensureProcCanvas(pw, ph)
      pCtx.drawImage(source, 0, 0, pw, ph)
      const { data: rgba } = pCtx.getImageData(0, 0, pw, ph)

      // --- Step 2: RGBA HWC → normalised RGB CHW tensor ---
      const n = pw * ph
      const srcData = new Float32Array(3 * n)
      for (let i = 0; i < n; i++) {
        srcData[i] = rgba[i * 4]! / 255 // R plane
        srcData[n + i] = rgba[i * 4 + 1]! / 255 // G plane
        srcData[2 * n + i] = rgba[i * 4 + 2]! / 255 // B plane
      }

      // --- Step 3: run RVM inference ---
      const feeds: Record<string, ort.Tensor> = {
        src: new ort.Tensor("float32", srcData, [1, 3, ph, pw]),
        r1i: r1!,
        r2i: r2!,
        r3i: r3!,
        r4i: r4!,
      }

      const out = await session.run(feeds)

      // Carry recurrent states to the next frame for temporal consistency
      r1 = out["r1o"]!
      r2 = out["r2o"]!
      r3 = out["r3o"]!
      r4 = out["r4o"]!

      const phaData = out["pha"]!.data as Float32Array

      // --- Step 4: upsample alpha to source resolution ---
      return upsampleAlpha(phaData, pw, ph, width, height)
    },

    destroy(): void {
      void (
        session as ort.InferenceSession & { release?: () => void }
      ).release?.()
      session = null
      initPromise = null
      r1 = r2 = r3 = r4 = null
      procCanvas = null
      procCtx = null
      alphaCanvas = null
      alphaCtx = null
      upCanvas = null
      upCtx = null
    },
  }
}
