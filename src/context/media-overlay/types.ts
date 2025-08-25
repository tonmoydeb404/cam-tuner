import React from "react";

export interface IMediaOverlay {
  position: { x: number; y: number };
  scale: number;
  duration: number;
  opacity: number;
  delay: number;
}

export interface IMediaOverlayContext {
  mediaOverlay: IMediaOverlay;
  setMediaOverlay: React.Dispatch<React.SetStateAction<IMediaOverlay>>;
  updateMediaOverlay: <K extends keyof IMediaOverlay>(
    key: K
  ) => (value: IMediaOverlay[K]) => void;
  resetMediaOverlay: () => void;
}