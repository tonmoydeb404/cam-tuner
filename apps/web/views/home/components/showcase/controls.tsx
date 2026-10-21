"use client"

import type { UseTunerReturn } from "@/hooks/use-tuner"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { AlignPluginControl } from "@workspace/ui/components/tuner/align-plugin-control"
import { AspectRatioControl } from "@workspace/ui/components/tuner/aspect-ratio-control"
import { BackgroundFilterControl } from "@workspace/ui/components/tuner/background-filter-control"
import { ZoomControl } from "@workspace/ui/components/tuner/zoom-control"

interface ControlProps {
  tuner: UseTunerReturn
}

const ToggleRow = ({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
}) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex flex-col gap-1">
      <Label className="text-sm font-medium">{label}</Label>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
    <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
  </div>
)

export const FrameControls = ({ tuner }: ControlProps) => {
  const letterbox = tuner.config.letterbox ?? true
  const barColor = tuner.config.barColor || "#000000"

  return (
    <div className="flex flex-col gap-5">
      <AspectRatioControl
        value={tuner.config.aspectRatio}
        onChange={tuner.setAspectRatio}
      />
      <ToggleRow
        label="Letterbox"
        hint={letterbox ? "Pad cropped area with bars" : "Crop to exact size"}
        checked={letterbox}
        onChange={tuner.setLetterbox}
      />
      {letterbox && (
        <div className="flex items-center justify-between gap-4">
          <Label className="text-sm font-medium">Bar color</Label>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={barColor}
              onChange={(e) => tuner.setBarColor(e.target.value)}
              aria-label="Letterbox bar color"
              className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <span className="font-mono text-xs text-muted-foreground">
              {barColor}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export const ZoomControls = ({ tuner }: ControlProps) => (
  <ZoomControl
    value={tuner.config.zoom}
    onChange={tuner.setZoom}
    mode={tuner.config.zoomMode ?? "fixed"}
    onModeChange={tuner.setZoomMode}
    autoZoomMin={tuner.config.autoZoomMin ?? 1}
    onAutoZoomMinChange={tuner.setAutoZoomMin}
    autoZoomMax={tuner.config.autoZoomMax ?? 2.5}
    onAutoZoomMaxChange={tuner.setAutoZoomMax}
  />
)

// Same control as the extension popup: Fixed/Auto toggle, Auto = Center Stage.
export const AlignControls = ({ tuner }: ControlProps) => (
  <AlignPluginControl
    config={tuner.config}
    onConfigChange={tuner.updateConfig}
  />
)

export const BackgroundControls = ({ tuner }: ControlProps) => (
  <BackgroundFilterControl
    config={tuner.config}
    onConfigChange={tuner.updateConfig}
  />
)

export const FlipControls = ({ tuner }: ControlProps) => (
  <div className="flex flex-col gap-5">
    <ToggleRow
      label="Mirror"
      hint="Flip horizontally"
      checked={tuner.config.mirror}
      onChange={tuner.setMirror}
    />
    <ToggleRow
      label="Flip vertical"
      hint="Turn upside down"
      checked={tuner.config.flipVertical ?? false}
      onChange={tuner.setFlipVertical}
    />
  </div>
)
