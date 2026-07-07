"use client"

import { IconUpload, IconX } from "@tabler/icons-react"
import type { BackgroundMode, PluginUIProps } from "@workspace/stream-config"
import { BACKGROUND_PRESETS } from "@workspace/stream-config"
import { Button } from "@workspace/ui/components/button"
import { Label } from "@workspace/ui/components/label"
import { Slider } from "@workspace/ui/components/slider"
import { cn } from "@workspace/ui/lib/utils"
import { useRef } from "react"

export interface BackgroundFilterControlProps extends PluginUIProps {
  presets?: typeof BACKGROUND_PRESETS
  uploads?: Array<{ id: string; name: string; thumb: string }>
  onUpload?: (file: File) => void
  onRemoveUpload?: (id: string) => void
}

const MODES: Array<{ value: BackgroundMode; label: string }> = [
  { value: "none", label: "None" },
  { value: "blur", label: "Blur" },
  { value: "image", label: "Image" },
]

export const BackgroundFilterControl = ({
  config,
  onConfigChange,
  options,
  presets = BACKGROUND_PRESETS,
  uploads = [],
  onUpload,
  onRemoveUpload,
}: BackgroundFilterControlProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mode = config.backgroundMode ?? "none"
  const blurAmount = config.blurStrength ?? 14
  const activeImage = config.backgroundImage

  const visibleModes = MODES.filter((m) => {
    if (m.value === "blur" && options?.disableBlur) return false
    if (m.value === "image" && options?.disableImage) return false
    return true
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold tracking-wider uppercase">
          Background
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {visibleModes.map((m) => (
            <Button
              key={m.value}
              size="sm"
              variant={mode === m.value ? "default" : "outline"}
              onClick={() => {
                const patch: Partial<typeof config> = {
                  backgroundMode: m.value,
                }
                if (m.value === "image" && !activeImage && presets[0]) {
                  patch.backgroundImage = presets[0].id
                }
                onConfigChange(patch)
              }}
            >
              {m.label}
            </Button>
          ))}
        </div>
      </div>

      {mode === "blur" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Blur intensity
            </Label>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
              {Math.round(blurAmount)}px
            </span>
          </div>
          <Slider
            min={4}
            max={40}
            step={1}
            value={[blurAmount]}
            onValueChange={(values) =>
              onConfigChange({
                blurStrength: Array.isArray(values)
                  ? (values[0] ?? 14)
                  : values,
              })
            }
          />
        </div>
      )}

      {mode === "image" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Choose image
            </Label>
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

          <div className="flex gap-2 overflow-x-auto pb-1">
            {presets.map((preset) => (
              <Thumb
                key={preset.id}
                src={preset.thumb}
                label={preset.label}
                active={activeImage === preset.id}
                onClick={() => onConfigChange({ backgroundImage: preset.id })}
              />
            ))}
            {uploads.map((upload) => (
              <Thumb
                key={upload.id}
                src={upload.thumb}
                label={upload.name}
                active={activeImage === upload.id}
                onClick={() => onConfigChange({ backgroundImage: upload.id })}
                onRemove={
                  onRemoveUpload ? () => onRemoveUpload(upload.id) : undefined
                }
              />
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
          className="absolute top-0.5 right-0.5 rounded bg-background/80 p-0.5 text-foreground hover:bg-background"
        >
          <IconX size={11} />
        </span>
      )}
    </button>
  )
}
