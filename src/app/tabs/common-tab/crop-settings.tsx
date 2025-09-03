import { FormInput, FormSelect, FormTabs } from "@/components/form";
import { FeatureCard } from "@/components/ui/feature-card";
import ratioOptions from "@/context/app/ratio-options";
import { useCrop } from "@/context/crop";
import useThrottle from "@/hooks/use-throttle";
import { Frame } from "lucide-react";

type Props = {};

const CropSettings = (props: Props) => {
  const { cropConfig, updateCrop } = useCrop();
  const { align, aspectRatio, mirror, enableLetterbox, letterboxBgColor } =
    cropConfig;

  const throttledUpdateBgColor = useThrottle(
    updateCrop("letterboxBgColor"),
    50
  );

  return (
    <FeatureCard
      title="Frame Configuration"
      icon={Frame}
      type="accordion-item"
      value="frame"
    >
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

        <FormTabs
          label="Fit to Frame"
          id="enable-letterbox"
          value={enableLetterbox ? "true" : "false"}
          onChange={(value) => updateCrop("enableLetterbox")(value === "true")}
          options={[
            { label: "Off", value: "false" },
            { label: "On", value: "true" },
          ]}
        />

        {enableLetterbox && (
          <FormInput
            id="letterbox-bg-color"
            label="Background Color"
            value={letterboxBgColor ?? "#000000"}
            onChange={throttledUpdateBgColor}
            type="color"
          />
        )}
      </div>
    </FeatureCard>
  );
};

export default CropSettings;
