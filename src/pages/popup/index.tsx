import App from "@/app";
import { AppContextProvider } from "@/context";
import "@/styles/index.css";
import "@/styles/popup.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </StrictMode>
);
