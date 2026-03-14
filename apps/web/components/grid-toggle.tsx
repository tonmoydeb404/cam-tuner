"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { GridIcon } from "@hugeicons/core-free-icons"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"

interface GridToggleProps {
  value: boolean
  onChange: (value: boolean) => void
}

export function GridToggle({ value, onChange }: GridToggleProps) {
  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
        Grid & Align
      </Label>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HugeiconsIcon
            icon={GridIcon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
          />
          <span className="text-sm font-medium">Rule of Thirds</span>
        </div>
        <Switch checked={value} onCheckedChange={onChange} />
      </div>
    </div>
  )
}
