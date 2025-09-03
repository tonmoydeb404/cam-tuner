import { StreamCropConfig } from "@/types/stream-patcher";
import { CropMessage, MessageTypeEnum } from "@/types/window-message";
import { Logger } from "@/utils/log";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Browser from "webextension-polyfill";
import ratioOptions from "../app/ratio-options";

interface CropConfig {
  aspectRatio: number;
  zoom: number;
  mirror: boolean;
  align: StreamCropConfig["align"];
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

  useEffect(() => {
    Browser.storage?.sync.get(["cropConfig"]).then((result) => {
      if (typeof result?.cropConfig === "object") {
        setCropConfig((prev) => ({
          ...prev,
          ...(result.cropConfig as CropConfig),
        }));
      }
    });
  }, []);

  const applyChanges = (config: CropConfig) => {
    Browser.storage.sync.set({
      cropConfig: config,
    });
    try {
      const message: CropMessage = {
        type: MessageTypeEnum.CROP,
        payload: {
          align: config.align,
          aspectRatio: config.aspectRatio,
          mirror: config.mirror,
          zoom: config.zoom,
        },
      };
      Browser.runtime.sendMessage(message);
    } catch (error) {
      Logger.dev("No content script to receive message (extension page)");
    }
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
