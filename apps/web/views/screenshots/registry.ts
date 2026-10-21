import type { ComponentType } from "react"
import { HeroFrame, MarqueeTileFrame, SmallTileFrame } from "./store-frames"
import {
  BackgroundFrame,
  CenterStageFrame,
  FramingFrame,
  ZoomAlignFrame,
} from "./feature-frames"
import { PopupFrame } from "./popup-mock"

export type ScreenshotAsset = {
  id: string
  name: string
  group: "store" | "features"
  width: number
  height: number
  note: string
  Component: ComponentType
}

/**
 * Store-ready promo assets. Dimensions are the exact sizes the Chrome Web
 * Store uploader expects; the 1280x800 set also satisfies Firefox Add-ons.
 * Chrome Web Store caps listings at 5 screenshots — the 6 screenshot-size
 * assets here leave room to choose.
 */
export const SCREENSHOT_ASSETS: ScreenshotAsset[] = [
  {
    id: "hero",
    name: "Primary screenshot",
    group: "store",
    width: 1280,
    height: 800,
    note: "Main store tile · 16:10",
    Component: HeroFrame,
  },
  {
    id: "small-tile",
    name: "Small promo tile",
    group: "store",
    width: 440,
    height: 280,
    note: "List & search surfaces",
    Component: SmallTileFrame,
  },
  {
    id: "marquee-tile",
    name: "Marquee promo tile",
    group: "store",
    width: 1400,
    height: 560,
    note: "Featured banner · 5:2",
    Component: MarqueeTileFrame,
  },
  {
    id: "framing",
    name: "Framing",
    group: "features",
    width: 1280,
    height: 800,
    note: "Aspect ratio & letterbox",
    Component: FramingFrame,
  },
  {
    id: "zoom-align",
    name: "Zoom & align",
    group: "features",
    width: 1280,
    height: 800,
    note: "Zoom, nine-point alignment",
    Component: ZoomAlignFrame,
  },
  {
    id: "center-stage",
    name: "Center Stage",
    group: "features",
    width: 1280,
    height: 800,
    note: "On-device face tracking",
    Component: CenterStageFrame,
  },
  {
    id: "background",
    name: "Background",
    group: "features",
    width: 1280,
    height: 800,
    note: "Blur & replace",
    Component: BackgroundFrame,
  },
  {
    id: "popup",
    name: "Popup",
    group: "features",
    width: 1280,
    height: 800,
    note: "Extension popup tour",
    Component: PopupFrame,
  },
]

export const assetFilename = (asset: ScreenshotAsset, scale: number) =>
  `camtuner-${asset.id}-${asset.width}x${asset.height}${
    scale > 1 ? `@${scale}x` : ""
  }.png`
