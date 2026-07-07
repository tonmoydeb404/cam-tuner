import {
  IconArrowDown,
  IconArrowDownLeft,
  IconArrowDownRight,
  IconArrowLeft,
  IconArrowRight,
  IconArrowsMove,
  IconArrowUp,
  IconArrowUpLeft,
  IconArrowUpRight,
  IconTypeface,
} from "@tabler/icons-react"
import type { AlignPosition } from "@workspace/stream-config"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"

const ALIGN_OPTIONS: AlignPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "center-left",
  "center",
  "center-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
]

const ALIGN_ICONS: Record<AlignPosition, typeof IconTypeface> = {
  "top-left": IconArrowUpLeft,
  "top-center": IconArrowUp,
  "top-right": IconArrowUpRight,
  "center-left": IconArrowLeft,
  center: IconArrowsMove,
  "center-right": IconArrowRight,
  "bottom-left": IconArrowDownLeft,
  "bottom-center": IconArrowDown,
  "bottom-right": IconArrowDownRight,
}

type Props = {
  value: AlignPosition
  onChange: (value: AlignPosition) => void
  size?: "default" | "icon-sm"
  isAuto?: boolean
  onModeChange?: (mode: "auto" | "fixed") => void
}

export const AlignControl = ({
  value,
  onChange,
  size = "default",
  isAuto,
  onModeChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-semibold tracking-wider uppercase">
        Align
      </Label>

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

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-in-out",
          isAuto ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid w-full grid-cols-3 gap-2 pb-0.5">
            {ALIGN_OPTIONS.map((pos: AlignPosition) => {
              const isSelected = value === pos
              const Icon = ALIGN_ICONS[pos] ?? IconArrowsMove
              return (
                <Button
                  key={pos}
                  variant={isSelected ? "default" : "outline"}
                  size={size}
                  onClick={() => onChange(pos)}
                  aria-label={`Align ${pos}`}
                >
                  <Icon
                    strokeWidth={2}
                    className={size === "default" ? "size-4" : "size-3"}
                  />
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
