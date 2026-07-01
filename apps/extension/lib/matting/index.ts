/**
 * Matting backend resolver — the single entry point bundled into
 * `public/matting-adapter.js` and loaded on demand by the MAIN-world injector
 * when a background effect is enabled.
 *
 * Selects the backend per the user's quality setting:
 *  - "high"        → RVM (macOS-grade), falling back to MediaPipe on failure.
 *  - "performance" → MediaPipe binary (always smooth).
 *  - "auto"        → RVM if WebGPU is available, else MediaPipe.
 *
 * Exports `createMatteProvider`, which returns a ready MatteProvider and the
 * name of the backend that was actually selected (for diagnostics).
 */
import type {
  BackgroundQuality,
  MatteProvider,
} from "@workspace/stream-config"
import { createMediaPipeMatteProvider } from "./mediapipe-matte"
import { createRvmMatteProvider } from "./rvm-matte"

export type MatteBackend = "rvm" | "mediapipe"

export type CreateMatteProviderOptions = {
  quality: BackgroundQuality
  /** MediaPipe WASM directory URL (local, web_accessible_resource). */
  filesetUrl: string
  /** selfie_segmenter.tflite URL (Google CDN, open CORS). */
  selfieModelUrl: string
  /** RVM ONNX model URL (optional; if absent, RVM is never used). */
  rvmModelUrl?: string
  /** ONNX Runtime WASM path/prefix (local). */
  ortWasmPaths?: string | Record<string, string>
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
    options.rvmModelUrl &&
    (options.quality === "high" ||
      (options.quality === "auto" && (await isWebGpuAvailable())))

  if (wantRvm && options.rvmModelUrl) {
    try {
      const provider = await createRvmMatteProvider({
        modelUrl: options.rvmModelUrl,
        wasmPaths: options.ortWasmPaths,
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
    filesetUrl: options.filesetUrl,
    modelAssetPath: options.selfieModelUrl,
  })
  return { provider, backend: "mediapipe" }
}
