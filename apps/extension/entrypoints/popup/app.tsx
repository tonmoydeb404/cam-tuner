import {
  ArrowAllDirectionIcon,
  ArrowDown01Icon,
  ArrowDownLeft01Icon,
  ArrowDownRight01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowUpLeft01Icon,
  ArrowUpRight01Icon,
  CheckmarkCircle01Icon,
  EyeIcon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Slider } from "@workspace/ui/components/slider"
import { Switch } from "@workspace/ui/components/switch"
import { useEffect, useState } from "react"
import {
  getTunerConfig,
  setAlign,
  setAspectRatio,
  setGridVisible,
  setZoom,
} from "../../lib/storage"
import type {
  AlignPosition,
  AspectRatio,
  TunerConfig,
} from "../../lib/tuner-types"
import {
  ASPECT_RATIO_OPTIONS,
  DEFAULT_TUNER_CONFIG,
} from "../../lib/tuner-types"

const ALIGN_OPTIONS: AlignPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "center-left",
  "center",
  "center-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
]

const ALIGN_ICONS: Record<
  AlignPosition,
  | typeof ArrowUpLeft01Icon
  | typeof ArrowUp01Icon
  | typeof ArrowUpRight01Icon
  | typeof ArrowLeft01Icon
  | typeof ArrowAllDirectionIcon
  | typeof ArrowRight01Icon
  | typeof ArrowDownLeft01Icon
  | typeof ArrowDown01Icon
  | typeof ArrowDownRight01Icon
> = {
  "top-left": ArrowUpLeft01Icon,
  "top-center": ArrowUp01Icon,
  "top-right": ArrowUpRight01Icon,
  "center-left": ArrowLeft01Icon,
  center: ArrowAllDirectionIcon,
  "center-right": ArrowRight01Icon,
  "bottom-left": ArrowDownLeft01Icon,
  "bottom-center": ArrowDown01Icon,
  "bottom-right": ArrowDownRight01Icon,
}

export default function App() {
  const [config, setConfig] = useState<TunerConfig>(DEFAULT_TUNER_CONFIG)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      const loaded = await getTunerConfig()
      setConfig(loaded)
    }
    loadConfig()
  }, [])

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

  const handleGridVisible = async (gridVisible: boolean) => {
    setConfig((c) => ({ ...c, gridVisible }))
    await setGridVisible(gridVisible)
  }

  const handlePreview = async () => {
    const webUrl = import.meta.env.VITE_WEB_URL
    const configParams = new URLSearchParams({
      aspectRatio: config.aspectRatio,
      zoom: config.zoom.toString(),
      align: config.align,
      gridVisible: config.gridVisible.toString(),
    })
    const previewUrl = `${webUrl}/preview?${configParams.toString()}`
    await browser.tabs.create({ url: previewUrl })
  }

  const handleApply = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    window.close()
  }

  return (
    <div className="flex w-[400px] flex-col gap-4 bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h1 className="text-lg font-semibold">CamTuner</h1>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handlePreview}
          className="text-primary"
        >
          <HugeiconsIcon icon={EyeIcon} size={18} />
        </Button>
      </div>

      {/* Aspect Ratio Control */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          Aspect Ratio
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {ASPECT_RATIO_OPTIONS.map((ratio) => (
            <Button
              key={ratio}
              variant={config.aspectRatio === ratio ? "default" : "outline"}
              size="sm"
              onClick={() => handleAspectRatio(ratio)}
            >
              {ratio}
            </Button>
          ))}
        </div>
      </div>

      {/* Zoom Control */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Zoom
          </Label>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
            {config.zoom.toFixed(1)}x
          </span>
        </div>
        <Slider
          min={1}
          max={3}
          step={0.1}
          value={[config.zoom]}
          onValueChange={(values) => handleZoom(values[0] ?? 1)}
          className="w-full"
        />
        <div className="flex items-center justify-between text-[10px] font-medium text-neutral-600">
          <button
            onClick={() => handleZoom(1)}
            className="hover:text-neutral-900"
          >
            1x
          </button>
          <button
            onClick={() => handleZoom(2)}
            className="hover:text-neutral-900"
          >
            2x
          </button>
          <button
            onClick={() => handleZoom(3)}
            className="hover:text-neutral-900"
          >
            3x
          </button>
        </div>
      </div>

      {/* Align Control */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          Align
        </Label>
        <div className="grid w-full grid-cols-3 gap-2">
          {ALIGN_OPTIONS.map((pos) => {
            const isSelected = config.align === pos
            return (
              <Button
                key={pos}
                variant={isSelected ? "default" : "outline"}
                size="icon-sm"
                onClick={() => handleAlign(pos)}
                aria-label={`Align ${pos}`}
              >
                <HugeiconsIcon icon={ALIGN_ICONS[pos]} size={16} />
              </Button>
            )
          })}
        </div>
      </div>

      {/* Grid Toggle */}
      <div className="flex flex-col gap-3">
        <Label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          Grid & Align
        </Label>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HugeiconsIcon
              icon={Refresh01Icon}
              size={18}
              className="text-muted-foreground"
            />
            <span className="text-sm font-medium">Rule of Thirds</span>
          </div>
          <Switch
            checked={config.gridVisible}
            onCheckedChange={handleGridVisible}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-2 flex flex-col gap-2 border-t pt-4">
        <Button size="lg" onClick={handleApply} disabled={isSaving}>
          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} />
          {isSaving ? "Applying..." : "Apply"}
        </Button>
      </div>
    </div>
  )
}
