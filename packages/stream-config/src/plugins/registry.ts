import { createAlignManifest } from "./align/manifest"
import { createBackgroundManifest } from "./background"
import { createCropManifest } from "./crop/manifest"
import { mirrorManifest } from "./mirror/manifest"
import type { PluginManifest } from "./types"
import { createZoomManifest } from "./zoom/manifest"

/**
 * The canonical plugin registry.  The array order here is purely for
 * readability — execution order is driven by each manifest's `executionOrder`
 * field, and UI panel order is driven by `uiOrder`.
 *
 * Execution pipeline (ascending executionOrder):
 *   zoom (3) → align (4) → background (5) → mirror (7) → crop (10) → debug-overlay (11)
 *
 * zoom (3) and align (4) run before background (5) so their prepareSource hooks
 * capture the raw video frame before the background plugin composites it.
 * Face detection for auto-zoom and center-stage therefore always sees an
 * unmodified frame, avoiding the stale-mask and canvas-mutation issues that
 * degrade detection when blur is active.
 * zoom runs before align so its drawCanvas sets the correct dt for the spring
 * smoother before align's smoothing tick advances the pan channel.
 *
 * UI panel order (ascending uiOrder):
 *   crop (1) → align (2) → zoom (3) → mirror (4) → background (5)
 *
 * To customise plugin options, call the manifest factory functions directly
 * and compose your own registry array, e.g.:
 *   [createZoomManifest({ disableAuto: true }), createCropManifest(), ...]
 */
export const PLUGIN_REGISTRY: PluginManifest[] = [
  createBackgroundManifest({ disableImage: true }),
  mirrorManifest,
  createZoomManifest({}),
  createAlignManifest({ disableAuto: false }),
  createCropManifest(),
  // createDebugOverlayManifest(),
]
