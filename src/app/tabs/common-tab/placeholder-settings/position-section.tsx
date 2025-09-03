import { Slider } from "@/components/ui/slider";
import { useCrop } from "@/context/crop";
import { usePlaceholder } from "@/context/placeholder";
import { useCallback, useRef, useState } from "react";

type Props = {};

const PositionSection = (props: Props) => {
  const { placeholderConfig, updateNestedPlaceholder } = usePlaceholder();
  const { cropConfig } = useCrop();
  const { position, foreground } = placeholderConfig;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Position picker mouse handlers
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

      updateNestedPlaceholder("position", "x")(Math.round(x));
      updateNestedPlaceholder("position", "y")(Math.round(y));
    },
    [isDragging, updateNestedPlaceholder]
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

        updateNestedPlaceholder("position", "x")(Math.round(x));
        updateNestedPlaceholder("position", "y")(Math.round(y));
      }
    },
    [updateNestedPlaceholder]
  );

  // Helper functions for updating nested state
  const updateTextProperty = useCallback(
    (property: keyof typeof foreground.text, value: any) => {
      updateNestedPlaceholder(
        "foreground",
        "text"
      )({
        ...foreground.text,
        [property]: value || null,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [foreground.text, updateNestedPlaceholder]
  );

  // Calculate container dimensions based on aspect ratio
  const aspectRatio = cropConfig.aspectRatio;
  const containerWidth = 240;
  const maxHeight = 200;
  const calculatedHeight = containerWidth / aspectRatio;
  const containerHeight = Math.min(calculatedHeight, maxHeight);
  const actualWidth = containerHeight * aspectRatio;

  // Calculate display box size
  const boxSize = 16;

  const PositionPicker = () => (
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

          {/* Position indicator */}
          <div
            className="absolute bg-primary/80 border border-primary rounded cursor-move transition-all duration-75"
            style={{
              width: `${boxSize}px`,
              height: `${boxSize}px`,
              left: `${(position.x / 100) * actualWidth - boxSize / 2}px`,
              top: `${(position.y / 100) * containerHeight - boxSize / 2}px`,
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          </div>

          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/30 transform -translate-x-px" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-border/30 transform -translate-y-px" />
          </div>
        </div>
      </div>
      <div className="text-xs text-center text-muted-foreground">
        Position: {position.x}%, {position.y}% • Scale: {foreground.scale}x
      </div>
    </div>
  );

  return (
    <div>
      {/* Position Section */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Position</div>
        <PositionPicker />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">
              X Position (%)
            </label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[position.x]}
              onValueChange={(value) =>
                updateNestedPlaceholder("position", "x")(value[0])
              }
              className="w-full"
            />
            <div className="text-xs text-center mt-1">{position.x}%</div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">
              Y Position (%)
            </label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[position.y]}
              onValueChange={(value) =>
                updateNestedPlaceholder("position", "y")(value[0])
              }
              className="w-full"
            />
            <div className="text-xs text-center mt-1">{position.y}%</div>
          </div>
        </div>
      </div>

      {/* Font Size for Text Mode */}
      {foreground.mode === "text" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Font Size</label>
          <Slider
            min={12}
            max={200}
            step={1}
            value={[foreground.text.fontSize]}
            onValueChange={(value) => updateTextProperty("fontSize", value[0])}
            className="w-full"
          />
          <div className="text-xs text-center">
            {foreground.text.fontSize}px
          </div>
        </div>
      )}

      {/* Scale Control for Image/Video */}
      {(foreground.mode === "image" || foreground.mode === "video") && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Scale</label>
          <Slider
            min={0.1}
            max={5}
            step={0.1}
            value={[foreground.scale]}
            onValueChange={(value) =>
              updateNestedPlaceholder("foreground", "scale")(value[0])
            }
            className="w-full"
          />
          <div className="text-xs text-center">{foreground.scale}x</div>
        </div>
      )}

      {/* Border Radius */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Border Radius</label>
        <Slider
          min={0}
          max={50}
          step={1}
          value={[foreground.radius]}
          onValueChange={(value) =>
            updateNestedPlaceholder("foreground", "radius")(value[0])
          }
          className="w-full"
        />
        <div className="text-xs text-center">{foreground.radius}px</div>
      </div>
    </div>
  );
};

export default PositionSection;
