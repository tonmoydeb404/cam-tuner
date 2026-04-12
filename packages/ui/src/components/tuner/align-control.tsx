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
          const Icon = ALIGN_ICONS[pos]
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
  )
}
