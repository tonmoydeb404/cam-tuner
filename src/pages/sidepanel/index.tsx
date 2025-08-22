import ErrorBoundary from "@/components/ui/error-boundary";
import { AppContextProvider } from "@/context/app";
import { WebcamsContextProvider } from "@/context/webcams";
import PermissionGuard from "@/guards/permission-guard";
import WebcamsGuard from "@/guards/webcams-guard";
import useTheme from "@/hooks/use-theme";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/index.css";
import SidePanel from "./sidepanel";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme(); // Initialize system theme detection
  return <>{children}</>;
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AppContextProvider>
          <WebcamsContextProvider>
            <PermissionGuard>
              <WebcamsGuard>
                <SidePanel />
              </WebcamsGuard>
            </PermissionGuard>
          </WebcamsContextProvider>
        </AppContextProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
