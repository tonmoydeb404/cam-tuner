"use client"

import type { AlignPosition, PluginUIProps } from "@workspace/stream-config"
import { AlignControl } from "@workspace/ui/components/tuner/align-control"

export const AlignPluginControl = ({
  config,
  onConfigChange,
  options,
}: PluginUIProps) => (
  <AlignControl
    value={config.align}
    onChange={(v: AlignPosition) => onConfigChange({ align: v })}
    {...(!options?.disableAuto && {
      isAuto: config.centerStageEnabled === true,
      onModeChange: (mode: "auto" | "fixed") =>
        onConfigChange({ centerStageEnabled: mode === "auto" }),
    })}
  />
)
