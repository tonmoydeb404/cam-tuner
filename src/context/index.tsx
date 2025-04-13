import { MessageTypeEnum, WindowMessage } from "@/types/window-message";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Browser from "webextension-polyfill";
import ratioOptions from "./ratio-options";
import { IAppCameraSource, IAppConfig, IAppContext } from "./types";

const defaultValue: IAppContext = {
  cameraSource: null,
  changesPending: false,
  setCameraSource: () => {},
  initCameraSource: () => {},
  enable: true,
  setEnable: () => {},

  config: {
    aspectRatio: ratioOptions[0].value,
    zoom: 1,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    mirror: false,
    align: "center",
  },
  setConfig: () => {},
  updateConfig: () => () => {},
  applySettings: () => {},
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
  const [changesPending, setChangesPending] = useState(
    defaultValue.changesPending
  );

  // ----------------------------------------------------------------------

  useEffect(() => {
    Browser.storage?.sync
      .get(["enable", "cameraSource", "config"])
      .then((result) => {
        if (typeof result.enable === "boolean") {
          console.log(result.enable);

          setEnable(result.enable);
        }
        if (typeof result.cameraSource === "object") {
          setCameraSource(result.cameraSource as IAppCameraSource);
        }
        if (typeof result.config === "object") {
          setConfig((prev) => ({ ...prev, ...(result.config as IAppConfig) }));
        }
      });
  }, []);

  // ----------------------------------------------------------------------

  const updateConfig: IAppContext["updateConfig"] = (key) => (value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setChangesPending(true);
  };

  const saveSettings = (
    enable: boolean,
    cameraSource: IAppCameraSource | null,
    config: IAppConfig
  ) => {
    Browser.storage?.sync.set({
      enable,
      cameraSource,
      config,
    });
    setChangesPending(false);
    const message: WindowMessage = {
      type: MessageTypeEnum.UPDATE,
      payload: {
        cameraSource,
        config,
        enable,
      },
    };
    Browser.runtime.sendMessage(message);
  };

  const applySettings = useCallback(() => {
    saveSettings(enable, cameraSource, config);
  }, [enable, cameraSource, config]);

  const updateEnable: IAppContext["setEnable"] = useCallback(
    (checked) => {
      setEnable(checked);
      saveSettings(checked, cameraSource, config);
    },
    [cameraSource, config]
  );

  const initCameraSource: IAppContext["initCameraSource"] = (value) => {
    setCameraSource((prev) => {
      if (prev) return prev;
      setChangesPending(true);
      return value;
    });
  };

  const updateCameraSource: IAppContext["setCameraSource"] = (value) => {
    setCameraSource(value);
    setChangesPending(true);
  };

  // ----------------------------------------------------------------------

  const value: IAppContext = {
    enable,
    setEnable: updateEnable,
    cameraSource,
    setCameraSource: updateCameraSource,
    initCameraSource,
    config,
    setConfig,
    updateConfig,
    applySettings,
    changesPending,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
