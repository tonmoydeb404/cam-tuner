import { ReactNode } from "react";
import ErrorBoundary from "@/components/ui/error-boundary";
import { AppContextProvider } from "@/context/app";
import { MediaOverlayContextProvider } from "@/context/media-overlay";
import { PlaceholderProvider } from "@/context/placeholder";
import { WebcamsContextProvider } from "@/context/webcams";
import PermissionGuard from "@/guards/permission-guard";
import WebcamsGuard from "@/guards/webcams-guard";
import useTheme from "@/hooks/use-theme";

/**
 * Theme provider component that initializes system theme detection
 */
function ThemeProvider({ children }: { children: ReactNode }) {
  useTheme(); // Initialize system theme detection
  return <>{children}</>;
}

/**
 * Centralized app providers component
 * Eliminates provider duplication across page entry points
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContextProvider>
          <MediaOverlayContextProvider>
            <PlaceholderProvider>
              <WebcamsContextProvider>
                <PermissionGuard>
                  <WebcamsGuard>
                    {children}
                  </WebcamsGuard>
                </PermissionGuard>
              </WebcamsContextProvider>
            </PlaceholderProvider>
          </MediaOverlayContextProvider>
        </AppContextProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}