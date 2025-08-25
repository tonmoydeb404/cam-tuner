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
  IAppCameraSource,
  IAppConfig,
  IAppContext,
  IGifOverlay,
} from "./types";

const defaultOverlay: IGifOverlay = {
  enabled: false,
  gifUrl: "",
  mp4Url: "",
  gifId: "",
  position: { x: 50, y: 50 },
  scale: 1,
  duration: 3,
  delay: 0,
  opacity: 100,
};

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

  overlay: defaultOverlay,
  setOverlay: () => {},
  setOverlayEnable: () => {},
  updateOverlay: () => () => {},
  resetOverlay: () => {},
  setSelectedGif: () => {},
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
  const [overlay, setOverlay] = useState(defaultValue.overlay);

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
      Browser.storage.sync.set({
        enable,
        cameraSource,
        config,
      });
      try {
        const message: SettingsUpdateMessage = {
          type: MessageTypeEnum.UPDATE,
          payload: {
            overlay: defaultValue.overlay,
            cameraSource,
            config,
            enable,
          },
        };
        Browser.runtime.sendMessage(message);
      } catch (error) {
        Logger.dev(
          "No content script to receive overlay message (extension page)"
        );
      }
    },
    []
  );

  const saveOverlay = useCallback(() => {
    try {
      const message: SettingsUpdateMessage = {
        type: MessageTypeEnum.UPDATE,
        payload: { overlay: overlay, cameraSource, config, enable },
      };
      Browser.runtime.sendMessage(message);
    } catch (error) {
      Logger.dev(
        "No content script to receive overlay message (extension page)"
      );
    }
  }, [cameraSource, config, enable, overlay]);

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

  const updateOverlay: IAppContext["updateOverlay"] = (key) => (value) => {
    const newOverlay = { ...overlay, [key]: value };
    setOverlay(newOverlay);
  };

  const resetOverlay = useCallback(() => {
    const newOverlay = { ...defaultOverlay };
    setOverlay(newOverlay);
    saveOverlay();
  }, [saveOverlay]);

  const setSelectedGif = useCallback(
    (gifUrl: string, mp4Url: string, gifId: string) => {
      const newOverlay = {
        ...overlay,
        gifUrl,
        mp4Url,
        gifId,
        enabled: true,
      };
      setOverlay(newOverlay);
    },
    [overlay]
  );

  const setOverlayEnable = useCallback(
    (enabled: boolean) => {
      setOverlay((prev) => ({ ...prev, enabled }));
      saveOverlay();
    },
    [saveOverlay]
  );

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
    overlay,
    setOverlay,
    updateOverlay,
    resetOverlay,
    setSelectedGif,
    setOverlayEnable,
    applySettings,
    changesPending: false,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
