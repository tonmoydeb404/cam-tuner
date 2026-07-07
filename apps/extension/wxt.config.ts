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
    // MediaPipe (Center Stage) compiles WebAssembly on extension pages. MV3
    // requires 'wasm-unsafe-eval' (NOT 'unsafe-eval', which is blocked).
    content_security_policy: {
      extension_pages:
        "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
    },
    // Local WASM assets + the on-demand MediaPipe adapter must be reachable
    // from the MAIN-world content script (loaded via import()/fetch() when
    // Center Stage is enabled).
    web_accessible_resources: [
      {
        resources: [
          "wasm/*",
          "mediapipe-adapter.js",
          "mediapipe-segmenter-adapter.js",
          "rvm-segmenter-adapter.js",
          "rvm-mobilenetv3-fp32.onnx",
        ],
        matches: ["<all_urls>"],
      },
    ],
  },
  autoIcons: {
    enabled: true,
    baseIconPath: "./assets/icon.svg",
  } satisfies AutoIconsOptions,
})
