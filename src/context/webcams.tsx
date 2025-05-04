import useWebcams from "@/hooks/use-web-cams";
import { createContext, ReactNode, useContext } from "react";

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
  const response = useWebcams();

  return (
    <WebcamsContext.Provider value={response}>
      {children}
    </WebcamsContext.Provider>
  );
};
