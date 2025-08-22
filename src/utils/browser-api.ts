import Browser from "webextension-polyfill";
import { IAppContext } from "@/context/app/types";
import { Logger } from "./log";

/**
 * Browser API utilities for extension operations
 * Centralizes browser extension API interactions to reduce code duplication
 */

export type StorageKeys = (keyof IAppContext)[];

/**
 * Browser storage wrapper for consistent API access
 */
export const browserStorage = {
  /**
   * Get values from browser storage
   * @param keys - Array of keys to retrieve
   * @returns Promise with storage values
   */
  async get<T = Partial<IAppContext>>(keys: StorageKeys): Promise<T> {
    try {
      const result = await Browser.storage.sync.get(keys);
      return result as T;
    } catch (error) {
      Logger.error("Failed to get browser storage:", error);
      return {} as T;
    }
  },

  /**
   * Set values in browser storage
   * @param data - Object with key-value pairs to store
   * @returns Promise indicating success/failure
   */
  async set(data: Partial<IAppContext>): Promise<boolean> {
    try {
      await Browser.storage.sync.set(data);
      return true;
    } catch (error) {
      Logger.error("Failed to set browser storage:", error);
      return false;
    }
  },

  /**
   * Add listener for storage changes
   * @param callback - Function to call when storage changes
   * @param keys - Optional array of keys to watch for changes
   * @returns Function to remove the listener
   */
  onChange(
    callback: (changes: { [key: string]: chrome.storage.StorageChange }, result?: Partial<IAppContext>) => void,
    keys?: StorageKeys
  ) {
    const listener = async (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (keys) {
        const hasRelevantChanges = keys.some(key => key in changes);
        if (!hasRelevantChanges) return;
        
        // Get updated values for relevant keys
        const result = await this.get(keys);
        callback(changes, result);
      } else {
        callback(changes);
      }
    };

    Browser.storage.sync.onChanged.addListener(listener);
    
    // Return cleanup function
    return () => Browser.storage.sync.onChanged.removeListener(listener);
  }
};

/**
 * Script injection utilities
 */
export const scriptInjection = {
  /**
   * Inject a script into the current page
   * @param scriptPath - Path to the script file
   * @param onLoad - Optional callback when script loads
   * @returns Promise indicating success/failure
   */
  async inject(scriptPath: string, onLoad?: () => void): Promise<boolean> {
    try {
      const script = document.createElement("script");
      script.setAttribute("type", "module");
      script.setAttribute("src", chrome.runtime.getURL(scriptPath));

      const head = document.head || 
                  document.getElementsByTagName("head")[0] || 
                  document.documentElement;

      return new Promise((resolve) => {
        script.onload = () => {
          onLoad?.();
          resolve(true);
        };
        
        script.onerror = () => {
          Logger.error("Failed to inject script:", scriptPath);
          resolve(false);
        };

        head.insertBefore(script, head.lastChild);
      });
    } catch (error) {
      Logger.error("Script injection error:", error);
      return false;
    }
  }
};

/**
 * Message utilities for extension communication
 */
export const messageUtils = {
  /**
   * Post a message to the window
   * @param type - Message type
   * @param payload - Message payload
   * @param origin - Target origin (default: "*")
   */
  postToWindow(type: string, payload: unknown, origin = "*") {
    const message = { type, payload };
    window.postMessage(message, origin);
    Logger.dev("Message sent to window:", message);
  },

  /**
   * Send message to extension runtime
   * @param type - Message type
   * @param payload - Message payload
   * @returns Promise with response
   */
  async sendToRuntime(type: string, payload: unknown): Promise<unknown> {
    try {
      const message = { type, payload };
      const response = await Browser.runtime.sendMessage(message);
      return response;
    } catch (error) {
      Logger.error("Failed to send runtime message:", error);
      return { success: false, error };
    }
  }
};