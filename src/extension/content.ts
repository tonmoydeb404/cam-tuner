import { MessageTypeEnum } from "@/types/window-message";
import { IAppContext } from "../context/app/types";
import { Logger } from "../utils/log";
import { browserStorage, scriptInjection, messageUtils } from "../utils/browser-api";

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
const relevantKeys = ["cameraSource", "config", "enable"] as (keyof IAppContext)[];

browserStorage.onChange((changes, result) => {
  Logger.dev("Storage changed:", changes);
  if (result) {
    messageUtils.postToWindow(MessageTypeEnum.SETTINGS, result);
    Logger.dev("Settings updated via storage change:", result);
  }
}, relevantKeys);

// Update Settings to the web page ----------------------------------------------------------------------
// Browser.runtime.onMessage.addListener((message: any, sender, sendResponse) => {
//   if (message?.type === MessageTypeEnum.UPDATE) {
//     Logger.dev("Settings Updated...");
//     const settingsMessage = {
//       type: MessageTypeEnum.SETTINGS,
//       payload: message.payload,
//     };
//     window.postMessage(settingsMessage, "*");
//     sendResponse({ success: true });
//   }

//   // Floating preview feature disabled
//   // if (message?.type === MessageTypeEnum.FLOATING_PREVIEW) {
//   //   Logger.dev("Floating Preview Command...");
//   //   window.postMessage(message, "*");
//   //   sendResponse({ success: true });
//   // }

//   return true;
// });
