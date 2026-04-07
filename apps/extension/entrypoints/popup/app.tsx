import { EyeIcon, Video01Icon, VideoOffIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type {
  AlignPosition,
  AspectRatio,
  TunerConfig,
} from "@workspace/stream-config"
import { DEFAULT_TUNER_CONFIG } from "@workspace/stream-config"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { AlignControl } from "@workspace/ui/components/tuner/align-control"
import { AspectRatioControl } from "@workspace/ui/components/tuner/aspect-ratio-control"
import { ZoomControl } from "@workspace/ui/components/tuner/zoom-control"
import { useEffect, useState } from "react"
import {
  getTunerConfig,
  setAlign,
  setAspectRatio,
  setBarColor,
  setZoom,
  virtualCamEnabled,
} from "../../lib/storage"

export default function App() {
  const [config, setConfig] = useState<TunerConfig>(DEFAULT_TUNER_CONFIG)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [loaded, isEnabled] = await Promise.all([
        getTunerConfig(),
        virtualCamEnabled.getValue(),
      ])
      setConfig(loaded)
      setEnabled(isEnabled)
    }
    load()
  }, [])

  const handleToggle = async (value: boolean) => {
    setEnabled(value)
    await virtualCamEnabled.setValue(value)
  }

  const handleAspectRatio = async (ratio: AspectRatio) => {
    setConfig((c) => ({ ...c, aspectRatio: ratio }))
    await setAspectRatio(ratio)
  }

  const handleZoom = async (zoom: number) => {
    setConfig((c) => ({ ...c, zoom }))
    await setZoom(zoom)
  }

  const handleAlign = async (align: AlignPosition) => {
    setConfig((c) => ({ ...c, align }))
    await setAlign(align)
  }

  const handleBarColor = async (barColor: string) => {
    setConfig((c) => ({ ...c, barColor }))
    await setBarColor(barColor)
  }

  const handlePreview = async () => {
    const webUrl = import.meta.env.VITE_WEB_URL
    await browser.tabs.create({ url: `${webUrl}/preview` })
  }

  return (
    <div className="flex w-[400px] flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h1 className="text-lg font-semibold">CamTuner</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handlePreview}
            className="text-primary"
          >
            <HugeiconsIcon icon={EyeIcon} size={18} />
          </Button>
        </div>
      </div>

      {/* Enable Toggle */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="flex items-center gap-3">
          <HugeiconsIcon
            icon={enabled ? Video01Icon : VideoOffIcon}
            size={20}
            className={enabled ? "text-primary" : "text-muted-foreground"}
          />
          <div>
            <p className="text-sm font-medium">Camera Tuning</p>
            <p className="text-xs text-muted-foreground">
              {enabled ? "Active" : "Disabled"}
            </p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      </div>

      <Card
        className={`bg-muted dark:bg-card transition-opacity${!enabled ? "pointer-events-none opacity-50" : ""}`}
      >
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Aspect Ratio Control */}
            <div className="flex flex-col gap-3">
              <Label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                Aspect Ratio
              </Label>
              <AspectRatioControl
                value={config.aspectRatio}
                onChange={handleAspectRatio}
              />
            </div>

            {/* Zoom Control */}
            <ZoomControl value={config.zoom} onChange={handleZoom} />

            {/* Align Control */}
            <AlignControl value={config.align} onChange={handleAlign} />

            {/* Bar Color */}
            <div className="flex flex-col gap-3">
              <Label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                Bar Color
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.barColor || "#000000"}
                  onChange={(e) => handleBarColor(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <span className="text-xs text-muted-foreground">
                  {config.barColor || "#000000"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
