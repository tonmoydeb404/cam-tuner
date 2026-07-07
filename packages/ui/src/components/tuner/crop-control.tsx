"use client"

import type { AspectRatio, PluginUIProps } from "@workspace/stream-config"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { AspectRatioControl } from "@workspace/ui/components/tuner/aspect-ratio-control"

export const CropControl = ({
  config,
  onConfigChange,
  options,
}: PluginUIProps) => (
  <>
    <div className="flex flex-col gap-3">
      <Label className="text-xs font-semibold tracking-wider uppercase">
        Aspect Ratio
      </Label>
      <AspectRatioControl
        value={config.aspectRatio}
        onChange={(v: AspectRatio) => onConfigChange({ aspectRatio: v })}
      />
    </div>

    {!options?.disableLetterbox && (
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-semibold tracking-wider uppercase">
            Letterbox
          </Label>
          <span className="text-xs text-muted-foreground">
            {(config.letterbox ?? true)
              ? "Pad cropped area with bars"
              : "Crop to exact size, no bars"}
          </span>
        </div>
        <Switch
          checked={config.letterbox ?? true}
          onCheckedChange={(v: boolean) => onConfigChange({ letterbox: v })}
          aria-label="Toggle letterbox bars"
        />
      </div>
    )}

    {!options?.disableLetterbox && (config.letterbox ?? true) ? (
      <div className="flex items-center justify-between gap-4">
        <Label className="text-xs font-semibold tracking-wider uppercase">
          Bar Color
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={config.barColor || "#000000"}
            onChange={(e) => onConfigChange({ barColor: e.target.value })}
            aria-label="Letterbox bar color picker"
            className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
          />
          <span className="text-xs text-muted-foreground">
            {config.barColor || "#000000"}
          </span>
        </div>
      </div>
    ) : null}
  </>
)
