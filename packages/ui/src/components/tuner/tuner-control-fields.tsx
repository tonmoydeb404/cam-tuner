import type { AlignPosition, AspectRatio } from "@workspace/stream-config"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { AlignControl } from "@workspace/ui/components/tuner/align-control"
import { AspectRatioControl } from "@workspace/ui/components/tuner/aspect-ratio-control"
import { ZoomControl } from "@workspace/ui/components/tuner/zoom-control"

export interface TunerControlFieldsProps {
  /** Current aspect ratio value */
  aspectRatio: AspectRatio
  onAspectRatioChange: (value: AspectRatio) => void
  /** Current zoom value (1–3) */
  zoom: number
  onZoomChange: (value: number) => void
  /** Current alignment position */
  align: AlignPosition
  onAlignChange: (value: AlignPosition) => void
  /** Current letterbox bar color (hex) */
  barColor: string
  onBarColorChange: (value: string) => void
}

/**
 * Renders the complete set of tuner controls: Aspect Ratio, Zoom, Align,
 * and Bar Color. Used by the extension popup, web preview sidebar, and
 * web home demo.
 */
export const TunerControlFields = ({
  aspectRatio,
  onAspectRatioChange,
  zoom,
  onZoomChange,
  align,
  onAlignChange,
  barColor,
  onBarColorChange,
}: TunerControlFieldsProps) => (
  <>
    {/* Aspect Ratio */}
    <div className="flex flex-col gap-3">
      <Label className="text-xs font-semibold tracking-wider uppercase">
        Aspect Ratio
      </Label>
      <AspectRatioControl value={aspectRatio} onChange={onAspectRatioChange} />
    </div>

    {/* Zoom */}
    <ZoomControl value={zoom} onChange={onZoomChange} />

    {/* Align */}
    <AlignControl value={align} onChange={onAlignChange} />

    {/* Bar Color */}
    <div className="flex flex-col gap-3">
      <Label className="text-xs font-semibold tracking-wider uppercase">
        Bar Color
      </Label>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={barColor || "#000000"}
          onChange={(e) => onBarColorChange(e.target.value)}
          aria-label="Letterbox bar color picker"
          className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
        />
        <span className="text-xs text-muted-foreground">
          {barColor || "#000000"}
        </span>
      </div>
    </div>
  </>
)
