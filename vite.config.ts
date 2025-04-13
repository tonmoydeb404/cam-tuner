import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import webExtension from "vite-plugin-web-extension";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    webExtension({
      additionalInputs: ["src/extension/inject.ts"],
      browser: process.env.TARGET || "chrome",
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
