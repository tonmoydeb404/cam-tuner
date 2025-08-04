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
import { IAppConfig, IAppContext } from "./types";

const defaultValue: IAppContext = {
  changesPending: false,
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
          setEnable(result.enable);
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

  const saveSettings = (enable: boolean, config: IAppConfig) => {
    Browser.storage?.sync.set({
      enable,
      config,
    });
    setChangesPending(false);
    const message: WindowMessage = {
      type: MessageTypeEnum.UPDATE,
      payload: {
        config,
        enable,
      },
    };
    Browser.runtime.sendMessage(message);
  };

  const applySettings = useCallback(() => {
    saveSettings(enable, config);
  }, [enable, config]);

  const updateEnable: IAppContext["setEnable"] = useCallback(
    (checked) => {
      setEnable(checked);
      saveSettings(checked, config);
    },
    [config]
  );

  // ----------------------------------------------------------------------

  const value: IAppContext = {
    enable,
    setEnable: updateEnable,
    config,
    setConfig,
    updateConfig,
    applySettings,
    changesPending,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
