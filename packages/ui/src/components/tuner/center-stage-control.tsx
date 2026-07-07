"use client"

import type { PluginUIProps } from "@workspace/stream-config"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"

export const CenterStageControl = ({
  config,
  onConfigChange,
}: PluginUIProps) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex flex-col gap-1">
      <Label className="text-xs font-semibold tracking-wider uppercase">
        Center Stage
      </Label>
      <span className="text-xs text-muted-foreground">
        Auto-frames to keep faces centered
      </span>
    </div>
    <Switch
      checked={config.centerStageEnabled === true}
      onCheckedChange={(v: boolean) =>
        onConfigChange({ centerStageEnabled: v })
      }
      aria-label="Toggle Center Stage face tracking"
    />
  </div>
)
