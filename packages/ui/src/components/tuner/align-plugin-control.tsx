"use client"

import type { AlignPosition, PluginUIProps } from "@workspace/stream-config"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { AlignControl } from "@workspace/ui/components/tuner/align-control"

export const AlignPluginControl = ({
  config,
  onConfigChange,
  options,
}: PluginUIProps) => (
  <>
    <AlignControl
      value={config.align}
      onChange={(v: AlignPosition) => onConfigChange({ align: v })}
    />

    {!options?.disableAuto && (
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
    )}
  </>
)
