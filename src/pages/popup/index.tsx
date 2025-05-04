import App from "@/app";
import { AppContextProvider } from "@/context/app";
import { WebcamsContextProvider } from "@/context/webcams";
import PermissionGuard from "@/guards/permission-guard";
import WebcamsGuard from "@/guards/webcams-guard";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <AppContextProvider>
    <WebcamsContextProvider>
      <PermissionGuard>
        <WebcamsGuard>
          <App />
        </WebcamsGuard>
      </PermissionGuard>
    </WebcamsContextProvider>
  </AppContextProvider>
);
