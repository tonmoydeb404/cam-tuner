import { describe, expect, it } from "vitest"
import { tunerConfigToCropConfig, tunerUpdateToCropUpdate } from "../config"
import type { TunerConfig } from "../../tuner-types"
import { DEFAULT_TUNER_CONFIG } from "../../tuner-types"

describe("tunerConfigToCropConfig", () => {
  it("converts default config", () => {
    const result = tunerConfigToCropConfig(DEFAULT_TUNER_CONFIG)
    expect(result).toEqual({
      aspectRatio: 16 / 9,
      zoom: 1,
      alignX: "center",
      alignY: "center",
      barColor: "#000000",
    })
  })

  it("converts custom config with non-default values", () => {
    const config: TunerConfig = {
      aspectRatio: "4:3",
      zoom: 2.5,
      align: "top-left",
      barColor: "#ff0000",
    }
    expect(tunerConfigToCropConfig(config)).toEqual({
      aspectRatio: 4 / 3,
      zoom: 2.5,
      alignX: "left",
      alignY: "top",
      barColor: "#ff0000",
    })
  })

  it("defaults barColor to #000000 when empty", () => {
    const result = tunerConfigToCropConfig({
      ...DEFAULT_TUNER_CONFIG,
      barColor: "",
    })
    expect(result.barColor).toBe("#000000")
  })
})

describe("tunerUpdateToCropUpdate", () => {
  it("returns empty object for empty input", () => {
    expect(tunerUpdateToCropUpdate({})).toEqual({})
  })

  it("converts aspectRatio update", () => {
    expect(tunerUpdateToCropUpdate({ aspectRatio: "4:3" })).toEqual({
      aspectRatio: 4 / 3,
    })
  })

  it("converts zoom update", () => {
    expect(tunerUpdateToCropUpdate({ zoom: 2 })).toEqual({ zoom: 2 })
  })

  it("converts align update", () => {
    expect(tunerUpdateToCropUpdate({ align: "bottom-right" })).toEqual({
      alignX: "right",
      alignY: "bottom",
    })
  })

  it("converts barColor update", () => {
    expect(tunerUpdateToCropUpdate({ barColor: "#abc" })).toEqual({
      barColor: "#abc",
    })
  })

  it("converts multiple fields at once", () => {
    expect(
      tunerUpdateToCropUpdate({
        aspectRatio: "1:1",
        zoom: 3,
        align: "top-center",
      })
    ).toEqual({
      aspectRatio: 1,
      zoom: 3,
      alignX: "center",
      alignY: "top",
    })
  })

  it("only includes fields that are present", () => {
    const result = tunerUpdateToCropUpdate({ zoom: 1.5 })
    expect(result).not.toHaveProperty("aspectRatio")
    expect(result).not.toHaveProperty("alignX")
    expect(result).not.toHaveProperty("barColor")
  })
})
