import { MessageTypeEnum } from "@/types/window-message";
import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(() => {
  console.log("Installed!");
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (
    message &&
    typeof message === "object" &&
    "type" in message &&
    message.type === MessageTypeEnum.UPDATE
  ) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]?.id) {
        browser.tabs.sendMessage(tabs[0].id, message);
      }
    });

    sendResponse({ success: true });
  }

  return true;
});
