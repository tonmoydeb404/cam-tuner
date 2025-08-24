import { MessageTypeEnum } from "@/types/window-message";
import { IAppContext } from "../context/app/types";
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

// Listen for storage changes and update web page ----------------------------------------------------------------------
const relevantKeys = [
  "cameraSource",
  "config",
  "enable",
] as (keyof IAppContext)[];

browserStorage.onChange((changes, result) => {
  Logger.dev("Storage changed:", changes);
  if (result) {
    messageUtils.postToWindow(MessageTypeEnum.SETTINGS, result);
    Logger.dev("Settings updated via storage change:", result);
  }
}, relevantKeys);

// Handle runtime messages ----------------------------------------------------------------------
chrome.runtime.onMessage.addListener((message: any, _sender, sendResponse) => {
  if (message?.type === MessageTypeEnum.UPDATE) {
    Logger.dev("Settings Updated...");
    const settingsMessage = {
      type: MessageTypeEnum.SETTINGS,
      payload: message.payload,
    };
    window.postMessage(settingsMessage, "*");
    sendResponse({ success: true });
  }

  if (message?.type === MessageTypeEnum.GIF_OVERLAY) {
    Logger.dev("GIF Overlay Updated...");
    const gifMessage = {
      type: MessageTypeEnum.GIF_OVERLAY,
      payload: message.payload,
    };
    window.postMessage(gifMessage, "*");
    sendResponse({ success: true });
  }

  // Floating preview feature disabled
  // if (message?.type === MessageTypeEnum.FLOATING_PREVIEW) {
  //   Logger.dev("Floating Preview Command...");
  //   window.postMessage(message, "*");
  //   sendResponse({ success: true });
  // }

  return true;
});
