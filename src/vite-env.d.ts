/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CAM_NAME: string
  readonly VITE_CAM_VERSION: string
  readonly VITE_KLIPY_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __BROWSER__: string;
