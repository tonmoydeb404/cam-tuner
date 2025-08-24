import { MessageTypeEnum, WindowMessage } from "@/types/window-message";
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

    // Try to send message to content scripts (only works on web pages)
    try {
      const message: WindowMessage = {
        type: MessageTypeEnum.UPDATE,
        payload: {
          cameraSource,
          config,
          enable,
        },
      };
      Browser.runtime.sendMessage(message).catch(() => {
        // Ignore error - no content script to receive
      });
    } catch (error) {
      // Extension pages don't have content scripts - this is normal
      Logger.dev("No content script to receive message (extension page)");
    }
  };

  const saveOverlay = (overlay: IGifOverlay) => {
    // Send overlay separately as background message
    try {
      Browser.runtime
        .sendMessage({
          type: MessageTypeEnum.GIF_OVERLAY,
          payload: { gifOverlay: overlay },
        })
        .catch(() => {
          // Ignore error - no content script to receive
        });
    } catch (error) {
      Logger.dev(
        "No content script to receive overlay message (extension page)"
      );
    }
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
    saveOverlay(newOverlay);
  };

  const resetOverlay = useCallback(() => {
    const newOverlay = { ...defaultOverlay };
    setOverlay(newOverlay);
    saveOverlay(newOverlay);
  }, []);

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
      saveOverlay(newOverlay);
    },
    [overlay]
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
    applySettings,
    changesPending: false,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
