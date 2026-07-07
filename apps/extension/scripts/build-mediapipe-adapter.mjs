/**
 * Bundles the MediaPipe adapters into standalone ESM files.
 *
 * WHY: WXT builds content scripts as IIFE, which forces Rollup to inline ALL
 * dynamic imports. Standalone ESM files can be loaded on demand via
 * `import(adapterUrl)` — keeping the per-page content script lightweight
 * (~15KB) and deferring the ~146KB MediaPipe runtime until a feature that
 * needs it (Center Stage, Background) is actually enabled.
 */
import { build } from "esbuild"
import { mkdir, rm } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const detectorOut = resolve(root, "public/mediapipe-adapter.js")
const segmenterOut = resolve(root, "public/mediapipe-segmenter-adapter.js")
const rvmOut = resolve(root, "public/rvm-segmenter-adapter.js")

await rm(detectorOut, { force: true })
await rm(segmenterOut, { force: true })
await rm(rvmOut, { force: true })

const baseOptions = {
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  sourcemap: false,
  legalComments: "none",
  logLevel: "info",
}

await build({
  ...baseOptions,
  entryPoints: [resolve(root, "lib/tracking/mediapipe-detector.ts")],
  outfile: detectorOut,
})

await build({
  ...baseOptions,
  entryPoints: [resolve(root, "lib/tracking/mediapipe-segmenter-adapter.ts")],
  outfile: segmenterOut,
})

await build({
  ...baseOptions,
  entryPoints: [resolve(root, "lib/tracking/rvm-segmenter-adapter.ts")],
  outfile: rvmOut,
  // onnxruntime-web/webgl is pure-JS (no WASM); mark Node built-ins external
  // so esbuild doesn't try to bundle them.
  external: ["node:*", "fs", "path", "os", "crypto"],
  define: { "process.env.NODE_ENV": '"production"' },
})

await mkdir(dirname(detectorOut), { recursive: true })

console.log("[build-mediapipe-adapter] wrote public/mediapipe-adapter.js")
console.log(
  "[build-mediapipe-adapter] wrote public/mediapipe-segmenter-adapter.js"
)
console.log("[build-mediapipe-adapter] wrote public/rvm-segmenter-adapter.js")
