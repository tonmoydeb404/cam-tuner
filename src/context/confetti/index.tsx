import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Browser from "webextension-polyfill";
import { IConfetti, IConfettiContext } from "./types";

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

// ----------------------------------------------------------------------

export const useConfettiContext = () => useContext(ConfettiContext);

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export const ConfettiContextProvider = (props: Props) => {
  const { children } = props;

  const [confetti, setConfetti] = useState(defaultConfetti);

  // ----------------------------------------------------------------------

  useEffect(() => {
    Browser.storage?.sync.get(["confetti"]).then((result) => {
      if (typeof result.confetti === "object") {
        const savedConfetti = result.confetti as Partial<IConfetti>;
        setConfetti((prev) => ({
          ...prev,
          intensity: savedConfetti.intensity ?? prev.intensity,
          duration: savedConfetti.duration ?? prev.duration,
        }));
      }
    });
  }, []);

  // ----------------------------------------------------------------------

  const saveConfetti = useCallback((confettiData: IConfetti) => {
    const storageData = {
      confetti: confettiData,
    };
    Browser.storage.sync.set(storageData);
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

  // ----------------------------------------------------------------------

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