import React from "react";

export interface IConfetti {
  intensity: number;
  duration: number;
}

export interface IConfettiContext {
  confetti: IConfetti;
  setConfetti: React.Dispatch<React.SetStateAction<IConfetti>>;
  updateConfetti: <K extends keyof IConfetti>(
    key: K
  ) => (value: IConfetti[K]) => void;
  resetConfetti: () => void;
}