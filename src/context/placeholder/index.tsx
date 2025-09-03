import { MessageTypeEnum, PlaceholderMessage } from "@/types/window-message";
import { Logger } from "@/utils/log";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Browser from "webextension-polyfill";

interface PlaceholderConfig {
  enabled: boolean;
  position: {
    x: number;
    y: number;
  };
  background: {
    mode: "color" | "image" | "video";
    colorCode: string | null;
    imageUrl: string | null;
    videoUrl: string | null;
  };
  foreground: {
    mode: "text" | "image" | "video";
    text: {
      content: string | null;
      bgColorCode: string | null;
      fontColorCode: string | null;
      fontSize: number;
    };
    imageUrl: string | null;
    videoUrl: string | null;
    scale: number;
    radius: number;
  };
}

interface PlaceholderContextType {
  placeholderConfig: PlaceholderConfig;
  updatePlaceholder: <K extends keyof PlaceholderConfig>(
    key: K
  ) => (value: PlaceholderConfig[K]) => void;
  updateNestedPlaceholder: <
    T extends keyof PlaceholderConfig,
    K extends keyof PlaceholderConfig[T]
  >(
    section: T,
    key: K
  ) => (value: PlaceholderConfig[T][K]) => void;
  resetPlaceholder: () => void;
  enablePlaceholder: () => void;
  disablePlaceholder: () => void;
}

const defaultPlaceholderConfig: PlaceholderConfig = {
  enabled: false,
  position: {
    x: 50,
    y: 50,
  },
  background: {
    mode: "color",
    colorCode: "#1a1a1a",
    imageUrl: null,
    videoUrl: null,
  },
  foreground: {
    mode: "text",
    text: {
      content: "Be Right Back",
      bgColorCode: "#000000",
      fontColorCode: "#ffffff",
      fontSize: 48,
    },
    imageUrl: null,
    videoUrl: null,
    scale: 1.0,
    radius: 8,
  },
};

const PlaceholderContext = createContext<PlaceholderContextType | undefined>(
  undefined
);

export const usePlaceholder = (): PlaceholderContextType => {
  const context = useContext(PlaceholderContext);
  if (!context) {
    throw new Error("usePlaceholder must be used within a PlaceholderProvider");
  }
  return context;
};

interface PlaceholderProviderProps {
  children: ReactNode;
}

export const PlaceholderProvider: React.FC<PlaceholderProviderProps> = ({
  children,
}) => {
  const [placeholderConfig, setPlaceholderConfig] = useState<PlaceholderConfig>(
    defaultPlaceholderConfig
  );

  useEffect(() => {
    Browser.storage?.sync.get(["placeholderConfig"]).then((result) => {
      if (typeof result?.placeholderConfig === "object") {
        setPlaceholderConfig((prev) => ({
          ...prev,
          ...(result.placeholderConfig as PlaceholderConfig),
        }));
      }
    });
  }, []);

  const applyChanges = (config: PlaceholderConfig) => {
    Browser.storage.sync.set({
      placeholderConfig: config,
    });
    try {
      const message: PlaceholderMessage = {
        type: MessageTypeEnum.PLACEHOLDER,
        payload: config,
      };
      Browser.runtime.sendMessage(message);
    } catch (error) {
      Logger.dev("No content script to receive message (extension page)");
    }
  };

  const resetPlaceholder = () => {
    setPlaceholderConfig(defaultPlaceholderConfig);
    applyChanges(defaultPlaceholderConfig);
  };

  const enablePlaceholder = () => {
    setPlaceholderConfig((prev) => {
      const newConfig = { ...prev, enabled: true };
      applyChanges(newConfig);
      return newConfig;
    });
  };

  const disablePlaceholder = () => {
    setPlaceholderConfig((prev) => {
      const newConfig = { ...prev, enabled: false };
      applyChanges(newConfig);
      return newConfig;
    });
  };

  const updatePlaceholder: PlaceholderContextType["updatePlaceholder"] =
    (key) => (value) => {
      setPlaceholderConfig((prev) => {
        const newConfig = { ...prev };
        newConfig[key] = value;
        applyChanges(newConfig);
        return newConfig;
      });
    };

  const updateNestedPlaceholder: PlaceholderContextType["updateNestedPlaceholder"] =
    (section, key) => (value) => {
      setPlaceholderConfig((prev) => {
        const newConfig = {
          ...prev,
          [section]: {
            ...(prev[section] as object),
            [key]: value,
          },
        };
        applyChanges(newConfig);
        return newConfig;
      });
    };

  const value: PlaceholderContextType = {
    placeholderConfig,
    updatePlaceholder,
    updateNestedPlaceholder,
    resetPlaceholder,
    enablePlaceholder,
    disablePlaceholder,
  };

  return (
    <PlaceholderContext.Provider value={value}>
      {children}
    </PlaceholderContext.Provider>
  );
};
