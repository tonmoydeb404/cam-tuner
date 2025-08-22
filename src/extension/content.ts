import { MessageTypeEnum } from "@/types/window-message";
import Browser from "webextension-polyfill";
import { IAppContext } from "../context/app/types";
import { Logger } from "../utils/log";

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
      Logger.dev("Script loaded, sending message...", result);
      const messageObj = {
        type: MessageTypeEnum.SETTINGS,
        payload: (result ?? {}),
      };
      window.postMessage(messageObj, "*");
    };
  });

// Update Settings to the web page ----------------------------------------------------------------------
Browser.runtime.onMessage.addListener((message: any, sender, sendResponse) => {
  if (message?.type === MessageTypeEnum.UPDATE) {
    Logger.dev("Settings Updated...");
    const settingsMessage = {
      type: MessageTypeEnum.SETTINGS,
      payload: message.payload
    };
    window.postMessage(settingsMessage, "*");
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
