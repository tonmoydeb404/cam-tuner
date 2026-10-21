"use client"

import { getFontEmbedCSS, toPng } from "html-to-image"
import { useCallback, useRef, useState } from "react"

/**
 * Font CSS is identical for every frame on the page, so embed it once and
 * reuse it for each export instead of re-fetching the woff2s per frame.
 */
let fontEmbedPromise: Promise<string> | null = null
const fontEmbedCSS = (node: HTMLElement) => {
  if (!fontEmbedPromise) {
    fontEmbedPromise = getFontEmbedCSS(node).catch((error) => {
      fontEmbedPromise = null
      throw error
    })
  }
  return fontEmbedPromise
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type ExportOptions = {
  /** Export scale — 2 means a PNG with twice the CSS pixel dimensions. */
  scale: number
  filename: string
}

/**
 * Renders a DOM node to a PNG at its exact layout size (x scale) and
 * triggers a download. Nodes are measured untransformed, so previews can be
 * CSS-scaled down while exports stay pixel-perfect.
 */
export function usePngExport() {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [progress, setProgress] = useState<string | null>(null)

  const exportNode = useCallback(
    async (
      id: string,
      node: HTMLElement,
      { scale, filename }: ExportOptions
    ) => {
      setBusyId(id)
      try {
        const fonts = await fontEmbedCSS(node)
        const dataUrl = await toPng(node, {
          pixelRatio: scale,
          fontEmbedCSS: fonts,
        })
        const link = document.createElement("a")
        link.download = filename
        link.href = dataUrl
        link.click()
      } finally {
        setBusyId(null)
      }
    },
    []
  )

  const exportAll = useCallback(
    async (
      assets: { id: string; filename: string }[],
      getNode: (id: string) => HTMLElement | undefined,
      scale: number
    ) => {
      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i]!
        const node = getNode(asset.id)
        if (!node) continue
        setProgress(`${i + 1} / ${assets.length}`)
        await exportNode(asset.id, node, { scale, filename: asset.filename })
        // Let the browser settle the previous download before the next one.
        await delay(400)
      }
      setProgress(null)
    },
    [exportNode]
  )

  return { busyId, progress, exportNode, exportAll }
}
