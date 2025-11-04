"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Video, VideoOff } from "lucide-react";
import { CameraControlsProps } from "./types";

export function CameraControls({
  devices,
  selectedDeviceId,
  isStreamActive,
  isLoading,
  error,
  onDeviceChange,
  onStart,
  onStop,
}: CameraControlsProps) {
  return (
    <div className="mb-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Camera Source Selection */}
        <div className="flex-1 min-w-[200px]">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Camera className="size-4" />
            Camera Source
          </label>
          <Select
            value={selectedDeviceId}
            onValueChange={onDeviceChange}
            disabled={devices.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select camera..." />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem
                  key={device.label}
                  value={device.label || "default"}
                >
                  {device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start/Stop Controls */}
        <div className="flex items-end gap-2">
          {!isStreamActive ? (
            <Button
              onClick={onStart}
              disabled={!selectedDeviceId || isLoading}
              className="gap-2"
            >
              <Video className="size-4" />
              {isLoading ? "Starting..." : "Start Preview"}
            </Button>
          ) : (
            <Button onClick={onStop} variant="destructive" className="gap-2">
              <VideoOff className="size-4" />
              Stop Preview
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-200">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}
    </div>
  );
}
