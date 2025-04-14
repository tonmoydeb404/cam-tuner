import App from "@/app";
import { AppContextProvider } from "@/context";
import PermissionGuard from "@/guards/permission-guard";
import WebcamsGuard from "@/guards/webcams-guard";
import "@/styles/popup.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppContextProvider>
      <PermissionGuard>
        <WebcamsGuard>
          <App />
        </WebcamsGuard>
      </PermissionGuard>
    </AppContextProvider>
  </StrictMode>
);
