import type { ZoomMode } from "@workspace/stream-config"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Slider } from "@workspace/ui/components/slider"
import { cn } from "@workspace/ui/lib/utils"

type Props = {
  /** Current fixed zoom value (1–3). Used in "fixed" mode. */
  value: number
  onChange: (value: number) => void
  /** Zoom mode toggle. When omitted, only the fixed slider is rendered. */
  mode?: ZoomMode
  onModeChange?: (mode: ZoomMode) => void
  /** Auto-zoom bounds (only relevant in "auto" mode). */
  autoZoomMin?: number
  onAutoZoomMinChange?: (value: number) => void
  autoZoomMax?: number
  onAutoZoomMaxChange?: (value: number) => void
}

const FIXED_MIN = 1
const FIXED_MAX = 3
const AUTO_MIN_FLOOR = 1
const AUTO_MIN_CEIL = 2
const AUTO_MAX_FLOOR = 1.5
const AUTO_MAX_CEIL = 3

export const ZoomControl = ({
  value,
  onChange,
  mode,
  onModeChange,
  autoZoomMin,
  onAutoZoomMinChange,
  autoZoomMax,
  onAutoZoomMaxChange,
}: Props) => {
  const isAuto = mode === "auto"
  const min = autoZoomMin ?? AUTO_MIN_FLOOR
  const max = autoZoomMax ?? AUTO_MAX_CEIL

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold tracking-wider uppercase">
          Zoom
        </Label>
        <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
          {isAuto
            ? `${min.toFixed(1)}–${max.toFixed(1)}x`
            : `${value.toFixed(1)}x`}
        </span>
      </div>

      {/* Auto / Fixed toggle (only when the mode is controllable) */}
      {onModeChange && (
        <div className="grid grid-cols-2 gap-1 rounded-md bg-muted p-1">
          <Button
            type="button"
            size="xs"
            variant={!isAuto ? "default" : "ghost"}
            onClick={() => onModeChange("fixed")}
            className={cn(!isAuto && "shadow-sm")}
          >
            Fixed
          </Button>
          <Button
            type="button"
            size="xs"
            variant={isAuto ? "default" : "ghost"}
            onClick={() => onModeChange("auto")}
            className={cn(isAuto && "shadow-sm")}
          >
            Auto
          </Button>
        </div>
      )}

      {isAuto ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-medium text-muted-foreground">
                Min
              </Label>
              <span className="font-mono text-xs text-muted-foreground">
                {min.toFixed(1)}x
              </span>
            </div>
            <Slider
              min={AUTO_MIN_FLOOR}
              max={AUTO_MIN_CEIL}
              step={0.1}
              value={[min]}
              onValueChange={(values) =>
                onAutoZoomMinChange?.(Array.isArray(values) ? (values[0] ?? 1) : values)
              }
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-medium text-muted-foreground">
                Max
              </Label>
              <span className="font-mono text-xs text-muted-foreground">
                {max.toFixed(1)}x
              </span>
            </div>
            <Slider
              min={AUTO_MAX_FLOOR}
              max={AUTO_MAX_CEIL}
              step={0.1}
              value={[max]}
              onValueChange={(values) =>
                onAutoZoomMaxChange?.(Array.isArray(values) ? (values[0] ?? 2.5) : values)
              }
              className="w-full"
            />
          </div>
        </div>
      ) : (
        <Slider
          min={FIXED_MIN}
          max={FIXED_MAX}
          step={0.1}
          value={[value]}
          onValueChange={(values) =>
            onChange(Array.isArray(values) ? (values[0] ?? 1) : values)
          }
          className="w-full **:data-[slot=slider-track]:bg-gray-300 dark:**:data-[slot=slider-track]:bg-muted"
        />
      )}
    </div>
  )
}
