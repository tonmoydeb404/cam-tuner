import type {
  AlignPosition,
  AspectRatio,
  BackgroundConfig,
  ZoomMode,
} from "@workspace/stream-config"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import {
  type BackgroundPreset,
  type BackgroundUpload,
  BackgroundControl,
} from "@workspace/ui/components/tuner/background-control"
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
  /** Zoom mode: "fixed" (manual) or "auto" (face-driven). Omit to hide the toggle. */
  zoomMode?: ZoomMode
  onZoomModeChange?: (mode: ZoomMode) => void
  /** Auto-zoom bounds (auto mode only) */
  autoZoomMin?: number
  onAutoZoomMinChange?: (value: number) => void
  autoZoomMax?: number
  onAutoZoomMaxChange?: (value: number) => void
  /** Current alignment position */
  align: AlignPosition
  onAlignChange: (value: AlignPosition) => void
  /** Current letterbox bar color (hex) */
  barColor: string
  onBarColorChange: (value: string) => void
  /** Whether to horizontally flip the output */
  mirror: boolean
  onMirrorChange: (value: boolean) => void
  /** Whether to pad the cropped area with bars (letterbox) or output a pure crop */
  letterbox: boolean
  onLetterboxChange: (value: boolean) => void
  /** Whether Center Stage face tracking is enabled (optional — omit to hide) */
  centerStageEnabled?: boolean
  onCenterStageChange?: (value: boolean) => void
  /** Background blur / image-replacement settings (optional — omit to hide) */
  background?: BackgroundConfig
  onBackgroundChange?: (partial: Partial<BackgroundConfig>) => void
  backgroundPresets?: BackgroundPreset[]
  backgroundUploads?: BackgroundUpload[]
  onBackgroundUpload?: (file: File) => void
  onRemoveBackgroundUpload?: (id: string) => void
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
  zoomMode,
  onZoomModeChange,
  autoZoomMin,
  onAutoZoomMinChange,
  autoZoomMax,
  onAutoZoomMaxChange,
  align,
  onAlignChange,
  barColor,
  onBarColorChange,
  mirror,
  onMirrorChange,
  letterbox,
  onLetterboxChange,
  centerStageEnabled,
  onCenterStageChange,
  background,
  onBackgroundChange,
  backgroundPresets,
  backgroundUploads,
  onBackgroundUpload,
  onRemoveBackgroundUpload,
}: TunerControlFieldsProps) => (
  <>
    {/* Center Stage (only when provided) */}
    {centerStageEnabled !== undefined && onCenterStageChange && (
      <>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-semibold tracking-wider uppercase">
              Center Stage
            </Label>
            <span className="text-xs text-muted-foreground">
              Auto-frames to keep faces centered
            </span>
          </div>
          <Switch
            checked={centerStageEnabled}
            onCheckedChange={onCenterStageChange}
            aria-label="Toggle Center Stage face tracking"
          />
        </div>
        <div className="h-px bg-border" />
      </>
    )}

    {/* Background effects (only when provided) */}
    {background && onBackgroundChange && (
      <>
        <BackgroundControl
          background={background}
          onChange={onBackgroundChange}
          presets={backgroundPresets}
          uploads={backgroundUploads}
          onUpload={onBackgroundUpload}
          onRemoveUpload={onRemoveBackgroundUpload}
        />
        <div className="h-px bg-border" />
      </>
    )}

    {/* Aspect Ratio */}
    <div className="flex flex-col gap-3">
      <Label className="text-xs font-semibold tracking-wider uppercase">
        Aspect Ratio
      </Label>
      <AspectRatioControl value={aspectRatio} onChange={onAspectRatioChange} />
    </div>

    {/* Zoom */}
    <ZoomControl
      value={zoom}
      onChange={onZoomChange}
      mode={zoomMode}
      onModeChange={onZoomModeChange}
      autoZoomMin={autoZoomMin}
      onAutoZoomMinChange={onAutoZoomMinChange}
      autoZoomMax={autoZoomMax}
      onAutoZoomMaxChange={onAutoZoomMaxChange}
    />

    {/* Align */}
    <AlignControl value={align} onChange={onAlignChange} />

    {/* Mirror */}
    <div className="flex items-center justify-between gap-4">
      <Label className="text-xs font-semibold tracking-wider uppercase">
        Mirror
      </Label>
      <Switch
        checked={mirror}
        onCheckedChange={onMirrorChange}
        aria-label="Flip output horizontally"
      />
    </div>

    {/* Letterbox toggle */}
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <Label className="text-xs font-semibold tracking-wider uppercase">
          Letterbox
        </Label>
        <span className="text-xs text-muted-foreground">
          {letterbox
            ? "Pad cropped area with bars"
            : "Crop to exact size, no bars"}
        </span>
      </div>
      <Switch
        checked={letterbox}
        onCheckedChange={onLetterboxChange}
        aria-label="Toggle letterbox bars"
      />
    </div>

    {/* Bar Color — only relevant when letterboxing */}
    {letterbox && (
      <div className="flex items-center justify-between gap-4">
        <Label className="text-xs font-semibold tracking-wider uppercase">
          Bar Color
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={barColor || "#000000"}
            onChange={(e) => onBarColorChange(e.target.value)}
            aria-label="Letterbox bar color picker"
            className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
          />
          <span className="text-xs text-muted-foreground">
            {barColor || "#000000"}
          </span>
        </div>
      </div>
    )}
  </>
)
