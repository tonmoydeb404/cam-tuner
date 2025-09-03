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
import { IAppCameraSource, IAppContext } from "./types";

const defaultValue: IAppContext = {
  cameraSource: null,

  setCameraSource: () => {},
  initCameraSource: () => {},
  enable: true,
  setEnable: () => {},
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

  // ----------------------------------------------------------------------

  useEffect(() => {
    Browser.storage?.sync.get(["enable", "cameraSource"]).then((result) => {
      if (typeof result.enable === "boolean") {
        setEnable(result.enable);
      }
      if (typeof result.cameraSource === "object") {
        setCameraSource(result.cameraSource as IAppCameraSource);
      }
    });
  }, []);

  // ----------------------------------------------------------------------

  const saveSettings = useCallback(
    (enable: boolean, cameraSource: IAppCameraSource | null) => {
      const storageData = {
        enable,
        cameraSource,
      };

      Browser.storage.sync.set(storageData);
      try {
        const message: SettingsUpdateMessage = {
          type: MessageTypeEnum.UPDATE,
          payload: {
            cameraSource,
            enable,
          },
        };
        Browser.runtime.sendMessage(message);
      } catch (error) {
        Logger.dev("No content script to receive message (extension page)");
      }
    },
    []
  );

  const updateEnable: IAppContext["setEnable"] = useCallback(
    (checked) => {
      setEnable(checked);
      saveSettings(checked, cameraSource);
    },
    [cameraSource, saveSettings]
  );

  const initCameraSource: IAppContext["initCameraSource"] = (value) => {
    setCameraSource((prev) => {
      if (prev) return prev;
      return value;
    });
    if (!cameraSource) {
      saveSettings(enable, value);
    }
  };

  const updateCameraSource: IAppContext["setCameraSource"] = (value) => {
    setCameraSource(value);
    saveSettings(enable, value);
  };

  // ----------------------------------------------------------------------

  const value: IAppContext = {
    enable,
    setEnable: updateEnable,
    cameraSource,
    setCameraSource: updateCameraSource,
    initCameraSource,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
