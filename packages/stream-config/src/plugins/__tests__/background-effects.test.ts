/**
 * Tests for the background-effects plugin.
 *
 * Canvas-dependent compositing tests are skipped in Node (jsdom has no real 2D
 * context) — see crop-zoom-align.test.ts for the same convention. We test the
 * control flow that doesn't touch the canvas: mode gating, source-size
 * validation, segmentation triggering, and image loading.
 */
import { describe, expect, it, vi } from "vitest"
import {
  BACKGROUND_EFFECTS_PLUGIN_ID,
  createBackgroundEffectsPlugin,
} from "../background-effects"
import {
  createPassthroughMatteProvider,
  type PassthroughMatteSource,
} from "../../matting/passthrough-matte"
import type { Matte, MatteProvider } from "../../matting/types"

const flush = async () => {
  for (let i = 0; i < 5; i++) await Promise.resolve()
}

const STUB_SOURCE = { width: 640, height: 480 } as CanvasImageSource
const ZERO_SOURCE = {} as CanvasImageSource

const FULL_MATTE: Matte = {
  width: 2,
  height: 2,
  data: new Float32Array([1, 1, 1, 1]),
}

describe("background-effects plugin", () => {
  it("has the correct plugin id", () => {
    const matte = createPassthroughMatteProvider(() => null)
    const plugin = createBackgroundEffectsPlugin(matte)
    expect(plugin.id).toBe(BACKGROUND_EFFECTS_PLUGIN_ID)
  })

  it("returns null when mode is 'none' (zero cost, no segmentation)", async () => {
    const segment = vi.fn(() => Promise.resolve(FULL_MATTE))
    const matte: MatteProvider = {
      segment,
      isReady: () => true,
      destroy: () => {},
    }
    const plugin = createBackgroundEffectsPlugin(matte)

    const result = plugin.prepareSource?.(STUB_SOURCE, { mode: "none" })
    expect(result).toBeNull()
    await flush()
    expect(segment).not.toHaveBeenCalled()
  })

  it("returns null when the source has no dimensions yet", () => {
    const matte = createPassthroughMatteProvider(() => FULL_MATTE)
    const plugin = createBackgroundEffectsPlugin(matte)

    const result = plugin.prepareSource?.(ZERO_SOURCE, { mode: "blur" })
    expect(result).toBeNull()
  })

  it("fires segmentation but returns null until a matte is available", async () => {
    const matte: MatteProvider = {
      segment: vi.fn(() => Promise.resolve(FULL_MATTE)),
      isReady: () => true,
      destroy: () => {},
    }
    const plugin = createBackgroundEffectsPlugin(matte)

    // First frame: no cached matte yet → null, but segmentation kicked off.
    const result = plugin.prepareSource?.(STUB_SOURCE, { mode: "blur" })
    expect(result).toBeNull()
    await flush()
    expect(matte.segment).toHaveBeenCalledWith(STUB_SOURCE, 640, 480)
  })

  it("does not start a second segmentation while one is pending", () => {
    const segment = vi.fn(
      () => new Promise<Matte>((resolve) => setTimeout(() => resolve(FULL_MATTE), 50))
    )
    const matte: MatteProvider = {
      segment,
      isReady: () => true,
      destroy: () => {},
    }
    const plugin = createBackgroundEffectsPlugin(matte)

    plugin.prepareSource?.(STUB_SOURCE, { mode: "blur" })
    plugin.prepareSource?.(STUB_SOURCE, { mode: "blur" })
    plugin.prepareSource?.(STUB_SOURCE, { mode: "blur" })
    expect(segment).toHaveBeenCalledTimes(1)
  })

  it("requests the background image via resolveImage in image mode", async () => {
    const resolveImage = vi.fn(() => Promise.resolve(null))
    const matte = createPassthroughMatteProvider(() => FULL_MATTE)
    const plugin = createBackgroundEffectsPlugin(matte, { resolveImage })

    // Prime the matte cache first (segmentation resolves async).
    plugin.prepareSource?.(STUB_SOURCE, { mode: "blur" })
    await flush()

    // image mode + matte available, but no image loaded yet → null, and
    // resolveImage should have been asked for the id.
    plugin.prepareSource?.(STUB_SOURCE, {
      mode: "image",
      imageId: "preset-office",
    })
    expect(resolveImage).toHaveBeenCalledWith("preset-office")
  })

  it("does not re-request an image that is already cached", async () => {
    const resolveImage = vi.fn(() => Promise.resolve(null))
    const matte = createPassthroughMatteProvider(() => FULL_MATTE)
    const plugin = createBackgroundEffectsPlugin(matte, { resolveImage })

    // Prime the matte cache first.
    plugin.prepareSource?.(STUB_SOURCE, { mode: "blur" })
    await flush()

    plugin.prepareSource?.(STUB_SOURCE, {
      mode: "image",
      imageId: "preset-office",
    })
    await flush()
    plugin.prepareSource?.(STUB_SOURCE, {
      mode: "image",
      imageId: "preset-office",
    })
    expect(resolveImage).toHaveBeenCalledTimes(1)
  })

  it("destroys the matte provider on destroy", () => {
    let destroyed = false
    const matte: MatteProvider = {
      segment: async () => FULL_MATTE,
      isReady: () => true,
      destroy: () => {
        destroyed = true
      },
    }
    const plugin = createBackgroundEffectsPlugin(matte)
    plugin.destroy?.()
    expect(destroyed).toBe(true)

    // After destroy, prepareSource is a no-op.
    const result = plugin.prepareSource?.(STUB_SOURCE, { mode: "blur" })
    expect(result).toBeNull()
  })
})
