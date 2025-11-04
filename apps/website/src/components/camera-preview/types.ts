export interface CameraPreviewProps {
  width?: number;
  height?: number;
  className?: string;
  onStreamReady?: (stream: MediaStream) => void;
  facingMode?: "user" | "environment";
}

export interface CameraControlsProps {
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  isStreamActive: boolean;
  isLoading: boolean;
  error: string | null;
  onDeviceChange: (deviceId: string) => void;
  onStart: () => void;
  onStop: () => void;
}

export interface CameraCanvasProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isStreamActive: boolean;
  isLoading: boolean;
  error: string | null;
}
