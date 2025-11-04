"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import ratioOptions from "@/lib/ratio-options";

export type AlignType = "left" | "center" | "right";

export interface CropConfig {
  aspectRatio: number;
  zoom: number;
  mirror: boolean;
  align: AlignType;
  enableLetterbox: boolean;
  letterboxBgColor: string | null;
}

interface CropContextType {
  cropConfig: CropConfig;
  updateCrop: <K extends keyof CropConfig>(
    key: K
  ) => (value: CropConfig[K]) => void;
  resetCrop: () => void;
}

const defaultCropConfig: CropConfig = {
  aspectRatio: ratioOptions[0].value,
  zoom: 1,
  mirror: false,
  align: "center",
  enableLetterbox: false,
  letterboxBgColor: null,
};

const CropContext = createContext<CropContextType | undefined>(undefined);

export const useCrop = (): CropContextType => {
  const context = useContext(CropContext);
  if (!context) {
    throw new Error("useCrop must be used within a CropProvider");
  }
  return context;
};

interface CropProviderProps {
  children: ReactNode;
}

export const CropProvider: React.FC<CropProviderProps> = ({ children }) => {
  const [cropConfig, setCropConfig] = useState<CropConfig>(defaultCropConfig);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cropConfig");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCropConfig((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse crop config:", e);
      }
    }
  }, []);

  const applyChanges = (config: CropConfig) => {
    // Persist to localStorage
    localStorage.setItem("cropConfig", JSON.stringify(config));
  };

  const resetCrop = () => {
    setCropConfig(defaultCropConfig);
    applyChanges(defaultCropConfig);
  };

  const updateCrop: CropContextType["updateCrop"] = (key) => (value) => {
    setCropConfig((prev) => {
      const prevConfig = { ...prev };
      prevConfig[key] = value;

      applyChanges(prevConfig);
      return prevConfig;
    });
  };

  const value: CropContextType = {
    cropConfig,
    updateCrop,
    resetCrop,
  };

  return <CropContext.Provider value={value}>{children}</CropContext.Provider>;
};
