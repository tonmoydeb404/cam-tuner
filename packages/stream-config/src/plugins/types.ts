import type { StreamModifier, StreamPlugin } from "../types"
import type { TunerConfig } from "../tuner-types"

export interface PluginContext {
  modifier: StreamModifier
  adapter?: unknown
  wasmUrl: string | null
}

export interface PluginUIProps {
  config: TunerConfig
  onConfigChange: (update: Partial<TunerConfig>) => void
}

export interface PluginManifest {
  id: string
  label: string
  createPlugin: (context: PluginContext) => StreamPlugin<any>
  configMapper: (config: TunerConfig) => any
  isActive: (config: TunerConfig) => boolean
  configFields: string[]
  adapter?: {
    load: (wasmUrl: string | null) => Promise<unknown>
    destroy?: () => void
  }
  order: number
}
