/**
 * Tests for the Center Stage controller plugin.
 *
 * The plugin has side effects (async detection + pushing alignCenter into
 * CropZoomAlign via the modifier), so we inject a mock modifier that records
 * updatePluginConfig calls and use the deterministic passthrough detector.
 */
import { describe, expect, it } from "vitest"
import {
  CENTER_STAGE_PLUGIN_ID,
  createCenterStagePlugin,
} from "../center-stage"
import { CROP_ZOOM_ALIGN_PLUGIN_ID } from "../crop-zoom-align"
import { createPassthroughDetector } from "../../tracking/detector-passthrough"
import type { FaceBox, FaceDetector } from "../../tracking/types"
import type { AlignCenter } from "../../utils/math"
import type { StreamModifier } from "../../types"

type CropUpdate = { alignCenter?: AlignCenter; zoomOverride?: number }

/** A mock modifier that records every updatePluginConfig call per plugin id. */
function createMockModifier(): {
  modifier: StreamModifier
  updates: Record<string, unknown[]>
} {
  const updates: Record<string, unknown[]> = {}
  const modifier = {
    outputStream: {} as MediaStream,
    updatePluginConfig: (id: string, config: unknown) => {
      if (!updates[id]) updates[id] = []
      updates[id].push(config)
    },
    addPlugin: () => {},
    removePlugin: () => {},
    destroy: () => {},
  } as unknown as StreamModifier
  return { modifier, updates }
}

const lastAlignCenter = (updates: Record<string, unknown[]>): CropUpdate => {
  const list = updates[CROP_ZOOM_ALIGN_PLUGIN_ID]
  if (!list || list.length === 0) return {}
  return list[list.length - 1] as CropUpdate
}

const lastZoomOverride = (
  updates: Record<string, unknown[]>
): number | undefined => lastAlignCenter(updates).zoomOverride

const stubCtx = {} as CanvasRenderingContext2D
const stubVideo = {} as HTMLVideoElement
const FACE: FaceBox = { x: 700, y: 400, width: 200, height: 200 }
// face center = (800, 500) in 1000x1000 → normalized (0.8, 0.5)

/** Flushes pending microtasks so async detection results land. */
const flush = async () => {
  for (let i = 0; i < 5; i++) await Promise.resolve()
}

/**
 * Drives the plugin's drawCanvas for at least `minSeconds` of real wall-clock
 * time (the zoom spring integrates real elapsed time, so we gate on the clock,
 * not frame count, to stay robust against timer granularity). `guard` caps the
 * iteration count to avoid runaway loops.
 */
const runFor = async (
  plugin: ReturnType<typeof createCenterStagePlugin>,
  minSeconds: number
): Promise<void> => {
  const start = Date.now()
  let guard = 0
  while ((Date.now() - start) / 1000 < minSeconds && guard < 500) {
    plugin.drawCanvas?.(stubCtx, stubVideo, 1000, 1000, { enabled: true })
    await new Promise((r) => setTimeout(r, 8))
    await flush()
    guard++
  }
}

describe("center-stage plugin", () => {
  it("has the correct plugin id", () => {
    const { modifier } = createMockModifier()
    const plugin = createCenterStagePlugin(modifier, createPassthroughDetector(() => []))
    expect(plugin.id).toBe(CENTER_STAGE_PLUGIN_ID)
  })

  it("pushes the smoothed center toward a detected face", async () => {
    const { modifier, updates } = createMockModifier()
    const detector = createPassthroughDetector(() => [FACE])
    const plugin = createCenterStagePlugin(modifier, detector, {
      smoothingFactor: 1,
      deadzone: 0,
      detectIntervalMs: 0,
    })

    // Frame 1: kicks detection (async), pushes initial center.
    plugin.drawCanvas?.(stubCtx, stubVideo, 1000, 1000, { enabled: true })
    await flush()
    // Frame 2: detection has resolved → smooth toward (0.8, 0.5).
    plugin.drawCanvas?.(stubCtx, stubVideo, 1000, 1000, { enabled: true })

    expect(lastAlignCenter(updates).alignCenter).toEqual({ x: 0.8, y: 0.5 })
  })

  it("holds position when no face is detected", async () => {
    const { modifier, updates } = createMockModifier()
    const detector = createPassthroughDetector(() => [])
    const plugin = createCenterStagePlugin(modifier, detector, {
      detectIntervalMs: 0,
    })

    plugin.drawCanvas?.(stubCtx, stubVideo, 1000, 1000, { enabled: true })
    await flush()
    plugin.drawCanvas?.(stubCtx, stubVideo, 1000, 1000, { enabled: true })

    // No target → stays at the default center.
    expect(lastAlignCenter(updates).alignCenter).toEqual({ x: 0.5, y: 0.5 })
  })

  it("normalizes face position by the SOURCE resolution, not the output canvas (letterbox-off)", async () => {
    // Face boxes are returned in source pixel space. A face centered in a
    // 1920x1080 source must normalize to (0.5, 0.5) even when the output canvas
    // is the smaller crop-box (letterbox-off), otherwise Center Stage frames
    // against the wrong reference and drifts.
    const sourceVideo = {
      videoWidth: 1920,
      videoHeight: 1080,
    } as HTMLVideoElement
    // center = (960, 540) → exact center of 1920x1080
    const centeredFace: FaceBox = { x: 860, y: 440, width: 200, height: 200 }
    const { modifier, updates } = createMockModifier()
    const plugin = createCenterStagePlugin(
      modifier,
      createPassthroughDetector(() => [centeredFace]),
      { smoothingFactor: 1, deadzone: 0, detectIntervalMs: 0 }
    )

    // Canvas is the 4:3 crop-box (1440x1080) — narrower than the 1920x1080
    // source. Buggy code would yield x ≈ 0.667 (960 / 1440).
    plugin.drawCanvas?.(stubCtx, sourceVideo, 1440, 1080, { enabled: true })
    await flush()
    plugin.drawCanvas?.(stubCtx, sourceVideo, 1440, 1080, { enabled: true })

    expect(lastAlignCenter(updates).alignCenter).toEqual({ x: 0.5, y: 0.5 })
  })

  it("maps an off-center source face to the correct source-relative fraction (letterbox-off)", async () => {
    // Face center at source x=1440 (0.75 of 1920), y=540 (0.5 of 1080).
    const sourceVideo = {
      videoWidth: 1920,
      videoHeight: 1080,
    } as HTMLVideoElement
    const offCenterFace: FaceBox = { x: 1340, y: 440, width: 200, height: 200 }
    const { modifier, updates } = createMockModifier()
    const plugin = createCenterStagePlugin(
      modifier,
      createPassthroughDetector(() => [offCenterFace]),
      { smoothingFactor: 1, deadzone: 0, detectIntervalMs: 0 }
    )

    // Canvas = 1440x1080 crop-box. Buggy code would clamp x to 1.0 (1440/1440).
    plugin.drawCanvas?.(stubCtx, sourceVideo, 1440, 1080, { enabled: true })
    await flush()
    plugin.drawCanvas?.(stubCtx, sourceVideo, 1440, 1080, { enabled: true })

    expect(lastAlignCenter(updates).alignCenter).toEqual({ x: 0.75, y: 0.5 })
  })

  it("does not start a second detection while one is pending", async () => {
    let started = 0
    const resolvers: Array<(faces: FaceBox[]) => void> = []
    const controllable: FaceDetector = {
      detect: () => {
        started++
        return new Promise<FaceBox[]>((resolve) => {
          resolvers.push(resolve)
        })
      },
      isReady: () => true,
      destroy: () => {},
    }

    const { modifier } = createMockModifier()
    const plugin = createCenterStagePlugin(modifier, controllable, {
      detectIntervalMs: 0,
    })

    plugin.drawCanvas?.(stubCtx, stubVideo, 1000, 1000, { enabled: true })
    expect(started).toBe(1)
    // Second call while the first is still pending must not start another.
    plugin.drawCanvas?.(stubCtx, stubVideo, 1000, 1000, { enabled: true })
    expect(started).toBe(1)

    // Resolve + flush; now a subsequent frame may detect again.
    const pending = resolvers.splice(0)
    pending.forEach((resolve) => resolve([]))
    await flush()
    plugin.drawCanvas?.(stubCtx, stubVideo, 1000, 1000, { enabled: true })
    expect(started).toBe(2)
  })

  it("clears the align override when disabled", () => {
    const { modifier, updates } = createMockModifier()
    const detector = createPassthroughDetector(() => [FACE])
    const plugin = createCenterStagePlugin(modifier, detector, {
      detectIntervalMs: 0,
    })

    // Enabled frame pushes an align value.
    plugin.drawCanvas?.(stubCtx, stubVideo, 1000, 1000, { enabled: true })
    expect(lastAlignCenter(updates).alignCenter).toBeDefined()

    // Disabling should push alignCenter: undefined exactly once.
    plugin.drawCanvas?.(stubCtx, stubVideo, 1000, 1000, { enabled: false })
    expect(lastAlignCenter(updates).alignCenter).toBeUndefined()
    const before = updates[CROP_ZOOM_ALIGN_PLUGIN_ID]?.length ?? 0
    plugin.drawCanvas?.(stubCtx, stubVideo, 1000, 1000, { enabled: false })
    expect((updates[CROP_ZOOM_ALIGN_PLUGIN_ID]?.length ?? 0)).toBe(before)
  })

  it("zooms in for a far face and holds at 1 for a close face", async () => {
    // Far face: tiny box → computeFramingZoom clamps to maxZoom (2.5). The
    // spring glides toward it; after ~0.5s it must exceed the old 1.5 cap.
    const far = createMockModifier()
    const farPlugin = createCenterStagePlugin(
      far.modifier,
      createPassthroughDetector(() => [
        { x: 480, y: 480, width: 40, height: 40 },
      ]),
      { detectIntervalMs: 0 }
    )
    await runFor(farPlugin, 0.5)
    expect(lastZoomOverride(far.updates)).toBeGreaterThan(1.5)

    // Close face: large box → computeFramingZoom clamps to minZoom (1.0); the
    // spring never moves, so zoomOverride stays exactly 1.
    const near = createMockModifier()
    const nearPlugin = createCenterStagePlugin(
      near.modifier,
      createPassthroughDetector(() => [
        { x: 100, y: 100, width: 800, height: 800 },
      ]),
      { detectIntervalMs: 0 }
    )
    await runFor(nearPlugin, 0.1)
    expect(lastZoomOverride(near.updates)).toBe(1)
  })

  it("keeps auto-zoom stable (no pumping) for a jittered static face", async () => {
    // Simulate realistic MediaPipe box-size noise (±10%) on an otherwise static
    // face — large enough to make a naive zoom target pump in and out.
    let call = 0
    const detector = createPassthroughDetector(() => {
      call++
      const jitter = ((call % 5) - 2) * 10 // -20..20 px each axis (~±10%)
      return [
        {
          x: 400 + jitter,
          y: 400 - jitter,
          width: 200 + jitter,
          height: 200 - jitter,
        },
      ]
    })
    const { modifier, updates } = createMockModifier()
    const plugin = createCenterStagePlugin(modifier, detector, {
      detectIntervalMs: 0,
    })

    const zooms: number[] = []
    const start = Date.now()
    let guard = 0
    // Drive ~2.5s so the critically-damped spring (tau ~0.22s) fully converges
    // and parks before we measure the settling tail.
    while ((Date.now() - start) / 1000 < 2.5 && guard < 700) {
      plugin.drawCanvas?.(stubCtx, stubVideo, 1000, 1000, { enabled: true })
      await new Promise((r) => setTimeout(r, 8))
      await flush()
      const z = lastZoomOverride(updates)
      if (z !== undefined) zooms.push(z)
      guard++
    }

    // Once parked, quantization + change-dedup make the output exactly constant
    // — no sawtooth pumping. The final window must hold rock-steady.
    const tail = zooms.slice(-Math.floor(zooms.length * 0.3))
    expect(tail.length).toBeGreaterThan(0)
    const spread = Math.max(...tail) - Math.min(...tail)
    expect(spread).toBeLessThanOrEqual(0.005)
  })

  it("destroys the detector and clears the override on destroy", () => {
    let detectorDestroyed = false
    const detector: FaceDetector = {
      detect: async () => [],
      isReady: () => true,
      destroy: () => {
        detectorDestroyed = true
      },
    }
    const { modifier, updates } = createMockModifier()
    const plugin = createCenterStagePlugin(modifier, detector, {
      detectIntervalMs: 0,
    })

    plugin.drawCanvas?.(stubCtx, stubVideo, 1000, 1000, { enabled: true })
    plugin.destroy?.()

    expect(detectorDestroyed).toBe(true)
    expect(lastAlignCenter(updates).alignCenter).toBeUndefined()
  })
})
