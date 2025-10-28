import SidepanelContent from "@/app/sidepanel";
import ThemeProvider from "@/components/providers/theme-provider";
import ErrorBoundary from "@/components/ui/error-boundary";
import { AppContextProvider } from "@/context/app";
import { ConfettiContextProvider } from "@/context/confetti";
import { CropProvider } from "@/context/crop";
import { FilterProvider } from "@/context/filter";
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
          <FilterProvider>
            <MediaOverlayContextProvider>
              <ConfettiContextProvider>
                <WebcamsContextProvider>
                  <SidepanelContent />
                </WebcamsContextProvider>
              </ConfettiContextProvider>
            </MediaOverlayContextProvider>
          </FilterProvider>
        </CropProvider>
      </AppContextProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
