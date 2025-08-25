import PopupContent from "@/app/popup";
import ThemeProvider from "@/components/providers/theme-provider";
import ErrorBoundary from "@/components/ui/error-boundary";
import { AppContextProvider } from "@/context/app";
import { ConfettiContextProvider } from "@/context/confetti";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ThemeProvider>
      <AppContextProvider>
        <ConfettiContextProvider>
          <PopupContent />
        </ConfettiContextProvider>
      </AppContextProvider>
    </ThemeProvider>
  </ErrorBoundary>
);
