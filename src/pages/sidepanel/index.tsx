import SidepanelContent from "@/app/sidepanel";
import ThemeProvider from "@/components/providers/theme-provider";
import ErrorBoundary from "@/components/ui/error-boundary";
import { AppContextProvider } from "@/context/app";
import { ConfettiContextProvider } from "@/context/confetti";
import { CropProvider } from "@/context/crop";
import { MediaOverlayContextProvider } from "@/context/media-overlay";
import { WebcamsContextProvider } from "@/context/webcams";
import { createRoot } from "react-dom/client";
import "../../styles/index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <ErrorBoundary>
    <ThemeProvider>
      <AppContextProvider>
        <CropProvider>
          <MediaOverlayContextProvider>
            <ConfettiContextProvider>
              <WebcamsContextProvider>
                <SidepanelContent />
              </WebcamsContextProvider>
            </ConfettiContextProvider>
          </MediaOverlayContextProvider>
        </CropProvider>
      </AppContextProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
