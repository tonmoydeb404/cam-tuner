"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlignPosition,
  ALIGN_OBJECT_POSITION,
  AspectRatio,
  ASPECT_RATIO_CLASS,
  DEFAULT_TUNER_CONFIG,
  TunerConfig,
} from "@/lib/tuner-types";
import { 
  createStreamModifier, 
  createCropZoomAlignPlugin, 
  StreamModifier,
  CROP_ZOOM_ALIGN_PLUGIN_ID
} from "@workspace/stream-config";

export interface UseTunerReturn {
  config: TunerConfig;
  setAspectRatio: (v: AspectRatio) => void;
  setZoom: (v: number) => void;
  setAlign: (v: AlignPosition) => void;
  setGridVisible: (v: boolean) => void;
  // Derived CSS values
  aspectRatioClass: string;
  objectPosition: string;
  // Output stream
  outputStream: MediaStream | null;
}

function parseAspectRatio(ratio: string): number {
  if (ratio === "16:9") return 16 / 9;
  if (ratio === "4:3") return 4 / 3;
  if (ratio === "1:1") return 1;
  if (ratio === "9:16") return 9 / 16;
  return 16 / 9; // fallback
}

export function useTuner(inputStream: MediaStream | null): UseTunerReturn {
  const [config, setConfig] = useState<TunerConfig>(DEFAULT_TUNER_CONFIG);
  const [outputStream, setOutputStream] = useState<MediaStream | null>(null);
  
  const modifierRef = useRef<StreamModifier | null>(null);

  useEffect(() => {
    if (!inputStream) {
      if (modifierRef.current) {
        modifierRef.current.destroy();
        modifierRef.current = null;
      }
      setOutputStream(null);
      return;
    }

    if (modifierRef.current) {
      modifierRef.current.destroy();
    }

    const modifier = createStreamModifier(inputStream, true);
    
    let alignX: "left" | "center" | "right" = "center";
    if (config.align.includes("left")) alignX = "left";
    else if (config.align.includes("right")) alignX = "right";

    let alignY: "top" | "center" | "bottom" = "center";
    if (config.align.includes("top")) alignY = "top";
    else if (config.align.includes("bottom")) alignY = "bottom";

    modifier.addPlugin(createCropZoomAlignPlugin(), {
      aspectRatio: parseAspectRatio(config.aspectRatio),
      zoom: config.zoom,
      alignX,
      alignY,
    });

    modifierRef.current = modifier;
    setOutputStream(modifier.outputStream);

    return () => {
      if (modifierRef.current) {
        modifierRef.current.destroy();
        modifierRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputStream]);

  const setAspectRatio = (aspectRatio: AspectRatio) => {
    setConfig((c) => ({ ...c, aspectRatio }));
    modifierRef.current?.updatePluginConfig(CROP_ZOOM_ALIGN_PLUGIN_ID, { aspectRatio: parseAspectRatio(aspectRatio) });
  };

  const setZoom = (zoom: number) => {
    setConfig((c) => ({ ...c, zoom }));
    modifierRef.current?.updatePluginConfig(CROP_ZOOM_ALIGN_PLUGIN_ID, { zoom });
  };

  const setAlign = (align: AlignPosition) => {
    setConfig((c) => ({ ...c, align }));

    let alignX: "left" | "center" | "right" = "center";
    if (align.includes("left")) alignX = "left";
    else if (align.includes("right")) alignX = "right";

    let alignY: "top" | "center" | "bottom" = "center";
    if (align.includes("top")) alignY = "top";
    else if (align.includes("bottom")) alignY = "bottom";

    modifierRef.current?.updatePluginConfig(CROP_ZOOM_ALIGN_PLUGIN_ID, { alignX, alignY });
  };

  const setGridVisible = (gridVisible: boolean) =>
    setConfig((c) => ({ ...c, gridVisible }));

  return {
    config,
    setAspectRatio,
    setZoom,
    setAlign,
    setGridVisible,
    aspectRatioClass: ASPECT_RATIO_CLASS[config.aspectRatio],
    objectPosition: ALIGN_OBJECT_POSITION[config.align],
    outputStream,
  };
}
