import { useAppContext } from "@/context/app";
import { useMediaOverlayContext } from "@/context/media-overlay";
import { useCallback, useRef, useState } from "react";

const PositionPicker = () => {
  const { config } = useAppContext();
  const { mediaOverlay, updateMediaOverlay } = useMediaOverlayContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
      );
      const y = Math.max(
        0,
        Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)
      );

      // Update immediately for smooth dragging, debounce for context updates
      updateMediaOverlay("position")({
        x: Math.round(x),
        y: Math.round(y),
      });
    },
    [isDragging, updateMediaOverlay]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(
          0,
          Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
        );
        const y = Math.max(
          0,
          Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)
        );

        updateMediaOverlay("position")({
          x: Math.round(x),
          y: Math.round(y),
        });
      }
    },
    [updateMediaOverlay]
  );

  // Calculate container dimensions based on aspect ratio
  const aspectRatio = config.aspectRatio;
  const containerWidth = 240; // Fixed width
  const maxHeight = 200; // Max height constraint
  const calculatedHeight = containerWidth / aspectRatio;
  const containerHeight = Math.min(calculatedHeight, maxHeight);
  const actualWidth = containerHeight * aspectRatio;

  // Calculate draggable box size based on scale
  const boxSize = Math.max(8, 20 * mediaOverlay.scale); // Minimum 8px, scales with overlay scale

  // Use overlay position directly
  const displayPosition = mediaOverlay.position;

  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-center">
        <div
          ref={containerRef}
          className="relative border-2 border-dashed border-border bg-muted/20 cursor-crosshair select-none"
          style={{
            width: `${actualWidth}px`,
            height: `${containerHeight}px`,
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleContainerClick}
        >
          {/* Aspect ratio label */}
          <div className="absolute top-1 left-1 text-xs text-muted-foreground bg-background/80 px-1 rounded">
            {aspectRatio === 16 / 9
              ? "16:9"
              : aspectRatio === 4 / 3
              ? "4:3"
              : aspectRatio === 1
              ? "1:1"
              : aspectRatio === 3 / 4
              ? "3:4"
              : aspectRatio === 9 / 16
              ? "9:16"
              : aspectRatio.toFixed(2)}
          </div>

          {/* Draggable position box */}
          <div
            className="absolute bg-primary/80 border border-primary rounded cursor-move transition-all duration-75"
            style={{
              width: `${boxSize}px`,
              height: `${boxSize}px`,
              left: `${
                (displayPosition.x / 100) * actualWidth - boxSize / 2
              }px`,
              top: `${
                (displayPosition.y / 100) * containerHeight - boxSize / 2
              }px`,
              opacity: mediaOverlay.opacity / 100,
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          </div>

          {/* Grid lines for better positioning reference */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Vertical center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/30 transform -translate-x-px" />
            {/* Horizontal center line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-border/30 transform -translate-y-px" />
          </div>
        </div>
      </div>

      <div className="text-xs text-center text-muted-foreground">
        Position: {displayPosition.x}%, {displayPosition.y}% • Scale:{" "}
        {mediaOverlay.scale}x
      </div>
    </div>
  );
};

export default PositionPicker;
