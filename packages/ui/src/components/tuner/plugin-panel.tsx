"use client"

import { PLUGIN_REGISTRY, type PluginUIProps } from "@workspace/stream-config"
import type { ComponentType } from "react"
import { PLUGIN_UI_REGISTRY } from "@workspace/ui/components/tuner/plugin-ui-registry"

export interface PluginPanelProps extends PluginUIProps {
  /** Extra props to spread into specific plugin UI components (e.g. upload handlers). */
  extraProps?: Record<string, Record<string, unknown>>
}

export const PluginPanel = ({
  config,
  onConfigChange,
  extraProps,
}: PluginPanelProps) => {
  const sorted = [...PLUGIN_REGISTRY].sort((a, b) => a.order - b.order)

  return (
    <>
      {sorted.map((manifest) => {
        const Component = PLUGIN_UI_REGISTRY[manifest.id] as
          | ComponentType<PluginUIProps>
          | undefined
        if (!Component) return null
        return (
          <Component
            key={manifest.id}
            config={config}
            onConfigChange={onConfigChange}
            {...(extraProps?.[manifest.id] ?? {})}
          />
        )
      })}
    </>
  )
}
