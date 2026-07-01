/**
 * Cross-feature plugin routing identifiers.
 *
 * A plugin's own id normally lives next to the plugin. An id is lifted into
 * `shared` ONLY when one feature must address another feature's plugin at
 * runtime (the modifier routes config updates by string id). Keeping these
 * routing keys here means features never import from each other.
 */

/** Id of the crop/zoom/align (letterbox) plugin. Center Stage writes to it. */
export const CROP_ZOOM_ALIGN_PLUGIN_ID = "core:crop-zoom-align"
