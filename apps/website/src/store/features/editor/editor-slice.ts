import { ratioOptions } from "@/config/ratio";
import { RootState } from "@/store/config";
import { createSlice } from "@reduxjs/toolkit";

export interface CropConfig {
  isEnabled: boolean;
  aspectRatio: number;
  zoom: number;
  mirror: boolean;
  align: "left" | "right" | "center";
  fitToFrame: boolean;
  bgColor: string | null;
}

export interface FilterConfig {
  isEnabled: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
}

export interface StickerConfig {
  isEnabled: boolean;
  src: string | null;
  position: { x: number; y: number };
  scale: number;
  duration: number | null;
  opacity: number;
}

export interface ConfettiConfig {
  isEnabled: boolean;
  id: string | null;
  intensity: number;
  duration: number | null;
}

export interface EditorSlice {
  crop: CropConfig;
  filters: FilterConfig;
  sticker: StickerConfig;
  confetti: ConfettiConfig;
}

const initialState: EditorSlice = {
  confetti: {
    isEnabled: false,
    id: null,
    intensity: 50,
    duration: 3,
  },
  crop: {
    isEnabled: true,
    aspectRatio: ratioOptions[0].value,
    zoom: 1,
    mirror: false,
    align: "center",
    fitToFrame: false,
    bgColor: null,
  },
  filters: {
    isEnabled: false,
    brightness: 100,
    contrast: 100,
    saturation: 100,
  },
  sticker: {
    isEnabled: false,
    src: null,
    position: { x: 50, y: 50 },
    scale: 1,
    duration: 3,
    opacity: 100,
  },
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {},
});

export const selectEditorSlice = (state: RootState) => state.editor;
