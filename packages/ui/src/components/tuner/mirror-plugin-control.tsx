"use client"

import type { PluginUIProps } from "@workspace/stream-config"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"

export const MirrorPluginControl = ({
  config,
  onConfigChange,
}: PluginUIProps) => (
  <div className="flex items-center justify-between gap-4">
    <Label className="text-xs font-semibold tracking-wider uppercase">
      Mirror
    </Label>
    <Switch
      checked={config.mirror}
      onCheckedChange={(v: boolean) => onConfigChange({ mirror: v })}
      aria-label="Flip output horizontally"
    />
  </div>
)
