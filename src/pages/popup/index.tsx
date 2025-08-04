import App from "@/app";
import { AppContextProvider } from "@/context/app";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <AppContextProvider>
    <App />
  </AppContextProvider>
);
