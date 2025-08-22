import App from "@/app";
import { AppProviders } from "@/components/providers/app-providers";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <App />
  </AppProviders>
);
