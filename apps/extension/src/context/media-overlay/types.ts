import React from "react";

export interface IMediaOverlay {
  position: { x: number; y: number }; // Position as percentage (0-100)
  scale: number; // Scale multiplier (0.1-5)
  duration: number; // Duration in seconds
  opacity: number; // Opacity as percentage (0-100)
  delay: number; // Delay in seconds
}

export interface IMediaOverlayContext {
  mediaOverlay: IMediaOverlay;
  setMediaOverlay: React.Dispatch<React.SetStateAction<IMediaOverlay>>;
  updateMediaOverlay: <K extends keyof IMediaOverlay>(
    key: K
  ) => (value: IMediaOverlay[K]) => void;
  resetMediaOverlay: () => void;
}