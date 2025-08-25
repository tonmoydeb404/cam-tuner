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
  applyPreset: () => {},

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
      .get(["enable", "cameraSource", "config", "overlay"])
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
        if (typeof result.overlay === "object") {
          // Load overlay data but preserve the default enabled state
          const savedOverlay = result.overlay as IGifOverlay;
          setOverlay((prev) => ({
            ...prev,
            ...savedOverlay,
            enabled: defaultOverlay.enabled, // Don't restore enabled state
          }));
        }
      });
  }, []);

  // ----------------------------------------------------------------------

  const updateConfig: IAppContext["updateConfig"] = (key) => (value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    saveSettings(enable, cameraSource, newConfig, overlay);
  };

  const saveSettings = useCallback(
    (
      enable: boolean,
      cameraSource: IAppCameraSource | null,
      config: IAppConfig,
      overlayData?: IGifOverlay
    ) => {
      const storageData: any = {
        enable,
        cameraSource,
        config,
      };

      // Save overlay data excluding enabled field
      if (overlayData) {
        const { enabled, ...overlayWithoutEnabled } = overlayData;
        storageData.overlay = overlayWithoutEnabled;
      }

      Browser.storage.sync.set(storageData);
      try {
        const message: SettingsUpdateMessage = {
          type: MessageTypeEnum.UPDATE,
          payload: {
            overlay: overlayData || defaultValue.overlay,
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

  const saveOverlay = useCallback(
    (overlay: IGifOverlay) => {
      saveSettings(enable, cameraSource, config, overlay);
    },
    [cameraSource, config, enable, saveSettings]
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
    saveSettings(enable, cameraSource, config, overlay);
  }, [saveSettings, enable, cameraSource, config, overlay]);

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
    saveOverlay(newOverlay);

    // Save reset overlay data (excluding enabled) to localStorage
    saveSettings(enable, cameraSource, config, newOverlay);
  }, [saveOverlay, enable, cameraSource, config, saveSettings]);

  const setSelectedGif = useCallback(
    (gifUrl: string, mp4Url: string, gifId: string) => {
      const newOverlay = {
        ...overlay,
        gifUrl,
        mp4Url,
        gifId,
      };
      setOverlay(newOverlay);

      // Save overlay data (excluding enabled) to localStorage
      saveSettings(enable, cameraSource, config, newOverlay);
    },
    [overlay, enable, cameraSource, config, saveSettings]
  );

  const setOverlayEnable = useCallback(
    (enabled: boolean) => {
      setOverlay((prev) => {
        const overlay = { ...prev, enabled };
        saveOverlay(overlay);

        return overlay;
      });
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
    applyPreset,
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
