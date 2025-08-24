import { MessageTypeEnum } from "@/types/window-message";
import {
  browserStorage,
  messageUtils,
  scriptInjection,
} from "../utils/browser-api";
import { Logger } from "../utils/log";

// Initiate web page with initial settings  ----------------------------------------------------------------------
const initializeExtension = async () => {
  const result = await browserStorage.get(["cameraSource", "config", "enable"]);

  const scriptLoaded = await scriptInjection.inject(
    "src/extension/inject.js",
    () => {
      Logger.dev("Script loaded, sending message...", result);
      messageUtils.postToWindow(MessageTypeEnum.SETTINGS, result ?? {});
    }
  );

  if (!scriptLoaded) {
    Logger.error("Failed to inject extension script");
  }
};

initializeExtension();

// Handle runtime messages ----------------------------------------------------------------------
chrome.runtime.onMessage.addListener(
  async (message: any, _sender, sendResponse) => {
    if (message?.type === MessageTypeEnum.UPDATE) {
      Logger.dev("Settings Updated...");
      const settingsMessage = {
        type: MessageTypeEnum.SETTINGS,
        payload: message.payload,
      };
      window.postMessage(settingsMessage, "*");
      sendResponse({ success: true });
    }

    return true;
  }
);
