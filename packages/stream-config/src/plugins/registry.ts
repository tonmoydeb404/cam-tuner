import { alignManifest } from "./align"
import { backgroundManifest } from "./background/manifest"
import { cropManifest } from "./crop/manifest"
import { mirrorManifest } from "./mirror/manifest"
import type { PluginManifest } from "./types"
import { zoomManifest } from "./zoom/manifest"

/**
 * The canonical plugin registry.  The array order here is purely for
 * readability — execution order is driven by each manifest's `executionOrder`
 * field, and UI panel order is driven by `uiOrder`.
 *
 * Execution pipeline (ascending executionOrder):
 *   background (5) → mirror (7) → zoom (8) → align (9) → crop (10)
 *
 * UI panel order (ascending uiOrder):
 *   crop (1) → align (2) → zoom (3) → mirror (4) → background (5)
 */
export const PLUGIN_REGISTRY: PluginManifest[] = [
  backgroundManifest,
  mirrorManifest,
  zoomManifest,
  alignManifest,
  cropManifest,
]
