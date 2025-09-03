import PopupContent from "@/app/popup";
import ThemeProvider from "@/components/providers/theme-provider";
import ErrorBoundary from "@/components/ui/error-boundary";
import { AppContextProvider } from "@/context/app";
import { ConfettiContextProvider } from "@/context/confetti";
import { CropProvider } from "@/context/crop";
import { FilterProvider } from "@/context/filter";
import { MediaOverlayContextProvider } from "@/context/media-overlay";
import { PlaceholderProvider } from "@/context/placeholder";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ThemeProvider>
      <AppContextProvider>
        <CropProvider>
          <FilterProvider>
            <PlaceholderProvider>
              <MediaOverlayContextProvider>
                <ConfettiContextProvider>
                  <PopupContent />
                </ConfettiContextProvider>
              </MediaOverlayContextProvider>
            </PlaceholderProvider>
          </FilterProvider>
        </CropProvider>
      </AppContextProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
