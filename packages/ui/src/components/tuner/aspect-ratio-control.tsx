import type { AspectRatio } from "@workspace/stream-config"
import { ASPECT_RATIO_OPTIONS } from "@workspace/stream-config"
import { Button } from "@workspace/ui/components/button"

type Props = {
  value: AspectRatio
  onChange: (value: AspectRatio) => void
  size?: "default" | "sm"
}

export const AspectRatioControl = ({
  value,
  onChange,
  size = "default",
}: Props) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ASPECT_RATIO_OPTIONS.map((ratio: AspectRatio) => (
        <Button
          key={ratio}
          variant={value === ratio ? "default" : "outline"}
          size={size}
          onClick={() => onChange(ratio)}
        >
          {ratio}
        </Button>
      ))}
    </div>
  )
}
