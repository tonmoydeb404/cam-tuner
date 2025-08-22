import "../../styles/index.css";
import ErrorBoundary from "@/components/ui/error-boundary";
import useTheme from "@/hooks/use-theme";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import OptionsPage from "./options-page";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme(); // Initialize system theme detection
  return <>{children}</>;
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <OptionsPage />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
