import { AppProviders } from "@/components/providers/app-providers";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/index.css";
import SidePanel from "./sidepanel";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <AppProviders>
      <SidePanel />
    </AppProviders>
  </StrictMode>
);
