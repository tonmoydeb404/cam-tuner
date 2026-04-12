/**
 * Migrates settings from the old extension (v1) to the new storage format.
 *
 * Old extension stored data under browser.storage.sync:
 *   - enable: boolean
 *   - cameraSource: { label: string, deviceId: string }
 *   - cropConfig: { aspectRatio: number, zoom: number, align: "left"|"center"|"right",
 *                   mirror: boolean, enableLetterbox: boolean, letterboxBgColor: string | null }
 *   - filterConfig: { brightness: number, contrast: number, saturation: number }
 *
 * New extension stores data under browser.storage.local (via WXT):
 *   - tunerConfig: TunerConfig
 *   - virtualCamEnabled: boolean
 *   - selectedCameraLabel: string | null
 */

import {
  type AlignPosition,
  type AspectRatio,
  type TunerConfig,
  DEFAULT_TUNER_CONFIG,
} from "@workspace/stream-config"
import { selectedCameraLabel, tunerConfig, virtualCamEnabled } from "./storage"

const MIGRATION_KEY = "local:v1MigrationDone"

// ── Helpers ──────────────────────────────────────────────────────────────────

interface OldCropConfig {
  aspectRatio?: number
  zoom?: number
  align?: "left" | "center" | "right"
  letterboxBgColor?: string | null
}

interface OldSyncData {
  enable?: boolean
  cameraSource?: { label?: string; deviceId?: string }
  cropConfig?: OldCropConfig
}

function mapAspectRatio(value: number | undefined): AspectRatio {
  // Old values: 16/9 ≈ 1.777, 4/3 ≈ 1.333, 1, 3/4 = 0.75, 9/16 = 0.5625
  if (value === undefined) return DEFAULT_TUNER_CONFIG.aspectRatio
  if (Math.abs(value - 16 / 9) < 0.01) return "16:9"
  if (Math.abs(value - 4 / 3) < 0.01) return "4:3"
  if (Math.abs(value - 1) < 0.01) return "1:1"
  if (Math.abs(value - 9 / 16) < 0.01) return "9:16"
  // 3:4 was in old options but isn't in the new system — default to 9:16 (closest portrait)
  if (value < 1) return "9:16"
  return DEFAULT_TUNER_CONFIG.aspectRatio
}

function mapAlign(
  value: "left" | "center" | "right" | undefined
): AlignPosition {
  switch (value) {
    case "left":
      return "center-left"
    case "right":
      return "center-right"
    case "center":
    default:
      return "center"
  }
}

// ── Main migration ────────────────────────────────────────────────────────────

export async function migrateFromV1(): Promise<void> {
  try {
    // Check if migration has already run
    const marker = await browser.storage.local.get(
      MIGRATION_KEY.replace("local:", "")
    )
    if (marker[MIGRATION_KEY.replace("local:", "")]) return

    // Read old sync storage — failure here means no old extension data, treat as nothing to migrate
    let old: OldSyncData = {}
    try {
      old = (await browser.storage.sync.get([
        "enable",
        "cameraSource",
        "cropConfig",
      ])) as OldSyncData
    } catch {
      // Sync storage unavailable (e.g. offline, permissions): mark done and skip
      await browser.storage.local.set({ v1MigrationDone: true })
      return
    }

    // Nothing to migrate if old extension was never used
    const hasOldData =
      old.enable !== undefined ||
      old.cameraSource !== undefined ||
      old.cropConfig !== undefined

    if (!hasOldData) {
      await browser.storage.local.set({ v1MigrationDone: true })
      return
    }

    const crop = old.cropConfig ?? {}

    const newTunerConfig: TunerConfig = {
      aspectRatio: mapAspectRatio(crop.aspectRatio),
      zoom:
        typeof crop.zoom === "number" ? crop.zoom : DEFAULT_TUNER_CONFIG.zoom,
      align: mapAlign(crop.align),
      barColor:
        typeof crop.letterboxBgColor === "string" && crop.letterboxBgColor
          ? crop.letterboxBgColor
          : DEFAULT_TUNER_CONFIG.barColor,
    }

    // Write all new values first, then mark complete.
    // If writes fail, the marker is NOT set so migration retries on next update.
    await tunerConfig.setValue(newTunerConfig)
    await virtualCamEnabled.setValue(
      typeof old.enable === "boolean" ? old.enable : true
    )
    await selectedCameraLabel.setValue(
      typeof old.cameraSource?.label === "string"
        ? old.cameraSource.label
        : null
    )
    await browser.storage.local.set({ v1MigrationDone: true })

    console.debug("CamTuner: migrated settings from v1", newTunerConfig)
  } catch (error) {
    // Never crash the background service worker — migration will retry on next update
    console.error(
      "CamTuner: v1 migration failed, will retry on next update",
      error
    )
  }
}
