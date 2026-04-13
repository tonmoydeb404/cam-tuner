"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Draws a static image onto a hidden canvas and captures a MediaStream from it.
 * This lets us feed an image through the same StreamModifier pipeline used for webcams.
 */
export function useImageStream(imageSrc: string) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = document.createElement("canvas")
    canvasRef.current = canvas
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageSrc

    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)

      // captureStream needs periodic redraws to keep the stream alive
      const mediaStream = canvas.captureStream(30)
      setStream(mediaStream)

      const tick = () => {
        ctx.drawImage(img, 0, 0)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      stream?.getTracks().forEach((t) => t.stop())
      setStream(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc])

  return stream
}
