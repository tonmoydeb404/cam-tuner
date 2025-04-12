import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import ratioOptions from "./ratio-options";
import { IAppContext } from "./types";

const defaultValue: IAppContext = {
  cameraSource: null,
  setCameraSource: () => {},
  enable: true,
  setEnable: () => {},

  config: {
    aspectRatio: ratioOptions[0].value,
    zoom: 1,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    mirror: false,
  },
  setConfig: () => {},
  updateConfig: () => () => {},
  saveToStorage: () => {},
};
const AppContext = createContext(defaultValue);

// ----------------------------------------------------------------------

export const useAppContext = () => useContext(AppContext);

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export const AppContextProvider = (props: Props) => {
  const { children } = props;

  const [enable, setEnable] = useState(defaultValue.enable);
  const [cameraSource, setCameraSource] = useState(defaultValue.cameraSource);
  const [config, setConfig] = useState(defaultValue.config);

  // ----------------------------------------------------------------------

  useEffect(() => {
    chrome.storage?.sync.get(["enable", "cameraSource", "config"], (result) => {
      if (typeof result.enable === "boolean") setEnable(result.enable);
      if (typeof result.cameraSource === "object")
        setCameraSource(result.cameraSource);
      if (typeof result.config === "object")
        setConfig((prev) => ({ ...prev, ...result.config }));
    });
  }, []);

  // ----------------------------------------------------------------------

  const updateConfig: IAppContext["updateConfig"] = (key) => (value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const saveToStorage = useCallback(() => {
    chrome.storage?.sync.set({
      enable,
      cameraSource,
      config,
    });
  }, [enable, cameraSource, config]);

  // ----------------------------------------------------------------------

  const value: IAppContext = {
    enable,
    setEnable,
    cameraSource,
    setCameraSource,
    config,
    setConfig,
    updateConfig,
    saveToStorage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
