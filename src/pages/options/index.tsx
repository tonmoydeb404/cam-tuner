import OptionsContent from "@/app/options";
import ThemeProvider from "@/components/providers/theme-provider";
import ErrorBoundary from "@/components/ui/error-boundary";
import { createRoot } from "react-dom/client";
import "../../styles/index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <ErrorBoundary>
    <ThemeProvider>
      <OptionsContent />
    </ThemeProvider>
  </ErrorBoundary>
);
