import { ConfettiMessage, MessageTypeEnum } from "@/types/window-message";
import Browser from "webextension-polyfill";
import { Logger } from "./log";

export const triggerConfetti = async (
  confettiType: string,
  colors: string[],
  intensity: number,
  duration: number
) => {
  try {
    const message: ConfettiMessage = {
      type: MessageTypeEnum.CONFETTI,
      payload: {
        confettiType,
        colors,
        intensity,
        duration,
      },
    };

    Browser.runtime.sendMessage(message);
    Logger.dev(
      `Confetti triggered: ${confettiType} with intensity ${intensity}% for ${duration}s`
    );
  } catch (error) {
    Logger.dev("Failed to send confetti message:", error);
  }
};
