import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { AppContextProvider } from "./context";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </StrictMode>
);
