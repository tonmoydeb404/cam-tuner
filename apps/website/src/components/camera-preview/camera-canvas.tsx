"use client";

import { Video } from "lucide-react";
import { CameraCanvasProps } from "./types";

export function CameraCanvas({
  videoRef,
  canvasRef,
  isStreamActive,
  isLoading,
  error,
}: CameraCanvasProps) {
  return (
    <div className="relative">
      {/* Empty State */}
      {!isStreamActive && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Video className="size-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Camera preview stopped</p>
            <p className="text-xs mt-1">
              Click &quot;Start Preview&quot; to begin
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-3"></div>
            <p>Loading camera...</p>
          </div>
        </div>
      )}

      {/* Hidden video element for stream */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />

      {/* Canvas with applied effects */}
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg bg-black aspect-video"
      />
    </div>
  );
}
