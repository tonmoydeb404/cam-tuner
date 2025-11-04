"use client";

import { FormSlider } from "@/components/form/form-slider";
import { FormSelect } from "@/components/form/form-select";
import { useCrop } from "@/context/crop-context";
import ratioOptions from "@/lib/ratio-options";
import useThrottle from "@/hooks/use-throttle";

export function CropSettings() {
  const { cropConfig, updateCrop } = useCrop();
  const { align, aspectRatio, mirror, zoom } = cropConfig;

  const throttledUpdateZoom = useThrottle(updateCrop("zoom"), 50);

  return (
    <div className="space-y-4">
      <FormSelect
        label="Aspect Ratio"
        id="aspect-ratio"
        value={String(aspectRatio)}
        onChange={(value) =>
          updateCrop("aspectRatio")(Number(value) || ratioOptions[0].value)
        }
        options={ratioOptions.map((item) => ({
          ...item,
          value: String(item.value),
        }))}
      />

      <FormSelect
        label="Align"
        id="align"
        value={align}
        onChange={(value) => updateCrop("align")(value as typeof align)}
        options={[
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ]}
      />

      <FormSelect
        label="Mirror"
        id="mirror"
        value={mirror ? "true" : "false"}
        onChange={(value) => updateCrop("mirror")(value === "true")}
        options={[
          { label: "Off", value: "false" },
          { label: "On", value: "true" },
        ]}
      />

      <FormSlider
        label="Digital Zoom"
        id="zoom"
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        onChange={throttledUpdateZoom}
        unit="x"
        formatValue={(val) => val.toFixed(1)}
      />
    </div>
  );
}
