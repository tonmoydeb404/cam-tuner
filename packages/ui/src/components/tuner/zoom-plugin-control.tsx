"use client"

import type { PluginUIProps, ZoomMode } from "@workspace/stream-config"
import { ZoomControl } from "@workspace/ui/components/tuner/zoom-control"

export const ZoomPluginControl = ({
  config,
  onConfigChange,
  options,
}: PluginUIProps) => (
  <ZoomControl
    value={config.zoom}
    onChange={(v: number) => onConfigChange({ zoom: v })}
    mode={options?.disableAuto ? undefined : (config.zoomMode ?? "fixed")}
    onModeChange={
      options?.disableAuto
        ? undefined
        : (v: ZoomMode) => onConfigChange({ zoomMode: v })
    }
    autoZoomMin={config.autoZoomMin ?? 1}
    onAutoZoomMinChange={(v: number) => onConfigChange({ autoZoomMin: v })}
    autoZoomMax={config.autoZoomMax ?? 2.5}
    onAutoZoomMaxChange={(v: number) => onConfigChange({ autoZoomMax: v })}
  />
)
