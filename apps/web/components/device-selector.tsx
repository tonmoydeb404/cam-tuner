import { VideoDevice } from "@/hooks/use-webcam";

interface DeviceSelectorProps {
  devices: VideoDevice[];
  selectedDeviceId: string;
  onChange: (deviceId: string) => void;
}

export function DeviceSelector({
  devices,
  selectedDeviceId,
  onChange,
}: DeviceSelectorProps) {
  if (devices.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Camera
      </label>
      <div className="relative">
        <select
          value={selectedDeviceId}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-neutral-950 border border-white/5 text-neutral-300 text-sm font-medium rounded-2xl py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow focus:border-indigo-500 shadow-sm"
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
