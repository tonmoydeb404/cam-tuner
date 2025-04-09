// src/background.ts
import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(() => {
  console.log("Installed!");
});
