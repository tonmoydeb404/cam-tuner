"use client";

import { useCrop } from "@/context/crop-context";
import { useFilter } from "@/context/filter-context";
import { useEffect, useRef } from "react";

export function useCanvasRenderer(
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { cropConfig } = useCrop();
  const { filterConfig } = useFilter();

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const { aspectRatio, zoom, mirror, align } = cropConfig;
        const { brightness, contrast, saturation } = filterConfig;

        // Calculate crop dimensions based on aspect ratio
        const videoAspect = video.videoWidth / video.videoHeight;
        let sourceWidth = video.videoWidth;
        let sourceHeight = video.videoHeight;
        let sourceX = 0;
        let sourceY = 0;

        if (videoAspect > aspectRatio) {
          // Video is wider than target aspect ratio
          sourceWidth = video.videoHeight * aspectRatio;
          sourceHeight = video.videoHeight;
          if (align === "left") sourceX = 0;
          else if (align === "right") sourceX = video.videoWidth - sourceWidth;
          else sourceX = (video.videoWidth - sourceWidth) / 2;
        } else if (videoAspect < aspectRatio) {
          // Video is taller than target aspect ratio
          sourceWidth = video.videoWidth;
          sourceHeight = video.videoWidth / aspectRatio;
          sourceY = (video.videoHeight - sourceHeight) / 2;
        }

        // Apply zoom
        const zoomWidth = sourceWidth / zoom;
        const zoomHeight = sourceHeight / zoom;
        sourceX += (sourceWidth - zoomWidth) / 2;
        sourceY += (sourceHeight - zoomHeight) / 2;
        sourceWidth = zoomWidth;
        sourceHeight = zoomHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save context state
        ctx.save();

        // Apply mirror
        if (mirror) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }

        // Apply filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

        // Draw video frame
        ctx.drawImage(
          video,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Restore context state
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cropConfig, filterConfig, videoRef]);

  return canvasRef;
}
