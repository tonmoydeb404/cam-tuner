import { FormSelect, FormSwitch, FormTabs } from "@/components/form";
import { FeatureCard } from "@/components/ui/feature-card";
import ratioOptions from "@/context/app/ratio-options";
import { useCrop } from "@/context/crop";
import { Frame } from "lucide-react";

type Props = {};

const CropSettings = (props: Props) => {
  const { cropConfig, updateCrop } = useCrop();
  const { align, aspectRatio, mirror, enableLetterbox, letterboxBgColor } =
    cropConfig;

  return (
    <FeatureCard title="Frame Configuration" icon={Frame}>
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

        <FormTabs
          label="Crop Align"
          id="align"
          value={align || "center"}
          onChange={updateCrop("align")}
          options={[
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ]}
        />

        <FormTabs
          label="Mirror"
          id="mirror"
          value={mirror ? String(mirror) : "false"}
          onChange={(value) => updateCrop("mirror")(value === "true")}
          options={[
            { label: "Off", value: "false" },
            { label: "On", value: "true" },
          ]}
        />

        <FormSwitch
          label="Enable Letterbox"
          id="enable-letterbox"
          checked={enableLetterbox || false}
          onChange={updateCrop("enableLetterbox")}
        />

        {enableLetterbox && (
          <div className="space-y-2">
            <label
              htmlFor="letterbox-bg-color"
              className="block text-sm font-medium"
            >
              Letterbox Background Color
            </label>
            <input
              type="color"
              id="letterbox-bg-color"
              value={letterboxBgColor || "#000000"}
              onChange={(e) => updateCrop("letterboxBgColor")(e.target.value)}
              className="w-16 h-8 rounded border border-gray-300 cursor-pointer"
            />
          </div>
        )}
      </div>
    </FeatureCard>
  );
};

export default CropSettings;
