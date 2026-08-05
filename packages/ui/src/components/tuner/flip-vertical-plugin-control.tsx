"use client"

import type { PluginUIProps } from "@workspace/stream-config"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"

export const FlipVerticalPluginControl = ({
  config,
  onConfigChange,
}: PluginUIProps) => (
  <div className="flex items-center justify-between gap-4">
    <Label className="text-xs font-semibold tracking-wider uppercase">
      Flip Vertical
    </Label>
    <Switch
      checked={config.flipVertical ?? false}
      onCheckedChange={(v: boolean) => onConfigChange({ flipVertical: v })}
      aria-label="Flip output vertically"
    />
  </div>
)
