"use client"

import type {
  BackgroundConfig,
  BackgroundMode,
  BackgroundQuality,
} from "@workspace/stream-config"
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Slider } from "@workspace/ui/components/slider"
import { useRef } from "react"
import { cn } from "@workspace/ui/lib/utils"

export type BackgroundPreset = { id: string; label: string; thumb: string }
export type BackgroundUpload = { id: string; name: string; thumb: string }

export interface BackgroundControlProps {
  background: BackgroundConfig
  onChange: (partial: Partial<BackgroundConfig>) => void
  /** Preset gallery entries (id must be the same id passed to resolveImage). */
  presets?: BackgroundPreset[]
  /** User-uploaded images, for the gallery thumbnails + removal. */
  uploads?: BackgroundUpload[]
  onUpload?: (file: File) => void
  onRemoveUpload?: (id: string) => void
}

const MODES: Array<{ value: BackgroundMode; label: string }> = [
  { value: "none", label: "None" },
  { value: "blur", label: "Blur" },
  { value: "image", label: "Image" },
]

const QUALITIES: Array<{ value: BackgroundQuality; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "high", label: "High" },
  { value: "performance", label: "Perf" },
]

export const BackgroundControl = ({
  background,
  onChange,
  presets = [],
  uploads = [],
  onUpload,
  onRemoveUpload,
}: BackgroundControlProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeImage = background.imageId

  return (
    <div className="flex flex-col gap-3">
      {/* Mode segmented control */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold tracking-wider uppercase">
          Background
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((mode) => (
            <Button
              key={mode.value}
              size="sm"
              variant={background.mode === mode.value ? "default" : "outline"}
              onClick={() => {
                const patch: Partial<BackgroundConfig> = { mode: mode.value }
                // Default to the first preset when entering image mode.
                if (mode.value === "image" && !activeImage && presets[0]) {
                  patch.imageId = presets[0].id
                }
                onChange(patch)
              }}
            >
              {mode.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Blur amount */}
      {background.mode === "blur" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Blur intensity
            </Label>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
              {Math.round(background.blurAmount)}px
            </span>
          </div>
          <Slider
            min={4}
            max={40}
            step={1}
            value={[background.blurAmount]}
            onValueChange={(values) =>
              onChange({
                blurAmount: Array.isArray(values) ? (values[0] ?? 14) : values,
              })
            }
          />
        </div>
      )}

      {/* Image gallery */}
      {background.mode === "image" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Choose image</Label>
            {onUpload && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) onUpload(file)
                    e.target.value = ""
                  }}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 px-2 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IconUpload size={13} />
                  Upload
                </Button>
              </>
            )}
          </div>

          {(presets.length > 0 || uploads.length > 0) && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {presets.map((preset) => (
                <Thumb
                  key={preset.id}
                  src={preset.thumb}
                  label={preset.label}
                  active={activeImage === preset.id}
                  onClick={() => onChange({ imageId: preset.id })}
                />
              ))}
              {uploads.map((upload) => (
                <Thumb
                  key={upload.id}
                  src={upload.thumb}
                  label={upload.name}
                  active={activeImage === upload.id}
                  onClick={() => onChange({ imageId: upload.id })}
                  onRemove={
                    onRemoveUpload
                      ? () => onRemoveUpload(upload.id)
                      : undefined
                  }
                />
              ))}
            </div>
          )}
          {presets.length === 0 && uploads.length === 0 && (
            <div className="flex items-center gap-2 rounded-md border border-dashed p-3 text-xs text-muted-foreground">
              <IconPhoto size={16} />
              No images yet — upload one to get started.
            </div>
          )}
        </div>
      )}

      {/* Quality (only meaningful while an effect is active) */}
      {background.mode !== "none" && (
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">Quality</Label>
          <div className="grid grid-cols-3 gap-2">
            {QUALITIES.map((q) => (
              <Button
                key={q.value}
                size="sm"
                variant={background.quality === q.value ? "default" : "outline"}
                className="text-xs"
                onClick={() => onChange({ quality: q.value })}
              >
                {q.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Thumb({
  src,
  label,
  active,
  onClick,
  onRemove,
}: {
  src: string
  label: string
  active: boolean
  onClick: () => void
  onRemove?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "relative h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 transition",
        active ? "border-primary" : "border-transparent hover:border-muted"
      )}
    >
      <img
        src={src}
        alt={label}
        className="h-full w-full object-cover"
        draggable={false}
      />
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation()
              onRemove()
            }
          }}
          className="absolute right-0.5 top-0.5 rounded bg-background/80 p-0.5 text-foreground hover:bg-background"
        >
          <IconX size={11} />
        </span>
      )}
    </button>
  )
}
