"use client";

import { CameraCanvas } from "./camera-canvas";
import { CameraControls } from "./camera-controls";
import { CameraPreviewProps } from "./types";
import { useCanvasRenderer } from "./use-canvas-renderer";
import { useCameraDevices } from "./use-camera-devices";
import { useCameraStream } from "./use-camera-stream";

function CameraPreview({
  className = "",
  onStreamReady,
  facingMode = "user",
}: CameraPreviewProps) {
  // Get available camera devices
  const { devices, selectedDeviceId, setSelectedDeviceId } =
    useCameraDevices();

  // Manage camera stream
  const { videoRef, error, isLoading, isStreamActive, startCamera, stopCamera } =
    useCameraStream({
      selectedDeviceId,
      facingMode,
      onStreamReady,
    });

  // Render canvas with effects
  const canvasRef = useCanvasRenderer(videoRef);

  return (
    <div className={`camera-preview-container relative ${className}`}>
      <CameraControls
        devices={devices}
        selectedDeviceId={selectedDeviceId}
        isStreamActive={isStreamActive}
        isLoading={isLoading}
        error={error}
        onDeviceChange={setSelectedDeviceId}
        onStart={startCamera}
        onStop={stopCamera}
      />

      <CameraCanvas
        videoRef={videoRef}
        canvasRef={canvasRef}
        isStreamActive={isStreamActive}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default CameraPreview;
