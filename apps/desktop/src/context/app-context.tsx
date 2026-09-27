import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { api, onUpdateAvailable } from "../lib/api";
import type { UpdateInfo } from "../types";

type AppContextValue = {
  loading: boolean;
  error: string | null;

  settings: Record<string, string>;
  updateSetting: (key: string, value: string) => Promise<void>;

  updateInfo: UpdateInfo | null;
  isInstallingUpdate: boolean;
  dismissUpdate: () => void;
  installUpdate: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isInstallingUpdate, setIsInstallingUpdate] = useState(false);

  // ---- Data loading ----

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const backendSettings = await api.getSettings();
        if (cancelled) return;
        setSettings(backendSettings);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Event listeners ----

  useEffect(() => {
    const unlistenUpdatePromise = onUpdateAvailable((payload) => {
      setUpdateInfo(payload);
    });

    return () => {
      unlistenUpdatePromise.then((fn) => fn());
    };
  }, []);

  // ---- Settings ----

  const updateSetting = useCallback(async (key: string, value: string) => {
    await api.setSetting(key, value);
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ---- Updater ----

  const dismissUpdate = useCallback(() => setUpdateInfo(null), []);

  const installUpdate = useCallback(async () => {
    setIsInstallingUpdate(true);
    try {
      await api.installUpdate();
    } catch (err) {
      toast.error("Failed to install update", {
        description: err instanceof Error ? err.message : String(err),
      });
      setIsInstallingUpdate(false);
    }
  }, []);

  const value: AppContextValue = {
    loading,
    error,
    settings,
    updateSetting,
    updateInfo,
    isInstallingUpdate,
    dismissUpdate,
    installUpdate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}
