"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface IMediaOverlay {
  position: { x: number; y: number }; // Position as percentage (0-100)
  scale: number; // Scale multiplier (0.1-5)
  duration: number; // Duration in seconds
  opacity: number; // Opacity as percentage (0-100)
  delay: number; // Delay in seconds
}

export interface IMediaOverlayContext {
  mediaOverlay: IMediaOverlay;
  setMediaOverlay: React.Dispatch<React.SetStateAction<IMediaOverlay>>;
  updateMediaOverlay: <K extends keyof IMediaOverlay>(
    key: K
  ) => (value: IMediaOverlay[K]) => void;
  resetMediaOverlay: () => void;
  selectedGifUrl: string | null;
  setSelectedGifUrl: (url: string | null) => void;
}

const defaultMediaOverlay: IMediaOverlay = {
  position: { x: 50, y: 50 },
  scale: 1,
  duration: 3,
  opacity: 100,
  delay: 0,
};

const defaultValue: IMediaOverlayContext = {
  mediaOverlay: defaultMediaOverlay,
  setMediaOverlay: () => {},
  updateMediaOverlay: () => () => {},
  resetMediaOverlay: () => {},
  selectedGifUrl: null,
  setSelectedGifUrl: () => {},
};

const MediaOverlayContext = createContext(defaultValue);

export const useMediaOverlayContext = () => useContext(MediaOverlayContext);

type Props = {
  children: ReactNode;
};

export const MediaOverlayContextProvider = (props: Props) => {
  const { children } = props;

  const [mediaOverlay, setMediaOverlay] = useState(defaultMediaOverlay);
  const [selectedGifUrl, setSelectedGifUrl] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("mediaOverlay");
    if (stored) {
      try {
        const savedMediaOverlay = JSON.parse(stored) as Partial<IMediaOverlay>;
        setMediaOverlay((prev) => ({
          ...prev,
          position: savedMediaOverlay.position ?? prev.position,
          scale: savedMediaOverlay.scale ?? prev.scale,
          duration: savedMediaOverlay.duration ?? prev.duration,
          opacity: savedMediaOverlay.opacity ?? prev.opacity,
          delay: savedMediaOverlay.delay ?? prev.delay,
        }));
      } catch (e) {
        console.error("Failed to parse media overlay config:", e);
      }
    }
  }, []);

  const saveMediaOverlay = useCallback((mediaOverlayData: IMediaOverlay) => {
    localStorage.setItem("mediaOverlay", JSON.stringify(mediaOverlayData));
  }, []);

  const updateMediaOverlay: IMediaOverlayContext["updateMediaOverlay"] =
    (key) => (value) => {
      setMediaOverlay((prev) => {
        const newMediaOverlay = { ...prev, [key]: value };
        saveMediaOverlay(newMediaOverlay);
        return newMediaOverlay;
      });
    };

  const resetMediaOverlay = useCallback(() => {
    const newMediaOverlay = { ...defaultMediaOverlay };
    setMediaOverlay(newMediaOverlay);
    saveMediaOverlay(newMediaOverlay);
  }, [saveMediaOverlay]);

  const updateSetMediaOverlay = useCallback(
    (newMediaOverlay: React.SetStateAction<IMediaOverlay>) => {
      setMediaOverlay((prev) => {
        const updated =
          typeof newMediaOverlay === "function"
            ? newMediaOverlay(prev)
            : newMediaOverlay;
        saveMediaOverlay(updated);
        return updated;
      });
    },
    [saveMediaOverlay]
  );

  const value: IMediaOverlayContext = {
    mediaOverlay,
    setMediaOverlay: updateSetMediaOverlay,
    updateMediaOverlay,
    resetMediaOverlay,
    selectedGifUrl,
    setSelectedGifUrl,
  };

  return (
    <MediaOverlayContext.Provider value={value}>
      {children}
    </MediaOverlayContext.Provider>
  );
};
