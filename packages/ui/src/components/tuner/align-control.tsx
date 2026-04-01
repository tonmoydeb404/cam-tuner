import {
  ArrowAllDirectionIcon,
  ArrowDown01Icon,
  ArrowDownLeft01Icon,
  ArrowDownRight01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowUpLeft01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { AlignPosition } from "@workspace/stream-config"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"

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

const ALIGN_ICONS: Record<AlignPosition, typeof ArrowUpLeft01Icon> = {
  "top-left": ArrowUpLeft01Icon,
  "top-center": ArrowUp01Icon,
  "top-right": ArrowUpRight01Icon,
  "center-left": ArrowLeft01Icon,
  center: ArrowAllDirectionIcon,
  "center-right": ArrowRight01Icon,
  "bottom-left": ArrowDownLeft01Icon,
  "bottom-center": ArrowDown01Icon,
  "bottom-right": ArrowDownRight01Icon,
}

type Props = {
  value: AlignPosition
  onChange: (value: AlignPosition) => void
  size?: "default" | "icon-sm"
}

export const AlignControl = ({ value, onChange, size = "default" }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
        Align
      </Label>
      <div className="grid w-full grid-cols-3 gap-2">
        {ALIGN_OPTIONS.map((pos: AlignPosition) => {
          const isSelected = value === pos
          return (
            <Button
              key={pos}
              variant={isSelected ? "default" : "outline"}
              size={size}
              onClick={() => onChange(pos)}
              aria-label={`Align ${pos}`}
            >
              <HugeiconsIcon
                icon={ALIGN_ICONS[pos]}
                strokeWidth={2}
                className={size === "default" ? "size-4" : "size-3"}
              />
            </Button>
          )
        })}
      </div>
    </div>
  )
}
