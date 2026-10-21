/**
 * Frame colors are hardcoded (never theme tokens) so exported PNGs look
 * identical regardless of the site's light/dark mode.
 * Values mirror the light-theme tokens in packages/ui globals.css.
 */
export const palette = {
  paper: "oklch(0.9709 0.0114 128.5914)",
  ink: "oklch(0.2715 0.0273 159.2673)",
  card: "#ffffff",
  lime: "#9AE600",
  limeSoft: "oklch(0.8523 0.1913 123.5789)",
  accentWash: "oklch(0.9513 0.0434 121.3482)",
  muted: "oklch(0.4866 0.016 145.3235)",
  line: "oklch(0.8421 0.0122 133.3919)",
  deep: "oklch(0.2715 0.0273 159.2673)",
  deepCard: "oklch(0.3242 0.0254 158.2877)",
} as const
