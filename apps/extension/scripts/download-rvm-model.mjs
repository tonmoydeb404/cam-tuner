/**
 * Downloads the Robust Video Matting MobileNetV3 ONNX model into
 * public/ so it is bundled with the extension and served from a
 * chrome-extension:// URL (avoids page CSP/CORS constraints).
 *
 * The file is skipped if it already exists (idempotent).
 * Run automatically before `dev` and `build` via package.json scripts.
 */
import { access, mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const dest = resolve(here, "..", "public", "rvm-mobilenetv3-fp32.onnx")

const MODEL_URL =
  "https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.onnx"

try {
  await access(dest)
  console.log("[download-rvm-model] model already present, skipping.")
} catch {
  console.log("[download-rvm-model] downloading RVM model (~14 MB)…")
  const res = await fetch(MODEL_URL, { redirect: "follow" })
  if (!res.ok)
    throw new Error(`[download-rvm-model] HTTP ${res.status} from ${MODEL_URL}`)
  const buffer = await res.arrayBuffer()
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, Buffer.from(buffer))
  console.log("[download-rvm-model] saved to public/rvm-mobilenetv3-fp32.onnx")
}
