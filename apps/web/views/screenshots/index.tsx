"use client"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { IconDownload, IconLoader2 } from "@tabler/icons-react"
import { useCallback, useRef, useState } from "react"
import PageHeader from "@/layouts/page-layout/header"
import { display } from "./fonts"
import FrameCard from "./frame-card"
import { SCREENSHOT_ASSETS, assetFilename } from "./registry"
import { usePngExport } from "./use-png-export"

const SCALES = [1, 2, 3] as const

const ScreenshotsView = () => {
  const { busyId, progress, exportNode, exportAll } = usePngExport()
  const [scale, setScale] = useState<number>(2)
  const nodes = useRef(new Map<string, HTMLDivElement>())

  const registerNode = useCallback(
    (id: string) => (node: HTMLDivElement | null) => {
      if (node) nodes.current.set(id, node)
      else nodes.current.delete(id)
    },
    []
  )

  const storeAssets = SCREENSHOT_ASSETS.filter((a) => a.group === "store")
  const featureAssets = SCREENSHOT_ASSETS.filter((a) => a.group === "features")

  const handleExportAll = () => {
    void exportAll(
      SCREENSHOT_ASSETS.map((asset) => ({
        id: asset.id,
        filename: assetFilename(asset, scale),
      })),
      (id) => nodes.current.get(id),
      scale
    )
  }

  const exporting = progress !== null

  return (
    <div className={display.variable}>
      <PageHeader
        title="Store screenshots"
        description="Pixel-perfect promo assets for the Chrome Web Store and Firefox Add-ons listings. Every frame exports at its declared dimensions — exactly what the store uploaders expect."
        className="mb-10"
      />

      <div className="container pb-32">
        {/* toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b pb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {SCREENSHOT_ASSETS.length} assets
            </span>{" "}
            · PNG · {scale}×{" "}
            <span className="hidden sm:inline">
              (
              {scale === 1 ? "declared dimensions" : `declared size × ${scale}`}
              )
            </span>
          </p>

          <div
            role="group"
            aria-label="Export scale"
            className="ml-auto flex items-center gap-2"
          >
            <div className="flex items-center gap-1 rounded-full border p-1">
              {SCALES.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={s === scale}
                  onClick={() => setScale(s)}
                  className={cn(
                    "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                    s === scale
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s}×
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleExportAll}
              disabled={exporting}
              className={cn(
                buttonVariants({ variant: "default" }),
                "cursor-pointer"
              )}
            >
              {exporting ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                <IconDownload className="size-4" />
              )}
              {exporting ? `Exporting ${progress}` : "Download all"}
            </button>
          </div>
        </div>

        {/* store assets */}
        <section aria-labelledby="store-assets" className="pt-12">
          <h2 id="store-assets" className="text-xl font-bold tracking-tight">
            Store assets
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The listing tiles — screenshot cover, search-result tile and the
            featured marquee.
          </p>
          <div className="mt-6 grid gap-6">
            {storeAssets.map((asset) => (
              <FrameCard
                key={asset.id}
                asset={asset}
                scale={scale}
                busy={busyId === asset.id}
                onExport={() => {
                  const node = nodes.current.get(asset.id)
                  if (node) {
                    void exportNode(asset.id, node, {
                      scale,
                      filename: assetFilename(asset, scale),
                    })
                  }
                }}
                registerNode={registerNode(asset.id)}
              />
            ))}
          </div>
        </section>

        {/* feature screenshots */}
        <section aria-labelledby="feature-shots" className="pt-16">
          <h2 id="feature-shots" className="text-xl font-bold tracking-tight">
            Feature screenshots
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            One shot per feature at 1280×800 — the size the Chrome Web Store
            uploader expects (five max per listing) and a comfortable fit for
            Firefox Add-ons.
          </p>
          <div className="mt-6 grid gap-6">
            {featureAssets.map((asset) => (
              <FrameCard
                key={asset.id}
                asset={asset}
                scale={scale}
                busy={busyId === asset.id}
                onExport={() => {
                  const node = nodes.current.get(asset.id)
                  if (node) {
                    void exportNode(asset.id, node, {
                      scale,
                      filename: assetFilename(asset, scale),
                    })
                  }
                }}
                registerNode={registerNode(asset.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default ScreenshotsView
