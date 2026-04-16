import { Label } from "@workspace/ui/components/label"
import { Slider } from "@workspace/ui/components/slider"

type Props = {
  value: number
  onChange: (value: number) => void
}

export const ZoomControl = ({ value, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold tracking-wider uppercase">
          Zoom
        </Label>
        <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
          {value.toFixed(1)}x
        </span>
      </div>
      <Slider
        min={1}
        max={3}
        step={0.1}
        value={[value]}
        onValueChange={(values) =>
          onChange(Array.isArray(values) ? (values[0] ?? 1) : values)
        }
        className="w-full **:data-[slot=slider-track]:bg-gray-300 dark:**:data-[slot=slider-track]:bg-muted"
      />
    </div>
  )
}
