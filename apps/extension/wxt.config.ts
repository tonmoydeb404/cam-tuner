import { AutoIconsOptions } from "@wxt-dev/auto-icons"
import { defineConfig } from "wxt"

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  dev: { server: { port: 3001 } },
  zip: {
    artifactTemplate: "cam-tuner-{{version}}-{{browser}}.zip",
    sourcesTemplate: "cam-tuner-{{version}}-sources.zip",
  },
  manifest: {
    permissions: ["storage"],
    host_permissions: [
      import.meta.env.VITE_WEB_URL
        ? `${import.meta.env.VITE_WEB_URL}/*`
        : "http://localhost:3000/*",
      "*://*/*",
    ],
    name: "CamTuner",
  },
  autoIcons: {
    enabled: true,
    baseIconPath: "./assets/icon.svg",
  } satisfies AutoIconsOptions,
})
