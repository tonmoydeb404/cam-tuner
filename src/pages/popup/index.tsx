import App from "@/app";
import ErrorBoundary from "@/components/ui/error-boundary";
import { AppContextProvider } from "@/context/app";
import { WebcamsContextProvider } from "@/context/webcams";
import PermissionGuard from "@/guards/permission-guard";
import WebcamsGuard from "@/guards/webcams-guard";
import useTheme from "@/hooks/use-theme";
import { createRoot } from "react-dom/client";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme(); // Initialize system theme detection
  return <>{children}</>;
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ThemeProvider>
      <AppContextProvider>
        <WebcamsContextProvider>
          <PermissionGuard>
            <WebcamsGuard>
              <App />
            </WebcamsGuard>
          </PermissionGuard>
        </WebcamsContextProvider>
      </AppContextProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
