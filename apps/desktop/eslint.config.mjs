import { config as reactConfig } from "@workspace/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...reactConfig,
  {
    ignores: ["dist/**", "src-tauri/**"],
  },
];
