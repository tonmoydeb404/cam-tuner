import useWebcams from "@/hooks/use-web-cams";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useAppContext } from "./app";

const defaultValue: ReturnType<typeof useWebcams> = {
  loading: true,
  webcams: [],
};

const WebcamsContext = createContext(defaultValue);

// ----------------------------------------------------------------------

export const useWebcamsContext = () => useContext(WebcamsContext);

// ----------------------------------------------------------------------

type Props = { children: ReactNode };
export const WebcamsContextProvider = ({ children }: Props) => {
  const { initCameraSource } = useAppContext();
  const { loading, webcams } = useWebcams();

  useEffect(() => {
    if (webcams[0]?.deviceId) {
      initCameraSource(webcams[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcams]);

  return (
    <WebcamsContext.Provider value={{ loading, webcams }}>
      {children}
    </WebcamsContext.Provider>
  );
};
