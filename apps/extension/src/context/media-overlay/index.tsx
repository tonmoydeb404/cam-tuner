import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Browser from "webextension-polyfill";
import { IMediaOverlay, IMediaOverlayContext } from "./types";

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
};

const MediaOverlayContext = createContext(defaultValue);

// ----------------------------------------------------------------------

export const useMediaOverlayContext = () => useContext(MediaOverlayContext);

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export const MediaOverlayContextProvider = (props: Props) => {
  const { children } = props;

  const [mediaOverlay, setMediaOverlay] = useState(defaultMediaOverlay);

  // ----------------------------------------------------------------------

  useEffect(() => {
    Browser.storage?.sync.get(["mediaOverlay"]).then((result) => {
      if (typeof result.mediaOverlay === "object") {
        const savedMediaOverlay = result.mediaOverlay as Partial<IMediaOverlay>;
        setMediaOverlay((prev) => ({
          ...prev,
          position: savedMediaOverlay.position ?? prev.position,
          scale: savedMediaOverlay.scale ?? prev.scale,
          duration: savedMediaOverlay.duration ?? prev.duration,
          opacity: savedMediaOverlay.opacity ?? prev.opacity,
          delay: savedMediaOverlay.delay ?? prev.delay,
        }));
      }
    });
  }, []);

  // ----------------------------------------------------------------------

  const saveMediaOverlay = useCallback((mediaOverlayData: IMediaOverlay) => {
    const storageData = {
      mediaOverlay: mediaOverlayData,
    };
    Browser.storage.sync.set(storageData);
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

  // ----------------------------------------------------------------------

  const value: IMediaOverlayContext = {
    mediaOverlay,
    setMediaOverlay: updateSetMediaOverlay,
    updateMediaOverlay,
    resetMediaOverlay,
  };

  return (
    <MediaOverlayContext.Provider value={value}>
      {children}
    </MediaOverlayContext.Provider>
  );
};
