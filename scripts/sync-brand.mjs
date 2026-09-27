// @ts-check
/**
 * Single-source-of-truth brand synchronizer.
 *
 * `brand.json` (repo root) is the ONLY file you should edit for brand values.
 * This script propagates those values into every consumer file:
 *   - structured JSON/TOML configs (tauri.conf.json, package.json, Cargo.toml)
 *   - generated typed wrappers (brand.ts, brand.rs, apps/web/data/brand.ts)
 *   - token-marked prose (README.md, apps/desktop/README.md)
 *   - line-keyed shell/ruby configs (setup.sh, setup.ps1, the Homebrew cask)
 *
 * Derived values (all computed from brand.json — nothing else to keep in sync):
 *   slug      → crate/binary name, db filename, storage-key prefix, cask token
 *   libName   → Rust lib crate name (`<slug with _>_lib`, referenced in main.rs)
 *   repoSlug  → "owner/repo" extracted from the repository URL
 *
 * Modes:
 *   pnpm sync-brand          rewrite all consumers from brand.json
 *   pnpm sync-brand --check  exit 1 if any consumer is out of sync (CI guard)
 */
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { format as prettierFormat } from "prettier";

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), "..");
const CHECK = process.argv.includes("--check");

/** Format generated TypeScript with the repo's Prettier rules so the output
 *  stays byte-identical to what `prettier` would produce in workspaces that
 *  format on demand (prevents endless sync/format drift). */
const formatTs = (code) =>
  prettierFormat(code, {
    parser: "typescript",
    endOfLine: "lf",
    semi: false,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "es5",
    printWidth: 80,
  });

/** @type {Record<string, string>} */
const raw = JSON.parse(
  readFileSync(path.join(REPO_ROOT, "brand.json"), "utf8"),
);
const brand = raw;

const repoSlug = brand.repository.replace(/^https:\/\/github\.com\//, "");
const repoGit = `${brand.repository}.git`;

// The Rust crate name. Hyphens are allowed in package names but become
// underscores when referenced as a lib (`cam-tuner` → `cam_tuner_lib`).
const crateName = brand.slug;
const libName = `${brand.slug.replace(/-/g, "_")}_lib`;

// Flat map of every token the prose markers can reference.
const markers = {
  appName: brand.appName,
  tagline: brand.tagline,
  slug: brand.slug,
  version: brand.version,
  identifier: brand.identifier,
  developerName: brand.developer.name,
  website: brand.developer.website,
  repository: brand.repository,
  repositoryGit: repoGit,
  repoSlug,
  downloadUrl: brand.downloadUrl,
  licenseUrl: brand.licenseUrl,
  updaterEndpoint: brand.updaterEndpoint,
  setupSh: brand.scripts.setupSh,
  setupPs1: brand.scripts.setupPs1,
  uninstallSh: brand.scripts.uninstallSh,
  uninstallPs1: brand.scripts.uninstallPs1,
  descriptionShort: brand.description.short,
  descriptionLong: brand.description.long,
  copyright: brand.copyright,
  homebrewTap: brand.homebrewTap,
};

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

const read = (rel) => {
  const abs = path.join(REPO_ROOT, rel);
  return existsSync(abs) ? readFileSync(abs, "utf8") : undefined;
};

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Replace every `<!-- @brand:KEY -->..../@brand:KEY -->` with the marker value. */
const applyInlineMarkers = (text) => {
  let out = text;
  for (const [key, val] of Object.entries(markers)) {
    const re = new RegExp(
      `(<!--\\s*@brand:${key}\\s*-->)([\\s\\S]*?)(<!--\\s*/@brand:${key}\\s*-->)`,
      "g",
    );
    out = out.replace(re, (_, open, _inner, close) => `${open}${val}${close}`);
  }
  return out;
};

/** Replace content between `# @brand:start <name>` / `# @brand:end <name>` shell block. */
const applyShellBlock = (text, name, block) =>
  text.replace(
    new RegExp(
      `(^#\\s*@brand:start\\s+${escRe(name)}\\s*\\n)([\\s\\S]*?)(^#\\s*@brand:end\\s+${escRe(name)})`,
      "m",
    ),
    (_, start, _inner, end) => `${start}${block}${end}`,
  );

/** Replace content between `<!-- @brand:start NAME -->` and `<!-- @brand:end NAME -->`.
 *  Used for markdown regions (e.g. badges) whose brand values can't sit inside a
 *  link's `()` (HTML comments there break CommonMark parsing): the whole region is
 *  regenerated from brand.json each run, with no comment tags left in the URL. */
const applyBlock = (text, name, block) =>
  text.replace(
    new RegExp(
      `(<!--\\s*@brand:start\\s+${escRe(name)}\\s*-->)([\\s\\S]*?)(<!--\\s*@brand:end\\s+${escRe(name)}\\s*-->)`,
    ),
    (_, start, _inner, end) => `${start}${block}${end}`,
  );

/** Set a `key = value` line in TOML; returns null if the key is absent. */
const setTomlField = (text, key, value) => {
  const re = new RegExp(`^(${escRe(key)}\\s*=\\s*).*$`, "m");
  if (!re.test(text)) return null;
  return text.replace(re, `$1${value}`);
};

/** Set the `name` field directly under a `[section]` header in TOML.
 *  (Comment lines between the header and the field are allowed.) */
const setTomlSectionName = (text, section, value) => {
  const re = new RegExp(
    `(\\[${escRe(section)}\\]\\n(?:#[^\\n]*\\n)*name\\s*=\\s*").*?(")`,
  );
  if (!re.test(text)) return null;
  return text.replace(re, `$1${value}$2`);
};

/** Set the `version` of a specific `[[package]]` entry in a Cargo.lock file. */
const setCargoLockPackageVersion = (text, packageName, version) => {
  const re = new RegExp(
    `(\\[\\[package\\]\\]\\nname = "${escRe(packageName)}"\\nversion = ").*?(")`,
  );
  if (!re.test(text)) {
    throw new Error(
      `sync-brand: package "${packageName}" not found in Cargo.lock`,
    );
  }
  return text.replace(re, `$1${version}$2`);
};

/** Rename a `[[package]]` entry in a Cargo.lock file (old → new name). */
const renameCargoLockPackage = (text, oldName, newName) => {
  const re = new RegExp(`(\\[\\[package\\]\\]\\nname = ")${escRe(oldName)}(")`);
  if (!re.test(text)) return text;
  return text.replace(re, `$1${newName}$2`);
};

/** Set a TOML field, inserting after `afterKey` when it does not yet exist. */
const upsertTomlField = (text, key, value, afterKey) => {
  const replaced = setTomlField(text, key, value);
  if (replaced !== null) return replaced;
  const re = new RegExp(`^(${escRe(afterKey)}\\s*=\\s*.*$)`, "m");
  return text.replace(re, `$1\n${key} = ${value}`);
};

/** Replace a line matching `prefix` with `replacement` (full line). */
const setLine = (text, prefix, replacement) => {
  const re = new RegExp(`^${escRe(prefix)}.*$`, "m");
  return text.replace(re, replacement);
};

// ---------------------------------------------------------------------------
// generated file bodies
// ---------------------------------------------------------------------------

const GENERATED_NOTE =
  "/**\n * GENERATED BY scripts/sync-brand.mjs — DO NOT EDIT BY HAND.\n * Source of truth: brand.json at the repo root. Run `pnpm sync-brand`.\n */";

const brandTs = `${GENERATED_NOTE}

export const brand = ${JSON.stringify(brand, null, 2)} as const;

export type Brand = typeof brand;
`;

const brandRs = `//! GENERATED BY scripts/sync-brand.mjs — DO NOT EDIT BY HAND.
//! Source of truth: brand.json at the repo root. Run \`pnpm sync-brand\`.
#![allow(dead_code)]

pub const APP_NAME: &str = ${JSON.stringify(brand.appName)};
pub const SLUG: &str = ${JSON.stringify(brand.slug)};
pub const IDENTIFIER: &str = ${JSON.stringify(brand.identifier)};
pub const DEVELOPER_NAME: &str = ${JSON.stringify(brand.developer.name)};
pub const WEBSITE: &str = ${JSON.stringify(brand.developer.website)};
pub const REPOSITORY: &str = ${JSON.stringify(brand.repository)};
pub const DOWNLOAD_URL: &str = ${JSON.stringify(brand.downloadUrl)};
pub const LICENSE_URL: &str = ${JSON.stringify(brand.licenseUrl)};
pub const COPYRIGHT: &str = ${JSON.stringify(brand.copyright)};
pub const HOMEBREW_TAP: &str = ${JSON.stringify(brand.homebrewTap)};
pub const SETUP_SCRIPT_URL: &str = ${JSON.stringify(brand.scripts.setupSh)};

/// App version, read from Cargo.toml at compile time.
pub const VERSION: &str = env!("CARGO_PKG_VERSION");
`;

// ---------------------------------------------------------------------------
// icon sync — regenerate every app icon from the canonical extension SVG
// ---------------------------------------------------------------------------

const collectFiles = (directory, prefix = "") => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory())
      return collectFiles(path.join(directory, entry.name), relative);
    return [relative.split(path.sep).join("/")];
  });
};

const filesMatch = (left, right) =>
  existsSync(left) &&
  existsSync(right) &&
  statSync(left).isFile() &&
  statSync(right).isFile() &&
  readFileSync(left).equals(readFileSync(right));

// This repo does not ship mobile icons (desktop-only tauri bundle).
const isIconDirPruned = (relative) =>
  relative.startsWith("ios/") || relative.startsWith("android/");

const syncAssets = () => {
  const source = path.join(REPO_ROOT, "apps/extension/assets/icon.svg");
  if (!existsSync(source)) {
    throw new Error(
      "sync-brand: missing apps/extension/assets/icon.svg; the canonical SVG logo must exist",
    );
  }

  const assetConsumers = ["apps/desktop/public/logo.svg"];
  const iconOutput = path.join(REPO_ROOT, "apps/desktop/src-tauri/icons");
  const temporaryIcons = mkdtempSync(path.join(tmpdir(), "cam-tuner-icons-"));
  const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

  try {
    execFileSync(
      pnpm,
      [
        "--filter",
        "@cam-tuner/desktop",
        "exec",
        "tauri",
        "icon",
        source,
        "--output",
        temporaryIcons,
      ],
      { cwd: REPO_ROOT, stdio: CHECK ? "ignore" : "inherit" },
    );

    const generatedIconFiles = collectFiles(temporaryIcons).filter(
      (relative) => !isIconDirPruned(relative),
    );
    const assetDrift = assetConsumers.filter(
      (consumer) => !filesMatch(source, path.join(REPO_ROOT, consumer)),
    );
    const currentIconFiles = collectFiles(iconOutput).filter(
      (relative) => !isIconDirPruned(relative),
    );
    const deterministicIconFiles = generatedIconFiles.filter(
      (relative) => relative !== "icon.icns",
    );
    const iconDrift = deterministicIconFiles.some(
      (relative) =>
        !filesMatch(
          path.join(temporaryIcons, relative),
          path.join(iconOutput, relative),
        ),
    );
    const staleIconFiles = currentIconFiles.some(
      (relative) => !generatedIconFiles.includes(relative),
    );
    const missingIcns = !existsSync(path.join(iconOutput, "icon.icns"));

    if (CHECK) {
      if (assetDrift.length || iconDrift || staleIconFiles || missingIcns) {
        console.error(
          "brand: icon assets out of sync — run `pnpm sync-brand`:",
        );
        for (const file of assetDrift) console.error(`  ${file}`);
        if (iconDrift || staleIconFiles || missingIcns) {
          console.error("  apps/desktop/src-tauri/icons/**");
        }
        throw new Error("brand: icon assets are out of sync");
      }
      return;
    }

    for (const consumer of assetConsumers) {
      const destination = path.join(REPO_ROOT, consumer);
      mkdirSync(path.dirname(destination), { recursive: true });
      copyFileSync(source, destination);
    }

    const preserveIcns = !iconDrift && !missingIcns;
    const existingIcns = preserveIcns
      ? readFileSync(path.join(iconOutput, "icon.icns"))
      : undefined;
    rmSync(iconOutput, { recursive: true, force: true });
    mkdirSync(iconOutput, { recursive: true });
    for (const relative of generatedIconFiles) {
      const destination = path.join(iconOutput, relative);
      mkdirSync(path.dirname(destination), { recursive: true });
      if (relative === "icon.icns" && existingIcns) {
        writeFileSync(destination, existingIcns);
      } else {
        copyFileSync(path.join(temporaryIcons, relative), destination);
      }
    }
  } finally {
    rmSync(temporaryIcons, { recursive: true, force: true });
  }
};

syncAssets();

const webBrandTs = `import envLib from "@/lib/env"

export const brand = ${JSON.stringify(
  {
    name: brand.appName,
    tagline: brand.tagline,
    title: `${brand.appName} — ${brand.tagline}`,
    baseUrl: "__WEB_URL__",
    description: brand.web.description,
    author: brand.appName,
    keywords: brand.web.keywords,
    social: { github: brand.repository },
    ogImage: brand.web.ogImage,
    footerLinks: [
      { name: "Privacy", url: "/privacy" },
      { name: "Terms", url: "/terms" },
      { name: "Github", url: brand.repository },
      { name: "Developer", url: brand.developer.website },
    ],
  },
  null,
  2,
)} as const
`;

const brandTsFormatted = await formatTs(brandTs);
const webBrandTsFormatted = await formatTs(
  webBrandTs.replace('"__WEB_URL__"', "envLib.webUrl"),
);

// ---------------------------------------------------------------------------
// transforms: each returns the desired file content for a relative path
// ---------------------------------------------------------------------------

const desktopPkg = JSON.parse(read("apps/desktop/package.json"));
desktopPkg.version = brand.version;
desktopPkg.description = `${brand.appName} desktop app — ${brand.description.short} Built with Tauri 2.`;
desktopPkg.homepage = brand.developer.website;
desktopPkg.repository.url = repoGit;
desktopPkg.keywords = ["tauri", "desktop", brand.slug];

const rootPkg = JSON.parse(read("package.json"));
rootPkg.version = brand.version;

const extensionPkg = JSON.parse(read("apps/extension/package.json"));
extensionPkg.version = brand.version;
extensionPkg.description = brand.extension.description;

const webPkg = JSON.parse(read("apps/web/package.json"));
webPkg.version = brand.version;

const tauriConf = JSON.parse(read("apps/desktop/src-tauri/tauri.conf.json"));
tauriConf.productName = brand.appName;
tauriConf.version = brand.version;
tauriConf.identifier = brand.identifier;
tauriConf.app.windows[0].title = brand.appName;
tauriConf.plugins.updater.endpoints[0] = brand.updaterEndpoint;
tauriConf.bundle.publisher = brand.developer.name;
tauriConf.bundle.copyright = brand.copyright;
tauriConf.bundle.shortDescription = brand.description.short;
tauriConf.bundle.longDescription = brand.description.long;

// Dev override config: keeps a separate identifier/productName so dev builds
// never collide with the installed production app.
const tauriDevConf = JSON.parse(
  read("apps/desktop/src-tauri/tauri.dev.conf.json"),
);
tauriDevConf.identifier = `${brand.identifier}.dev`;
tauriDevConf.productName = `${brand.appName} Dev`;

// Cargo.toml: rename the crate + lib BEFORE using the old name to patch
// Cargo.lock (which still refers to the pre-rename package).
const prevCargo = read("apps/desktop/src-tauri/Cargo.toml");
const prevCrateName = prevCargo.match(/\[package\]\s*\nname = "([^"]+)"/)?.[1];

let cargo = prevCargo;
cargo = setTomlSectionName(cargo, "package", crateName) ?? cargo;
cargo = setTomlSectionName(cargo, "lib", libName) ?? cargo;
cargo = upsertTomlField(cargo, "version", `"${brand.version}"`, "name");
cargo = upsertTomlField(
  cargo,
  "description",
  `"${brand.description.short}"`,
  "version",
);
cargo = upsertTomlField(
  cargo,
  "authors",
  `["${brand.developer.name}"]`,
  "edition",
);
cargo = upsertTomlField(
  cargo,
  "homepage",
  `"${brand.developer.website}"`,
  "authors",
);
cargo = upsertTomlField(
  cargo,
  "repository",
  `"${brand.repository}"`,
  "homepage",
);

let cargoLock = read("apps/desktop/src-tauri/Cargo.lock");
if (prevCrateName && prevCrateName !== crateName) {
  cargoLock = renameCargoLockPackage(cargoLock, prevCrateName, crateName);
}
cargoLock = setCargoLockPackageVersion(cargoLock, crateName, brand.version);

// main.rs: the lib crate reference follows the `<slug>_lib::run()` convention.
let mainRs = read("apps/desktop/src-tauri/src/main.rs");
mainRs = mainRs.replace(
  /^(\s*)[a-z0-9_]+::run\(\)$/m,
  `$1${libName}::run()`,
);

// index.html: window title + pre-hydration theme storage key (must match the
// storageKey in src/components/theme-provider.tsx, which reads brand.slug).
let indexHtml = read("apps/desktop/index.html");
indexHtml = indexHtml.replace(
  /(<title>)[^<]*(<\/title>)/,
  `$1${brand.appName}$2`,
);
indexHtml = indexHtml.replace(
  /localStorage\.getItem\("[^"]*"\)/,
  `localStorage.getItem("${brand.slug}-theme")`,
);

// Homebrew cask: fully regenerated from brand.json. version + sha256 are
// release-managed (CI seds them after each release), so they are preserved
// from the existing file when present.
const caskPath = `Casks/${brand.slug}.rb`;
const existingCask = read(caskPath) ?? "";
const caskVersion =
  existingCask.match(/version "([^"]*)"/)?.[1] ?? brand.version;
const caskSha = existingCask.match(/sha256 "([^"]*)"/)?.[1] ?? "no-hash-yet";
const cask = `cask "${brand.slug}" do
  arch arm: "aarch64"

  version "${caskVersion}"
  sha256 "${caskSha}"

  url "https://github.com/${repoSlug}/releases/download/v#{version}/${brand.appName}_#{version}_#{arch}.dmg"
  name "${brand.appName}"
  desc "${brand.description.short}"
  homepage "${brand.repository}"

  depends_on macos: :big_sur
  depends_on arch: :arm64

  app "${brand.appName}.app"

  # Unsigned/un-notarized build: strip the quarantine flag Gatekeeper adds on download.
  postflight do
    system_command "/usr/bin/xattr",
                    args: ["-cr", "#{appdir}/${brand.appName}.app"]
  end

  zap trash: [
    "~/Library/Application Support/${brand.identifier}",
    "~/Library/Caches/${brand.identifier}",
    "~/Library/Preferences/${brand.identifier}.plist",
    "~/Library/Saved Application State/${brand.identifier}.savedState",
  ]
end
`;

const shUsageBlock = `#   curl -fsSL ${brand.scripts.setupSh} | sh
#   curl -fsSL ${brand.scripts.setupSh} | sh -s -- v${brand.version}
`;
// Any remaining name references in the setup scripts (echo copy,
// /Applications paths, artifact names like "My App_1.0.0_amd64.deb", mktemp
// templates, env vars) follow the placeholder names Ordito/ordito/ORDITO —
// rewrite them.
const rebrandNames = (text) =>
  text
    .replace(/Ordito/g, () => brand.appName)
    .replace(/ordito/g, () => brand.slug)
    .replace(/ORDITO/g, () => brand.slug.toUpperCase());

const setupShSource = read("setup/unix.sh");
let setupSh;
if (setupShSource !== undefined) {
  let text = setupShSource;
  text = applyShellBlock(text, "usage", shUsageBlock);
  text = setLine(text, `APP_NAME=`, `APP_NAME="${brand.appName}"`);
  text = setLine(text, `PACKAGE=`, `PACKAGE="${brand.slug}"`);
  text = setLine(text, `TAP=`, `TAP="${brand.homebrewTap}"`);
  text = setLine(text, `TAP_URL=`, `TAP_URL="${repoGit}"`);
  text = setLine(text, `REPO=`, `REPO="${repoSlug}"`);
  text = setLine(
    text,
    `DEFAULT_VERSION=`,
    `DEFAULT_VERSION="v${brand.version}"`,
  );
  setupSh = rebrandNames(text);
}

const setupPs1Source = read("setup/windows.ps1");
let setupPs1;
if (setupPs1Source !== undefined) {
  let text = setupPs1Source;
  text = applyShellBlock(text, "usage", `#   irm ${brand.scripts.setupPs1} | iex\n`);
  text = setLine(text, `$Repo = `, `$Repo = "${repoSlug}"`);
  text = setLine(text, `$AppName = `, `$AppName = "${brand.appName}"`);
  text = setLine(
    text,
    `$DefaultVersion = `,
    `$DefaultVersion = "v${brand.version}"`,
  );
  setupPs1 = rebrandNames(text);
}

const uninstallShSource = read("setup/unix-uninstall.sh");
let uninstallSh;
if (uninstallShSource !== undefined) {
  let text = uninstallShSource;
  text = applyShellBlock(
    text,
    "usage",
    `#   curl -fsSL ${brand.scripts.uninstallSh} | sh\n`,
  );
  text = setLine(text, `TAP=`, `TAP="${brand.homebrewTap}"`);
  text = setLine(text, `REPO=`, `REPO="${repoSlug}"`);
  text = setLine(text, `IDENTIFIER=`, `IDENTIFIER="${brand.identifier}"`);
  text = setLine(text, `APP_NAME=`, `APP_NAME="${brand.appName}"`);
  text = setLine(text, `PACKAGE=`, `PACKAGE="${brand.slug}"`);
  uninstallSh = rebrandNames(text);
}

const uninstallPs1Source = read("setup/windows-uninstall.ps1");
let uninstallPs1;
if (uninstallPs1Source !== undefined) {
  let text = uninstallPs1Source;
  text = applyShellBlock(
    text,
    "usage",
    `#   irm ${brand.scripts.uninstallPs1} | iex\n`,
  );
  text = setLine(text, `$Repo = `, `$Repo = "${repoSlug}"`);
  text = setLine(text, `$Identifier = `, `$Identifier = "${brand.identifier}"`);
  text = setLine(text, `$AppName = `, `$AppName = "${brand.appName}"`);
  uninstallPs1 = rebrandNames(text);
}

// Markdown regions regenerated from brand.json. Blank lines around the content
// are intentional: without them the `<!-- @brand:start -->` comment (an HTML
// block) would absorb the adjacent markdown and stop it rendering on GitHub.
const downloadLinkBlock = `\n\n[![Download Desktop](https://img.shields.io/github/v/release/${repoSlug}?label=desktop%20download)](${brand.downloadUrl})\n\n`;

const readme = applyBlock(applyInlineMarkers(read("README.md")), "downloadLink", downloadLinkBlock);
const desktopReadme = applyInlineMarkers(read("apps/desktop/README.md"));

// ---------------------------------------------------------------------------
// apply
// ---------------------------------------------------------------------------

const targets = {
  "apps/desktop/src/lib/brand.ts": brandTsFormatted,
  "apps/extension/lib/brand.ts": brandTsFormatted,
  "apps/desktop/src-tauri/src/brand.rs": brandRs,
  "apps/web/data/brand.ts": webBrandTsFormatted,
  "apps/desktop/package.json": `${JSON.stringify(desktopPkg, null, 2)}\n`,
  "package.json": `${JSON.stringify(rootPkg, null, 2)}\n`,
  "apps/extension/package.json": `${JSON.stringify(extensionPkg, null, 2)}\n`,
  "apps/web/package.json": `${JSON.stringify(webPkg, null, 2)}\n`,
  "apps/desktop/src-tauri/tauri.conf.json": `${JSON.stringify(tauriConf, null, 2)}\n`,
  "apps/desktop/src-tauri/tauri.dev.conf.json": `${JSON.stringify(tauriDevConf, null, 2)}\n`,
  "apps/desktop/src-tauri/Cargo.toml": cargo,
  "apps/desktop/src-tauri/Cargo.lock": cargoLock,
  "apps/desktop/src-tauri/src/main.rs": mainRs,
  "apps/desktop/index.html": indexHtml,
  [caskPath]: cask,
  ...(setupSh && { "setup/unix.sh": setupSh }),
  ...(setupPs1 && { "setup/windows.ps1": setupPs1 }),
  ...(uninstallSh && { "setup/unix-uninstall.sh": uninstallSh }),
  ...(uninstallPs1 && { "setup/windows-uninstall.ps1": uninstallPs1 }),
  "README.md": readme,
  "apps/desktop/README.md": desktopReadme,
};

const drift = [];
for (const [rel, content] of Object.entries(targets)) {
  const current = read(rel);
  if (current === content) continue;
  drift.push(rel);
  if (!CHECK) writeFileSync(path.join(REPO_ROOT, rel), content, "utf8");
}

if (CHECK) {
  if (drift.length) {
    console.error("brand: out of sync — run `pnpm sync-brand` and recommit:");
    for (const f of drift) console.error(`  ${f}`);
    process.exit(1);
  }
  console.log("brand: in sync ✓");
} else {
  const wrote = drift.length;
  console.log(
    `brand: ${wrote === 0 ? "already in sync ✓" : `synced ${wrote} file${wrote === 1 ? "" : "s"} ✓`}`,
  );
}
