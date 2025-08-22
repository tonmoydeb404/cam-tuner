import "../../styles/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import OptionsPage from "./options-page";
import useTheme from "@/hooks/use-theme";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme(); // Initialize system theme detection
  return <>{children}</>;
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <ThemeProvider>
      <OptionsPage />
    </ThemeProvider>
  </StrictMode>
);
