import useTheme from "@/hooks/use-theme";
import { ReactNode } from "react";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  useTheme(); // Initialize system theme detection
  return <>{children}</>;
};

export default ThemeProvider;
