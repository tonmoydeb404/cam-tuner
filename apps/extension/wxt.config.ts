import { AutoIconsOptions } from "@wxt-dev/auto-icons"
import { execFileSync } from "node:child_process"
import { defineConfig } from "wxt"

// web-ext looks for a plain `firefox` binary on $PATH. On machines where
// Firefox is only installed via Flatpak, fall back to a shim script (see
// apps/extension/scripts/firefox-flatpak.sh) so `pnpm dev:firefox` works
// without every contributor needing extra setup.
function resolveFirefoxBinary(): string | undefined {
  try {
    execFileSync("which", ["firefox"], { stdio: "ignore" })
    return undefined // native binary found, let web-ext use its default
  } catch {
    try {
      execFileSync("flatpak", ["info", "org.mozilla.firefox"], {
        stdio: "ignore",
      })
      return "./scripts/firefox-flatpak.sh"
    } catch {
      return undefined // neither found — let web-ext surface its own error
    }
  }
}

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  dev: { server: { port: 3001 } },
  webExt: (() => {
    const firefox = resolveFirefoxBinary()
    return firefox ? { binaries: { firefox } } : undefined
  })(),
  zip: {
    artifactTemplate: "cam-tuner-{{version}}-{{browser}}.zip",
    sourcesTemplate: "cam-tuner-{{version}}-sources.zip",
  },
  manifest: {
    permissions: ["storage", "scripting"],
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
