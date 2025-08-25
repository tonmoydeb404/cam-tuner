import { MediaOverlayMessage, MessageTypeEnum } from "@/types/window-message";
import Browser from "webextension-polyfill";
import { Logger } from "./log";

export const triggerMediaOverlay = async (
  mediaUrl: string,
  mediaType: "video" | "image",
  position: { x: number; y: number },
  scale: number,
  duration: number,
  opacity: number,
  delay: number
) => {
  try {
    const message: MediaOverlayMessage = {
      type: MessageTypeEnum.MEDIA_OVERLAY,
      payload: {
        mediaUrl,
        mediaType,
        position,
        scale,
        duration,
        opacity,
        delay,
      },
    };

    Browser.runtime.sendMessage(message);
    Logger.dev(
      `Media overlay triggered: ${mediaType} ${mediaUrl} at ${position.x}%,${position.y}% for ${duration}s`
    );
  } catch (error) {
    Logger.dev("Failed to send media overlay message:", error);
  }
};