import { Logger } from "@/utils/log";
import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(() => {
  Logger.dev("Installed!");
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && typeof message === "object" && "type" in message) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]?.id) {
        browser.tabs.sendMessage(tabs[0].id, message);
      }
    });

    sendResponse({ success: true });
  }

  return true;
});
