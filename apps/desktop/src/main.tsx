import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { AppThemeProvider } from "./components/theme-provider";
import { displayName } from "./lib/display-name";

import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "./index.css";

// Window title carries the env postfix ("CamTuner Dev" in dev) — the Rust
// side sets the native title too; this keeps the document in sync.
document.title = displayName;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </React.StrictMode>,
);
