/**
 * Matting backend resolver for the web preview page.
 *
 * Selects the backend per the user's quality setting:
 *  - "high"        → RVM (macOS-grade), falling back to MediaPipe on failure.
 *  - "performance" → MediaPipe binary (always smooth).
 *  - "auto"        → RVM if WebGPU is available, else MediaPipe.
 *
 * Dynamically imported by `use-background-effects` so Next.js code-splits the
 * heavy ONNX + MediaPipe runtimes into a chunk fetched only when needed.
 */
import type {
  BackgroundQuality,
  MatteProvider,
} from "@workspace/stream-config"
import { createMediaPipeMatteProvider } from "./mediapipe-matte"
import { createRvmMatteProvider } from "./rvm-matte"

export type MatteBackend = "rvm" | "mediapipe"

// CDN-hosted WASM runtimes — no local copies needed for the web app.
const MP_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
const SELFIE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite"
const RVM_MODEL_URL =
  "https://huggingface.co/PengAB/robust-video-matting/resolve/main/rvm_mobilenetv3_fp32.onnx"
const ORT_WASM_CDN =
  "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/"

export type CreateMatteProviderOptions = {
  quality: BackgroundQuality
}

async function isWebGpuAvailable(): Promise<boolean> {
  try {
    const gpu = (navigator as unknown as { gpu?: unknown }).gpu
    if (!gpu) return false
    const adapter = await (
      navigator as unknown as {
        gpu?: { requestAdapter: () => Promise<unknown> }
      }
    ).gpu?.requestAdapter()
    return !!adapter
  } catch {
    return false
  }
}

export async function createMatteProvider(
  options: CreateMatteProviderOptions
): Promise<{ provider: MatteProvider; backend: MatteBackend }> {
  const wantRvm =
    options.quality === "high" ||
    (options.quality === "auto" && (await isWebGpuAvailable()))

  if (wantRvm) {
    try {
      const provider = await createRvmMatteProvider({
        modelUrl: RVM_MODEL_URL,
        wasmPaths: ORT_WASM_CDN,
      })
      return { provider, backend: "rvm" }
    } catch (error) {
      // RVM unavailable (no WebGPU, model fetch failed, tensor mismatch) —
      // degrade to MediaPipe so the feature still works.
      console.warn(
        "[CamTuner] RVM matte unavailable, falling back to MediaPipe:",
        error
      )
    }
  }

  const provider = createMediaPipeMatteProvider({
    filesetUrl: MP_WASM_URL,
    modelAssetPath: SELFIE_MODEL_URL,
  })
  return { provider, backend: "mediapipe" }
}
