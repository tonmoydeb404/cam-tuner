import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import webExtension from "vite-plugin-web-extension";

const target = process.env.TARGET || "chrome";

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BROWSER__: JSON.stringify(target),
  },
  plugins: [
    webExtension({
      additionalInputs: ["src/extension/inject.ts"],
      browser: target,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
