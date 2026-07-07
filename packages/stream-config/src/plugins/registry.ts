import { createAlignManifest } from "./align/manifest"
import { createCropManifest } from "./crop/manifest"
import { createDebugOverlayManifest } from "./debug-overlay/manifest"
import { mirrorManifest } from "./mirror/manifest"
import type { PluginManifest } from "./types"
import { createZoomManifest } from "./zoom/manifest"

/**
 * The canonical plugin registry.  The array order here is purely for
 * readability — execution order is driven by each manifest's `executionOrder`
 * field, and UI panel order is driven by `uiOrder`.
 *
 * Execution pipeline (ascending executionOrder):
 *   background (5) → mirror (7) → zoom (8) → align (9) → crop (10) → debug-overlay (11)
 *
 * UI panel order (ascending uiOrder):
 *   crop (1) → align (2) → zoom (3) → mirror (4) → background (5)
 *
 * To customise plugin options, call the manifest factory functions directly
 * and compose your own registry array, e.g.:
 *   [createZoomManifest({ disableAuto: true }), createCropManifest(), ...]
 */
export const PLUGIN_REGISTRY: PluginManifest[] = [
  // createBackgroundManifest(),
  mirrorManifest,
  createZoomManifest({ enableDebug: true }),
  createAlignManifest({ disableAuto: true }),
  createCropManifest(),
  createDebugOverlayManifest(),
]
