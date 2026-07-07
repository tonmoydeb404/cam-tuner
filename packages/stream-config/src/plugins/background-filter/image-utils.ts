/**
 * Background image upload processing — validates, resizes, and compresses
 * user-uploaded images so they fit within chrome.storage limits.
 */
const MAX_UPLOAD_WIDTH = 1280
const MAX_UPLOAD_HEIGHT = 720
const JPEG_QUALITY = 0.8

export async function processUploadedImage(file: File): Promise<{
  id: string
  name: string
  dataUrl: string
}> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image")
  }

  const bitmap = await createImageBitmap(file)
  let { width, height } = bitmap

  const scale = Math.min(
    MAX_UPLOAD_WIDTH / width,
    MAX_UPLOAD_HEIGHT / height,
    1
  )
  width = Math.round(width * scale)
  height = Math.round(height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Could not get 2D context")
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY)
  const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  return { id, name: file.name, dataUrl }
}
