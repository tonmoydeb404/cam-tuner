import { MessageTypeEnum, WindowMessage } from "@/types/window-message";
import Browser from "webextension-polyfill";
import { IAppContext } from "../context/types";
import { devLog } from "../utils/log";

// Initiate web page with initial settings  ----------------------------------------------------------------------
Browser.storage.sync
  .get(["cameraSource", "config", "enable"] as (keyof IAppContext)[])
  .then((result) => {
    const script = document.createElement("script");
    script.setAttribute("type", "module");
    script.setAttribute(
      "src",
      chrome.runtime.getURL("src/extension/inject.js")
    );

    const head =
      document.head ||
      document.getElementsByTagName("head")[0] ||
      document.documentElement;

    head.insertBefore(script, head.lastChild);

    script.onload = () => {
      devLog("Script loaded, sending message...", result);
      const messageObj: WindowMessage = {
        type: MessageTypeEnum.SETTINGS,
        payload: (result ?? {}) as WindowMessage["payload"],
      };
      window.postMessage(messageObj, "*");
    };
  });

// Update Settings to the web page ----------------------------------------------------------------------
Browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const windowMessage = message as WindowMessage;
  if (windowMessage?.type === MessageTypeEnum.UPDATE) {
    devLog("Settings Updated...");
    window.postMessage(
      { ...windowMessage, type: MessageTypeEnum.SETTINGS },
      "*"
    );

    sendResponse({ success: true });
  }

  return true;
});
