/**
 * Copies ONNX Runtime Web WASM assets from node_modules into the extension's
 * public/ort-wasm so they are bundled and served locally (MV3 blocks remote
 * scripts). The RVM high-quality backend loads these at runtime via
 * `ort.env.wasm.wasmPaths`.
 *
 * Run automatically before `dev` and `build` (see package.json scripts).
 * Silently skips if onnxruntime-web is not installed — in that case the
 * resolver degrades to the MediaPipe backend.
 */
import { access, cp, mkdir } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const here = dirname(fileURLToPath(import.meta.url))
const dest = join(here, "..", "public", "ort-wasm")

let wasmDir
try {
  // The package `exports` map forbids resolving dist subpaths directly, so
  // resolve the package entry and derive its dist directory.
  const resolved = require.resolve("onnxruntime-web")
  wasmDir = dirname(resolved)
} catch {
  console.warn(
    "[copy-ort-wasm] onnxruntime-web not resolvable — skipping (RVM backend disabled)."
  )
  process.exit(0)
}

await mkdir(dest, { recursive: true })

// Copy all the wasm + loader variants onnxruntime-web may request. The WebGPU
// / JSEP build (used first) plus the SIMD/WASM fallbacks.
const files = [
  "ort-wasm-simd-threaded.jsep.mjs",
  "ort-wasm-simd-threaded.jsep.wasm",
  "ort-wasm-simd-threaded.asyncify.mjs",
  "ort-wasm-simd-threaded.asyncify.wasm",
  "ort-wasm-simd-threaded.mjs",
  "ort-wasm-simd-threaded.wasm",
]

for (const file of files) {
  const from = join(wasmDir, file)
  try {
    await access(from)
  } catch {
    continue // optional variant absent in this version
  }
  await cp(from, join(dest, file))
  console.log(`[copy-ort-wasm] copied ${file}`)
}
