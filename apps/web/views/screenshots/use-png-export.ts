"use client"

import { toPng } from "html-to-image"
import { useCallback, useState } from "react"

const FONT_URL_RE = /url\((['"]?)([^'")]+)\1\)/g

/** Fetch a font file and return it as a base64 data URL. */
async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

/**
 * Collect every @font-face rule in the document. cssRules can throw for
 * cross-origin or Turbopack-dev sheets, so fall back to fetching the sheet's
 * CSS and extracting the blocks manually.
 */
async function collectFontFaceBlocks(): Promise<
  { css: string; base: string }[]
> {
  const blocks: { css: string; base: string }[] = []
  for (const sheet of Array.from(document.styleSheets)) {
    const base = sheet.href ?? document.baseURI
    let readable = true
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        if (rule instanceof CSSFontFaceRule) {
          blocks.push({ css: rule.cssText, base })
        }
      }
    } catch {
      readable = false
    }
    if (readable || !sheet.href) continue
    try {
      const res = await fetch(sheet.href)
      const text = await res.text()
      for (const match of text.matchAll(/@font-face\s*{[^}]*}/g)) {
        blocks.push({ css: match[0], base })
      }
    } catch {
      // Skip sheets that are neither readable nor fetchable.
    }
  }
  return blocks
}

/** Replace every url(...) in a CSS block with an inlined data URL. */
async function inlineFontUrls(css: string, base: string): Promise<string> {
  let out = css
  for (const match of css.matchAll(FONT_URL_RE)) {
    const raw = match[2]
    if (!raw) continue
    let absolute: string
    try {
      absolute = new URL(raw, base).href
    } catch {
      continue
    }
    const dataUrl = await fetchAsDataUrl(absolute)
    if (dataUrl) {
      out = out.replace(match[0], `url("${dataUrl}")`)
    }
  }
  return out
}

let fontEmbedCache: Promise<string> | null = null

/**
 * Self-contained @font-face embed CSS: rules are collected straight from
 * document.styleSheets (with a fetch fallback) and every font file is
 * inlined as a data URL, so exports don't depend on html-to-image's
 * stylesheet scanning working in the current environment.
 */
function getFontEmbedCSS(): Promise<string> {
  if (!fontEmbedCache) {
    fontEmbedCache = (async () => {
      const blocks = await collectFontFaceBlocks()
      const inlined = await Promise.all(
        blocks.map((block) => inlineFontUrls(block.css, block.base))
      )
      return inlined.join("\n")
    })()
    fontEmbedCache.catch(() => {
      fontEmbedCache = null
    })
  }
  return fontEmbedCache
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
        // Fonts must be present in the page before they can be embedded.
        await document.fonts.ready
        const fonts = await getFontEmbedCSS()
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
