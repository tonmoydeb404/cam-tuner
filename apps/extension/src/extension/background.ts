import { MessageTypeEnum } from "@/types/window-message";
import { Logger } from "@/utils/log";
import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(() => {
  Logger.dev("Installed!");
});

// Handle extension icon click
browser.action.onClicked.addListener(async (tab) => {
  Logger.dev("Extension icon clicked, toggling iframe", tab.id);

  if (tab.id) {
    await browser.tabs
      .sendMessage(tab.id, {
        type: MessageTypeEnum.TOGGLE_IFRAME,
        payload: {},
      })
      .then(() => {
        Logger.dev("Iframe toggle message sent successfully");
      })
      .catch((error) => {
        Logger.error("Failed to send iframe toggle message:", error);
      });
  }

  return true;
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && typeof message === "object" && "type" in message) {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => {
        if (tabs[0]?.id) {
          browser.tabs.sendMessage(tabs[0].id, message);
        }
      })
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        Logger.error("Failed to relay message:", error);
        sendResponse({ success: false, error: error.message });
      });
  }

  return true; // Keep channel open for async response
});
