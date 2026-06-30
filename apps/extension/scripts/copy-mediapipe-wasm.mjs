/**
 * Copies MediaPipe Tasks Vision WASM assets from node_modules into the
 * extension's public/ folder so they are bundled and served locally
 * (required for MV3 — remote scripts are blocked by Content-Security-Policy).
 *
 * Run automatically before `dev` and `build` (see package.json scripts).
 */
import { access, cp, mkdir } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const here = dirname(fileURLToPath(import.meta.url))
const dest = join(here, "..", "public", "wasm")

// Resolve the WASM dir via an exported subpath (the package's `exports` map
// does not expose ./package.json, so we resolve a known wasm entry instead).
let wasmDir
try {
  const resolved = require.resolve(
    "@mediapipe/tasks-vision/vision_wasm_internal.js"
  )
  wasmDir = dirname(resolved)
} catch {
  console.warn(
    "[copy-mediapipe-wasm] @mediapipe/tasks-vision not resolvable — skipping."
  )
  process.exit(0)
}

await mkdir(dest, { recursive: true })

const files = [
  "vision_wasm_internal.js",
  "vision_wasm_internal.wasm",
  "vision_wasm_nosimd_internal.js",
  "vision_wasm_nosimd_internal.wasm",
]

for (const file of files) {
  const from = join(wasmDir, file)
  try {
    await access(from)
  } catch {
    continue // optional file absent in this version
  }
  await cp(from, join(dest, file))
  console.log(`[copy-mediapipe-wasm] copied ${file}`)
}
