#!/usr/bin/env node

import { execSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const ROOT = resolve(process.cwd())
const TARGETS = [
  "package.json",
  "apps/web/package.json",
  "apps/extension/package.json",
]

function run(cmd, options = {}) {
  return execSync(cmd, {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  })
    .toString()
    .trim()
}

function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/)
  if (!match) {
    throw new Error(`Invalid semver version: ${version}`)
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  }
}

function nextVersion(current, bump) {
  const v = parseVersion(current)

  if (bump === "major") {
    return `${v.major + 1}.0.0`
  }

  if (bump === "minor") {
    return `${v.major}.${v.minor + 1}.0`
  }

  if (bump === "patch") {
    return `${v.major}.${v.minor}.${v.patch + 1}`
  }

  parseVersion(bump)
  return bump
}

function readJson(filePath) {
  return JSON.parse(readFileSync(resolve(ROOT, filePath), "utf8"))
}

function writeJson(filePath, data) {
  const fullPath = resolve(ROOT, filePath)
  writeFileSync(fullPath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
}

function usage() {
  console.log(
    `\nUsage:\n  pnpm release:tag <major|minor|patch|x.y.z> [--dry-run] [--no-push]\n\nExamples:\n  pnpm release:tag patch\n  pnpm release:tag 2.1.0\n  pnpm release:tag minor --dry-run\n`
  )
}

function main() {
  const args = process.argv.slice(2)
  const bumpOrVersion = args[0]
  const dryRun = args.includes("--dry-run")
  const noPush = args.includes("--no-push")

  if (!bumpOrVersion || bumpOrVersion.startsWith("-")) {
    usage()
    process.exit(1)
  }

  for (const filePath of TARGETS) {
    if (!existsSync(resolve(ROOT, filePath))) {
      throw new Error(`Missing target file: ${filePath}`)
    }
  }

  const rootPkg = readJson("package.json")
  const currentVersion = rootPkg.version
  const newVersion = nextVersion(currentVersion, bumpOrVersion)
  const tag = `v${newVersion}`

  if (newVersion === currentVersion) {
    throw new Error(`Version is unchanged (${newVersion}).`)
  }

  if (dryRun) {
    console.log(
      `Dry run complete. Would set version ${currentVersion} -> ${newVersion} in:`
    )
    for (const filePath of TARGETS) {
      console.log(`- ${filePath}`)
    }
    console.log(`Would create tag: ${tag}`)
    return
  }

  // Keep release commits predictable and avoid tagging unreviewed work.
  const status = run("git status --porcelain")
  if (status) {
    throw new Error(
      "Git working tree is not clean. Commit or stash changes first."
    )
  }

  const existingTag = run(`git tag -l ${tag}`)
  if (existingTag === tag) {
    throw new Error(`Tag already exists: ${tag}`)
  }

  for (const filePath of TARGETS) {
    const pkg = readJson(filePath)
    pkg.version = newVersion
    writeJson(filePath, pkg)
  }

  const files = TARGETS.join(" ")
  run(`git add ${files}`)
  run(`git commit -m "chore(release): ${tag}"`, { stdio: "inherit" })
  run(`git tag -a ${tag} -m "Release ${tag}"`)

  if (!noPush) {
    run("git push", { stdio: "inherit" })
    run("git push --tags", { stdio: "inherit" })
  }

  console.log(
    `Released ${tag} and synced versions in ${TARGETS.length} package files.`
  )
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
}
