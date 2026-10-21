"use client"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { IconDownload, IconLoader2 } from "@tabler/icons-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import type { ScreenshotAsset } from "./registry"

/** Scales a fixed-size frame down to fit its container, export-safe. */
const ScaledPreview = ({
  width,
  height,
  innerRef,
  children,
}: {
  width: number
  height: number
  innerRef: (node: HTMLDivElement | null) => void
  children: ReactNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setScale(Math.min(1, el.clientWidth / width))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [width])

  return (
    <div
      ref={containerRef}
      className="flex justify-center overflow-hidden"
      style={{ height: scale > 0 ? height * scale : undefined }}
    >
      <div
        className="shrink-0 overflow-hidden"
        style={{ width: width * (scale || 1), height: height * (scale || 1) }}
      >
        <div
          ref={innerRef}
          style={{
            width,
            height,
            transform: `scale(${scale || 1})`,
            transformOrigin: "top left",
            visibility: scale > 0 ? "visible" : "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

const FrameCard = ({
  asset,
  scale,
  busy,
  onExport,
  registerNode,
}: {
  asset: ScreenshotAsset
  scale: number
  busy: boolean
  onExport: () => void
  registerNode: (node: HTMLDivElement | null) => void
}) => {
  const { Component } = asset
  return (
    <figure className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <figcaption>
          <p className="text-sm font-semibold">{asset.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <span className="font-mono">
              {asset.width}×{asset.height}
            </span>
            {" · "}
            {asset.note}
          </p>
        </figcaption>
        <button
          type="button"
          onClick={onExport}
          disabled={busy}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "shrink-0 cursor-pointer"
          )}
        >
          {busy ? (
            <IconLoader2 className="size-4 animate-spin" />
          ) : (
            <IconDownload className="size-4" />
          )}
          {busy ? "Rendering…" : `PNG ×${scale}`}
        </button>
      </div>
      <div className="border-t bg-muted/40 p-5 sm:p-8">
        <div className="overflow-hidden rounded-md shadow-md ring-1 ring-black/5">
          <ScaledPreview
            width={asset.width}
            height={asset.height}
            innerRef={registerNode}
          >
            <Component />
          </ScaledPreview>
        </div>
      </div>
    </figure>
  )
}

export default FrameCard
