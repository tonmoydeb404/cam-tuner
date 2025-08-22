import { useAppContext } from "@/context/app";
import useMediaStream from "@/hooks/use-media-stream";
import useStreamPatcher from "@/hooks/use-stream-patcher";
import useFloatingPreview from "@/hooks/use-floating-preview";
import { X, Minimize2, Maximize2, Move, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface FloatingPreviewProps {
  onClose: () => void;
}

export function FloatingPreview({ onClose }: FloatingPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { cameraSource, config } = useAppContext();
  const { stream, error, loading, size } = useMediaStream(
    cameraSource?.deviceId ?? null
  );
  const patchedStream = useStreamPatcher(stream, size, config);
  const floatingPreview = useFloatingPreview();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (videoRef.current && patchedStream) {
      videoRef.current.srcObject = patchedStream;
    }
  }, [patchedStream]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep window within screen bounds
      const maxX = window.innerWidth - floatingPreview.size.width;
      const maxY = window.innerHeight - floatingPreview.size.height;
      
      const newPosition = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      };
      
      floatingPreview.updatePosition(newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, floatingPreview]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleMinimize = () => {
    floatingPreview.toggleMinimize();
  };

  const handleResetPosition = () => {
    floatingPreview.resetPosition();
  };

  if (!cameraSource) return null;

  const floatingWindow = (
    <div
      ref={containerRef}
      className="floating-preview-window fixed z-[9999] bg-background border border-border rounded-lg shadow-2xl overflow-hidden transition-all duration-200"
      style={{
        left: `${floatingPreview.position.x}px`,
        top: `${floatingPreview.position.y}px`,
        width: floatingPreview.isMinimized ? '200px' : `${floatingPreview.size.width}px`,
        height: floatingPreview.isMinimized ? '40px' : `${floatingPreview.size.height + 40}px`,
      }}
    >
      {/* Header Bar */}
      <div
        className="h-10 bg-muted/50 border-b border-border flex items-center justify-between px-3 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Move className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            {floatingPreview.isMinimized ? 'CamTuner Preview' : 'Live Preview'}
          </span>
          {loading && (
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          )}
          {error && (
            <div className="w-2 h-2 rounded-full bg-red-500" />
          )}
          {!loading && !error && (
            <div className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleResetPosition}
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
            title="Reset position"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
          <button
            onClick={handleMinimize}
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
            title={floatingPreview.isMinimized ? "Maximize" : "Minimize"}
          >
            {floatingPreview.isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-destructive/20 hover:text-destructive rounded text-muted-foreground transition-colors"
            title="Close preview"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Video Content */}
      {!floatingPreview.isMinimized && (
        <div className="relative bg-muted/20" style={{ height: `${floatingPreview.size.height}px` }}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90">
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Connecting...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90">
              <div className="text-center p-4">
                <div className="w-6 h-6 text-destructive mx-auto mb-2">
                  <X className="w-full h-full" />
                </div>
                <p className="text-xs text-destructive mb-2">Camera Error</p>
                <button
                  onClick={handleRetry}
                  className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <video
              ref={videoRef}
              className="w-full h-full object-contain bg-black/5"
              autoPlay
              muted
              playsInline
            />
          )}

          {/* Quality indicator */}
          {!loading && !error && size && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
              {size.width}×{size.height}
            </div>
          )}

          {/* Resize handle */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-muted/50 hover:bg-muted transition-colors"
            onMouseDown={(e) => {
              e.stopPropagation();
              const startX = e.clientX;
              const startY = e.clientY;
              const startWidth = floatingPreview.size.width;
              const startHeight = floatingPreview.size.height;

              const handleResize = (e: MouseEvent) => {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                const newWidth = Math.max(200, Math.min(800, startWidth + deltaX));
                const newHeight = Math.max(150, Math.min(600, startHeight + deltaY));
                floatingPreview.updateSize({ width: newWidth, height: newHeight });
              };

              const handleResizeEnd = () => {
                document.removeEventListener('mousemove', handleResize);
                document.removeEventListener('mouseup', handleResizeEnd);
              };

              document.addEventListener('mousemove', handleResize);
              document.addEventListener('mouseup', handleResizeEnd);
            }}
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-foreground/30" />
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(floatingWindow, document.body);
}