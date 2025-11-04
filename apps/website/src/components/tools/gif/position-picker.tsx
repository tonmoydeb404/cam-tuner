"use client";

import { useCrop } from "@/context/crop-context";
import { useMediaOverlayContext } from "@/context/media-overlay-context";
import { getRatio } from "@/lib/ratio-options";
import { useCallback, useRef } from "react";

export default function PositionPicker() {
  const { mediaOverlay, updateMediaOverlay } = useMediaOverlayContext();
  const { cropConfig } = useCrop();
  const containerRef = useRef<HTMLDivElement>(null);

  const aspectRatio = cropConfig.aspectRatio;
  const ratioLabel = getRatio(aspectRatio)?.label || "Custom";

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      updateMediaOverlay("position")({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    },
    [updateMediaOverlay]
  );

  const boxSize = 40 * mediaOverlay.scale; // Base size 40px scaled

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Position Preview</span>
        <span className="text-xs text-muted-foreground">{ratioLabel}</span>
      </div>
      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative w-full bg-muted/30 border border-border rounded-md cursor-crosshair overflow-hidden"
        style={{
          aspectRatio: `${aspectRatio}`,
          minHeight: "200px",
        }}
      >
        {/* Center Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/30" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border/30" />
        </div>

        {/* Position Indicator */}
        <div
          className="absolute bg-primary/30 border-2 border-primary rounded-sm transition-all pointer-events-none"
          style={{
            left: `${mediaOverlay.position.x}%`,
            top: `${mediaOverlay.position.y}%`,
            width: `${boxSize}px`,
            height: `${boxSize}px`,
            transform: "translate(-50%, -50%)",
            opacity: mediaOverlay.opacity / 100,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-mono text-primary">GIF</span>
          </div>
        </div>

        {/* Coordinates Display */}
        <div className="absolute bottom-2 right-2 text-xs font-mono bg-background/80 px-2 py-1 rounded border border-border">
          {Math.round(mediaOverlay.position.x)}%, {Math.round(mediaOverlay.position.y)}%
        </div>
      </div>
    </div>
  );
}
