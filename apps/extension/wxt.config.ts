import { AutoIconsOptions } from "@wxt-dev/auto-icons"
import { defineConfig } from "wxt"

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  dev: { server: { port: 3001 } },
  manifest: {
    permissions: ["storage", "activeTab"],
    host_permissions: ["http://localhost:3000/*", "*://*/*"],
  },
  autoIcons: {
    enabled: true,
    baseIconPath: "./assets/icon.svg",
  } satisfies AutoIconsOptions,
})
