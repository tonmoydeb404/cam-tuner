import { createContext, ReactNode, useContext, useState } from "react";
import ratioOptions from "./ratio-options";
import { IAppContext } from "./types";

const defaultValue: IAppContext = {
  cameraSource: null,
  setCameraSource: () => {},
  aspectRatio: ratioOptions[0].id,
  enable: false,
  setEnable: () => {},
  setAspectRatio: () => {},
  zoomLevel: 1,
  setZoomLevel: () => {},
  brightness: 100,
  setBrightness: () => {},
  contrast: 100,
  setContrast: () => {},
  saturation: 100,
  setSaturation: () => {},
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

  const [aspectRatio, setAspectRatio] = useState(defaultValue.aspectRatio);
  const [zoomLevel, setZoomLevel] = useState(defaultValue.zoomLevel);

  const [brightness, setBrightness] = useState(defaultValue.brightness);
  const [contrast, setContrast] = useState(defaultValue.contrast);
  const [saturation, setSaturation] = useState(defaultValue.saturation);

  const value = {
    aspectRatio,
    setAspectRatio,
    enable,
    setEnable,
    zoomLevel,
    setZoomLevel,
    brightness,
    setBrightness,
    contrast,
    setContrast,
    saturation,
    setSaturation,
    cameraSource,
    setCameraSource,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
