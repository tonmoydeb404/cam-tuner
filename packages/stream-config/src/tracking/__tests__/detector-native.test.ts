import { afterEach, describe, expect, it } from "vitest"
import {
  createNativeFaceDetector,
  isNativeFaceDetectorSupported,
} from "../detector-native"

type GlobalWithFaceDetector = { FaceDetector?: unknown }
const globalRef = globalThis as GlobalWithFaceDetector

const stubImage = {} as CanvasImageSource

describe("isNativeFaceDetectorSupported", () => {
  it("returns false when FaceDetector is absent (jsdom)", () => {
    delete globalRef.FaceDetector
    expect(isNativeFaceDetectorSupported()).toBe(false)
  })

  it("returns true when FaceDetector is present", () => {
    const original = globalRef.FaceDetector
    globalRef.FaceDetector = function MockFaceDetector() {}
    try {
      expect(isNativeFaceDetectorSupported()).toBe(true)
    } finally {
      globalRef.FaceDetector = original
    }
  })
})

describe("createNativeFaceDetector", () => {
  afterEach(() => {
    delete globalRef.FaceDetector
  })

  it("is not ready when the API is unavailable", () => {
    delete globalRef.FaceDetector
    const detector = createNativeFaceDetector()
    expect(detector.isReady()).toBe(false)
  })

  it("returns no faces when the API is unavailable", async () => {
    delete globalRef.FaceDetector
    const detector = createNativeFaceDetector()
    await expect(detector.detect(stubImage, 100, 100)).resolves.toEqual([])
  })

  it("detects faces when a mock FaceDetector is installed", async () => {
    const mockDetect = async () => [
      { boundingBox: { x: 5, y: 6, width: 7, height: 8 } },
    ]
    globalRef.FaceDetector = function MockFaceDetector() {
      return { detect: mockDetect }
    }
    const detector = createNativeFaceDetector()
    const faces = await detector.detect(stubImage, 100, 100)
    expect(detector.isReady()).toBe(true)
    expect(faces).toEqual([{ x: 5, y: 6, width: 7, height: 8 }])
  })

  it("destroy resets readiness", async () => {
    globalRef.FaceDetector = function MockFaceDetector() {
      return { detect: async () => [] }
    }
    const detector = createNativeFaceDetector()
    await detector.detect(stubImage, 100, 100)
    expect(detector.isReady()).toBe(true)
    detector.destroy()
    expect(detector.isReady()).toBe(false)
  })
})
