import { defineConfig } from "wxt"

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  dev: { server: { port: 3001 } },
  manifest: {
    permissions: ["storage", "activeTab"],
    host_permissions: ["http://localhost:3000/*", "*://*/*"],
  },
})
