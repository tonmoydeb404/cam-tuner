import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useMemo } from "react"

export interface VideoDevice {
  deviceId: string
  label: string
}

export interface CameraSourceSelectProps {
  devices: VideoDevice[]
  selectedDeviceId: string
  onDeviceChange: (deviceId: string) => void
  placeholder?: string
}

/**
 * Camera source dropdown. Shared between the web home demo and
 * the web preview sidebar. The extension popup doesn't use this
 * (no device enumeration in popup context).
 */
export const CameraSourceSelect = (props: CameraSourceSelectProps) => {
  const {
    devices,
    selectedDeviceId,
    onDeviceChange,
    placeholder = "Select camera",
  } = props

  const items = useMemo(() => {
    return devices.map((d) => ({
      value: d.deviceId,
      label: d.label || "Unknown Camera",
    }))
  }, [devices])

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs font-semibold tracking-wider uppercase">
        Camera Source
      </Label>
      <Select
        value={selectedDeviceId}
        onValueChange={(v) => v && onDeviceChange(v)}
        items={items}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {devices.length === 0 ? (
            <SelectItem value="__none" disabled>
              No cameras detected
            </SelectItem>
          ) : (
            items.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="text-xs"
              >
                {item.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
