/**
 * Bundles the matting backends (MediaPipe selfie segmenter + RVM via ONNX
 * Runtime Web) and the resolver into a standalone ESM file.
 *
 * WHY: same reason as the MediaPipe face-detector adapter — WXT content scripts
 * are IIFE and inline dynamic imports. A standalone ESM chunk loaded on demand
 * via `import(mattingAdapterUrl)` keeps the per-page content script light and
 * defers the heavy ONNX runtime + segmentation model until a background effect
 * is actually enabled.
 *
 * Entry: lib/matting/index.ts (exports `createMatteProvider`).
 */
import { build } from "esbuild"
import { rm } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const outfile = resolve(root, "public/matting-adapter.js")

await rm(outfile, { force: true })

await build({
  entryPoints: [resolve(root, "lib/matting/index.ts")],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  outfile,
  sourcemap: false,
  legalComments: "none",
  logLevel: "info",
  // onnxruntime-web references Node built-ins in some code paths; treat them
  // as external/no-op in the browser bundle.
  external: [],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
})

await import("node:fs/promises").then((m) => m.mkdir(dirname(outfile), { recursive: true }))

console.log("[build-matting-adapter] wrote public/matting-adapter.js")
