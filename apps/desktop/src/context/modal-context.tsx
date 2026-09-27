import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SimpleModal = {
  isOpen: boolean;
  value: null;
  open: () => void;
  close: () => void;
};

type ValueModal<T> = {
  isOpen: boolean;
  value: T | null;
  open: (value: T) => void;
  close: () => void;
};

function useSimpleModal(): SimpleModal {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return useMemo(
    () => ({ isOpen, value: null, open, close }),
    [isOpen, open, close],
  );
}

function useValueModal<T>(): ValueModal<T> {
  const [value, setValue] = useState<T | null>(null);
  const open = useCallback((v: T) => setValue(v), []);
  const close = useCallback(() => setValue(null), []);
  return useMemo(
    () => ({ isOpen: value !== null, value, open, close }),
    [value, open, close],
  );
}

type ModalContextValue = {
  alert: ValueModal<string>;
  settings: SimpleModal;
  command: SimpleModal;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const alert = useValueModal<string>();
  const settings = useSimpleModal();
  const command = useSimpleModal();

  const value = useMemo<ModalContextValue>(
    () => ({
      alert,
      settings,
      command,
    }),
    [alert, settings, command],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
}
