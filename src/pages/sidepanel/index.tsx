import SidepanelContent from "@/app/sidepanel";
import ThemeProvider from "@/components/providers/theme-provider";
import ErrorBoundary from "@/components/ui/error-boundary";
import { AppContextProvider } from "@/context/app";
import { WebcamsContextProvider } from "@/context/webcams";
import PermissionGuard from "@/guards/permission-guard";
import WebcamsGuard from "@/guards/webcams-guard";
import { createRoot } from "react-dom/client";
import "../../styles/index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <ErrorBoundary>
    <ThemeProvider>
      <AppContextProvider>
        <WebcamsContextProvider>
          <PermissionGuard>
            <WebcamsGuard>
              <SidepanelContent />
            </WebcamsGuard>
          </PermissionGuard>
        </WebcamsContextProvider>
      </AppContextProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
