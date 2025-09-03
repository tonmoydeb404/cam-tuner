import { FilterMessage, MessageTypeEnum } from "@/types/window-message";
import { Logger } from "@/utils/log";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Browser from "webextension-polyfill";

interface FilterConfig {
  brightness: number;
  contrast: number;
  saturation: number;
}

interface FilterContextType {
  filterConfig: FilterConfig;
  updateFilter: <K extends keyof FilterConfig>(
    key: K
  ) => (value: FilterConfig[K]) => void;
  resetFilter: () => void;
  setFilter: (value: FilterConfig) => void;
}

const defaultFilterConfig: FilterConfig = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterContext");
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filterConfig, setFilterConfig] =
    useState<FilterConfig>(defaultFilterConfig);

  useEffect(() => {
    Browser.storage?.sync.get(["filterConfig"]).then((result) => {
      if (typeof result?.filterConfig === "object") {
        setFilterConfig((prev) => ({
          ...prev,
          ...(result.filterConfig as FilterConfig),
        }));
      }
    });
  }, []);

  const applyChanges = (config: FilterConfig) => {
    Browser.storage.sync.set({
      filterConfig: config,
    });
    try {
      const message: FilterMessage = {
        type: MessageTypeEnum.FILTER,
        payload: {
          brightness: config.brightness,
          contrast: config.contrast,
          saturation: config.saturation,
        },
      };
      Browser.runtime.sendMessage(message);
    } catch (error) {
      Logger.dev("No content script to receive message (extension page)");
    }
  };

  const resetCrop = () => {
    setFilterConfig(defaultFilterConfig);
    applyChanges(defaultFilterConfig);
  };

  const updateCrop: FilterContextType["updateFilter"] = (key) => (value) => {
    setFilterConfig((prev) => {
      const prevConfig = { ...prev };
      prevConfig[key] = value;

      applyChanges(prevConfig);
      return prevConfig;
    });
  };

  const setFilter: FilterContextType["setFilter"] = (value) => {
    setFilterConfig(value);
    applyChanges(value);
  };

  const value: FilterContextType = {
    filterConfig: filterConfig,
    updateFilter: updateCrop,
    resetFilter: resetCrop,
    setFilter,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
