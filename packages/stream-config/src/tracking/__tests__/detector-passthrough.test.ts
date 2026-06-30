import { describe, expect, it } from "vitest"
import { createPassthroughDetector } from "../detector-passthrough"
import type { FaceBox } from "../types"

const stubImage = {} as CanvasImageSource

describe("createPassthroughDetector", () => {
  it("is ready immediately", () => {
    const detector = createPassthroughDetector(() => [])
    expect(detector.isReady()).toBe(true)
  })

  it("returns the faces provided by the source", async () => {
    const faces: FaceBox[] = [{ x: 10, y: 10, width: 20, height: 20 }]
    const detector = createPassthroughDetector(() => faces)
    await expect(detector.detect(stubImage, 100, 100)).resolves.toEqual(faces)
  })

  it("reflects changes in the source over time", async () => {
    let current: FaceBox[] = []
    const detector = createPassthroughDetector(() => current)
    expect(await detector.detect(stubImage, 100, 100)).toEqual([])
    current = [{ x: 1, y: 2, width: 3, height: 4 }]
    expect(await detector.detect(stubImage, 100, 100)).toEqual(current)
  })

  it("destroy is a safe no-op", () => {
    const detector = createPassthroughDetector(() => [])
    expect(() => detector.destroy()).not.toThrow()
  })
})
