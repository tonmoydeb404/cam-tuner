import { MessageTypeEnum, SettingsUpdateMessage } from "@/types/window-message";
import { Logger } from "@/utils/log";
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
import {
  ColorPreset,
  IAppCameraSource,
  IAppConfig,
  IAppContext,
} from "./types";


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
  applyPreset: () => {},

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

  // ----------------------------------------------------------------------

  useEffect(() => {
    Browser.storage?.sync
      .get(["enable", "cameraSource", "config"])
      .then((result) => {
        if (typeof result.enable === "boolean") {
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
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    saveSettings(enable, cameraSource, newConfig);
  };

  const saveSettings = useCallback(
    (
      enable: boolean,
      cameraSource: IAppCameraSource | null,
      config: IAppConfig
    ) => {
      const storageData = {
        enable,
        cameraSource,
        config,
      };

      Browser.storage.sync.set(storageData);
      try {
        const message: SettingsUpdateMessage = {
          type: MessageTypeEnum.UPDATE,
          payload: {
            overlay: {},
            cameraSource,
            config,
            enable,
          },
        };
        Browser.runtime.sendMessage(message);
      } catch (error) {
        Logger.dev(
          "No content script to receive message (extension page)"
        );
      }
    },
    []
  );


  const applyPreset = useCallback(
    (preset: ColorPreset) => {
      const newConfig = {
        ...config,
        brightness: preset.brightness,
        contrast: preset.contrast,
        saturation: preset.saturation,
      };
      setConfig(newConfig);
      saveSettings(enable, cameraSource, newConfig);
    },
    [config, enable, cameraSource, saveSettings]
  );

  const applySettings = useCallback(() => {
    saveSettings(enable, cameraSource, config);
  }, [saveSettings, enable, cameraSource, config]);

  const updateEnable: IAppContext["setEnable"] = useCallback(
    (checked) => {
      setEnable(checked);
      saveSettings(checked, cameraSource, config);
    },
    [cameraSource, config, saveSettings]
  );

  const initCameraSource: IAppContext["initCameraSource"] = (value) => {
    setCameraSource((prev) => {
      if (prev) return prev;
      return value;
    });
    if (!cameraSource) {
      saveSettings(enable, value, config);
    }
  };

  const updateCameraSource: IAppContext["setCameraSource"] = (value) => {
    setCameraSource(value);
    saveSettings(enable, value, config);
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
    applyPreset,
    applySettings,
    changesPending: false,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
