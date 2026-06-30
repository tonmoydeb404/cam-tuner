/**
 * Bundles the MediaPipe face-detector adapter into a standalone ESM file.
 *
 * WHY: WXT builds content scripts as IIFE, which forces Rollup to inline ALL
 * dynamic imports. A standalone ESM file can be loaded on demand via
 * `import(adapterUrl)` — keeping the per-page content script lightweight
 * (~15KB) and deferring the ~146KB MediaPipe runtime until Center Stage
 * is actually enabled.
 */
import { build } from "esbuild"
import { mkdir, rm } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const outfile = resolve(root, "public/mediapipe-adapter.js")

// Clean previous build
await rm(outfile, { force: true })

await build({
  entryPoints: [resolve(root, "lib/tracking/mediapipe-detector.ts")],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  outfile,
  sourcemap: false,
  legalComments: "none",
  logLevel: "info",
})

await mkdir(dirname(outfile), { recursive: true })

console.log("[build-mediapipe-adapter] wrote public/mediapipe-adapter.js")
