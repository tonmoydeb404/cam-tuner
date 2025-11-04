"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface FilterConfig {
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
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filterConfig, setFilterConfig] =
    useState<FilterConfig>(defaultFilterConfig);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("filterConfig");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFilterConfig((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse filter config:", e);
      }
    }
  }, []);

  const applyChanges = (config: FilterConfig) => {
    // Persist to localStorage
    localStorage.setItem("filterConfig", JSON.stringify(config));
  };

  const resetFilter = () => {
    setFilterConfig(defaultFilterConfig);
    applyChanges(defaultFilterConfig);
  };

  const updateFilter: FilterContextType["updateFilter"] = (key) => (value) => {
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
    updateFilter: updateFilter,
    resetFilter: resetFilter,
    setFilter,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
