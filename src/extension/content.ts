import { IAppContext } from "../context/types";
import { devLog } from "../utils/log";

// Initiate web page with initial settings  ----------------------------------------------------------------------
chrome.storage.sync.get(
  ["cameraSource", "config", "enable"] as (keyof IAppContext)[],
  (result) => {
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
      window.postMessage({ type: "VCAM_SETTINGS", settings: result }, "*");
    };
  }
);

// Update Settings to the web page ----------------------------------------------------------------------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_SETTINGS") {
    devLog("Settings Updated...");
    window.postMessage(
      { type: "VCAM_SETTINGS", settings: message.settings ?? {} },
      "*"
    );

    sendResponse({ success: true });
  }
});
