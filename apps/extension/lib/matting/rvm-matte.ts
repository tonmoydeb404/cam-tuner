/**
 * Robust Video Matting (RVM) adapter — the "high quality" backend.
 *
 * Produces a true soft alpha matte (0..1 per pixel) with temporal recurrence,
 * giving the macOS/Zoom-grade soft-hair, no-flicker look that binary category
 * masks cannot. Runs on ONNX Runtime Web, preferring the WebGPU execution
 * provider (real-time on modern GPUs) with a WASM fallback.
 *
 * IMPORTANT: this module is loaded only when a background effect is enabled AND
 * a capable backend is selected. If ANYTHING goes wrong (model fetch fails,
 * WebGPU unavailable, tensor mismatch across ONNX/RVM export variants) it
 * THROWS, and the resolver falls back to the MediaPipe binary backend — so the
 * feature keeps working at a lower quality tier. The exact RVM tensor contract
 * can vary by export; this follows the standard rvm_mobilenetv3 contract.
 */
import type { Matte, MatteProvider } from "@workspace/stream-config"
import * as ort from "onnxruntime-web/webgpu"

export type RvmMatteOptions = {
  /** URL to the RVM `.onnx` model (float32 mobile_net_v3 recommended). */
  modelUrl: string
  /** URLs/prefix for the ONNX Runtime WASM files (local for MV3). */
  wasmPaths?:
    | string
    | Record<string, string>
}

/**
 * RVM recurrent-context state, carried across frames for temporal coherence.
 */
type RvmState = {
  r1: ort.Tensor
  r2: ort.Tensor
  r3: ort.Tensor
  r4: ort.Tensor
  r5: ort.Tensor
  r6: ort.Tensor
}

// Recurrent state channel counts for rvm_mobilenetv3.
const STATE_CHANNELS = [16, 20, 40, 64, 80, 128]

/** Processing resolution divisor per state (state i runs at src / 2^(i+1)). */
type RvmStateDims = { channels: number; h: number; w: number }

/** Per-recurrent-state shape for rvm_mobilenetv3 (state i runs at src / 2^(i+1)). */
function stateDims(srcH: number, srcW: number): RvmStateDims[] {
  return STATE_CHANNELS.map((channels, i) => {
    const div = 2 ** (i + 1)
    return {
      channels,
      h: Math.max(1, Math.floor(srcH / div)),
      w: Math.max(1, Math.floor(srcW / div)),
    }
  })
}

function zeroState(channels: number, h: number, w: number): ort.Tensor {
  return new ort.Tensor(
    "float32",
    new Float32Array(channels * h * w),
    [1, channels, h, w]
  )
}

/**
 * Rounds dims up to a multiple of `m` so RVM's downsampling stays integral.
 */
function roundUp(value: number, m: number): number {
  return Math.max(m, Math.ceil(value / m) * m)
}

export async function createRvmMatteProvider(
  options: RvmMatteOptions
): Promise<MatteProvider> {
  if (options.wasmPaths) {
    ort.env.wasm.wasmPaths = options.wasmPaths
  }

  // Eagerly create the session so failures surface here (resolver falls back).
  const session = await ort.InferenceSession.create(options.modelUrl, {
    executionProviders: ["webgpu", "wasm"],
    graphOptimizationLevel: "all",
  })

  // A scratch canvas used to read video frames into RGBA pixels.
  let canvas: HTMLCanvasElement | null = null
  let ctx: CanvasRenderingContext2D | null = null

  // Recurrent state (re)initialized whenever the processing size changes.
  let state: RvmState | null = null
  let procW = 0
  let procH = 0
  let downsampleRatio: ort.Tensor
  const DSR = 0.25 // process internally at 1/4 for speed; alpha returns at procW×procH
  downsampleRatio = new ort.Tensor("float32", [DSR], [1])

  let lastAlpha = new Float32Array([1])

  function ensureCanvas(w: number, h: number): void {
    if (!canvas) {
      canvas = document.createElement("canvas")
      ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) throw new Error("Could not get 2D context for RVM")
    }
    if (procW !== w || procH !== h) {
      procW = w
      procH = h
      canvas.width = w
      canvas.height = h
      // Reset recurrent context when the resolution changes.
      const dims = stateDims(h, w)
      const states = dims.map((d) => zeroState(d.channels, d.h, d.w))
      state = {
        r1: states[0]!,
        r2: states[1]!,
        r3: states[2]!,
        r4: states[3]!,
        r5: states[4]!,
        r6: states[5]!,
      }
      lastAlpha = new Float32Array(w * h).fill(1)
    }
  }

  return {
    isReady(): boolean {
      return session !== null && state !== null
    },

    async segment(
      source: CanvasImageSource,
      width: number,
      height: number
    ): Promise<Matte> {
      // Pick a processing resolution: keep aspect, cap longest side, align to 64
      // so every state divisor lands on whole pixels.
      const maxSide = 512
      const scale = Math.min(1, maxSide / Math.max(width, height))
      const w = roundUp(Math.round(width * scale), 64)
      const h = roundUp(Math.round(height * scale), 64)

      ensureCanvas(w, h)
      ctx!.clearRect(0, 0, w, h)
      ctx!.drawImage(source, 0, 0, w, h)
      const pixels = ctx!.getImageData(0, 0, w, h).data

      // Build the [1,4,h,w] RGBA source tensor, normalized to 0..1. The alpha
      // channel is seeded with the previous frame's matte (RVM uses it for
      // temporal compositing); first frame defaults to fully opaque.
      const srcData = new Float32Array(4 * h * w)
      for (let i = 0; i < w * h; i++) {
        const s = i * 4
        const d = i * 4
        srcData[d] = (pixels[s] ?? 0) / 255
        srcData[d + 1] = (pixels[s + 1] ?? 0) / 255
        srcData[d + 2] = (pixels[s + 2] ?? 0) / 255
        srcData[d + 3] = lastAlpha[i] ?? 1
      }
      const srcTensor = new ort.Tensor("float32", srcData, [1, 4, h, w])

      const feeds: Record<string, ort.Tensor> = {
        src: srcTensor,
        r1i: state!.r1,
        r2i: state!.r2,
        r3i: state!.r3,
        r4i: state!.r4,
        r5i: state!.r5,
        r6i: state!.r6,
        downsample_ratio: downsampleRatio,
      }

      const out = await session.run(feeds)
      const pha = out["pha"]
      if (!pha || !(pha.data instanceof Float32Array)) {
        return { width: w, height: h, data: lastAlpha }
      }

      // Cache alpha for next frame's A channel, and update recurrent state.
      // Copy into a fresh ArrayBuffer-backed array to satisfy the Matte type
      // (ONNX may return a SharedArrayBuffer-backed Float32Array).
      const alpha = new Float32Array(pha.data as Float32Array)
      lastAlpha = alpha
      const next = (name: string, prev: ort.Tensor): ort.Tensor =>
        out[name] instanceof ort.Tensor ? (out[name] as ort.Tensor) : prev
      state!.r1 = next("r1o", state!.r1)
      state!.r2 = next("r2o", state!.r2)
      state!.r3 = next("r3o", state!.r3)
      state!.r4 = next("r4o", state!.r4)
      state!.r5 = next("r5o", state!.r5)
      state!.r6 = next("r6o", state!.r6)

      return { width: w, height: h, data: alpha }
    },

    destroy(): void {
      state = null
      canvas = null
      ctx = null
      void session.release()
    },
  }
}
