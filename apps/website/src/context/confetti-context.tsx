"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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

const defaultConfetti: IConfetti = {
  intensity: 50,
  duration: 3,
};

const defaultValue: IConfettiContext = {
  confetti: defaultConfetti,
  setConfetti: () => {},
  updateConfetti: () => () => {},
  resetConfetti: () => {},
};

const ConfettiContext = createContext(defaultValue);

export const useConfettiContext = () => useContext(ConfettiContext);

type Props = {
  children: ReactNode;
};

export const ConfettiContextProvider = (props: Props) => {
  const { children } = props;

  const [confetti, setConfetti] = useState(defaultConfetti);

  useEffect(() => {
    const stored = localStorage.getItem("confetti");
    if (stored) {
      try {
        const savedConfetti = JSON.parse(stored) as Partial<IConfetti>;
        setConfetti((prev) => ({
          ...prev,
          intensity: savedConfetti.intensity ?? prev.intensity,
          duration: savedConfetti.duration ?? prev.duration,
        }));
      } catch (e) {
        console.error("Failed to parse confetti config:", e);
      }
    }
  }, []);

  const saveConfetti = useCallback((confettiData: IConfetti) => {
    localStorage.setItem("confetti", JSON.stringify(confettiData));
  }, []);

  const updateConfetti: IConfettiContext["updateConfetti"] = (key) => (value) => {
    setConfetti((prev) => {
      const newConfetti = { ...prev, [key]: value };
      saveConfetti(newConfetti);
      return newConfetti;
    });
  };

  const resetConfetti = useCallback(() => {
    const newConfetti = { ...defaultConfetti };
    setConfetti(newConfetti);
    saveConfetti(newConfetti);
  }, [saveConfetti]);

  const updateSetConfetti = useCallback(
    (newConfetti: React.SetStateAction<IConfetti>) => {
      setConfetti((prev) => {
        const updated = typeof newConfetti === "function" ? newConfetti(prev) : newConfetti;
        saveConfetti(updated);
        return updated;
      });
    },
    [saveConfetti]
  );

  const value: IConfettiContext = {
    confetti,
    setConfetti: updateSetConfetti,
    updateConfetti,
    resetConfetti,
  };

  return (
    <ConfettiContext.Provider value={value}>{children}</ConfettiContext.Provider>
  );
};
