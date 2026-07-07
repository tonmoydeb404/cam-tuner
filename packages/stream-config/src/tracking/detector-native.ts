import type { FaceBox, FaceDetector } from "./types"

/** Minimal shape of the native FaceDetector's detected face. */
type DetectedFace = { boundingBox: { x: number; y: number; width: number; height: number } }

/** Constructor shape of the global native FaceDetector. */
type NativeFaceDetectorConstructor = new (
  options?: unknown
) => { detect: (image: CanvasImageSource) => Promise<DetectedFace[]> }

function getNativeConstructor(): NativeFaceDetectorConstructor | null {
  if (typeof globalThis === "undefined") return null
  const ctor = (globalThis as { FaceDetector?: unknown }).FaceDetector
  return typeof ctor === "function"
    ? (ctor as NativeFaceDetectorConstructor)
    : null
}

/**
 * Whether the browser exposes the native Shape Detection FaceDetector API.
 * Available in Chromium-based browsers; absent in Firefox/Safari.
 */
export function isNativeFaceDetectorSupported(): boolean {
  return getNativeConstructor() !== null
}

/**
 * Adapter over the native FaceDetector API. Zero-dependency and fast when
 * available, but limited browser support — used as an optional fast-path
 * (e.g. as a fallback before MediaPipe finishes loading).
 */
export function createNativeFaceDetector(): FaceDetector {
  let detector: { detect: (image: CanvasImageSource) => Promise<DetectedFace[]> } | null =
    null
  let ready = false

  function ensure(): void {
    if (detector) return
    const Ctor = getNativeConstructor()
    if (!Ctor) return
    detector = new Ctor()
    ready = true
  }

  return {
    isReady(): boolean {
      return ready
    },

    async detect(source): Promise<FaceBox[]> {
      ensure()
      if (!detector) return []
      const detected = await detector.detect(source)
      return detected.map((f) => ({
        x: f.boundingBox.x,
        y: f.boundingBox.y,
        width: f.boundingBox.width,
        height: f.boundingBox.height,
      }))
    },

    destroy(): void {
      detector = null
      ready = false
    },
  }
}
