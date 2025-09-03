import { FormSelect, FormTabs } from "@/components/form";
import { FeatureCard } from "@/components/ui/feature-card";
import ratioOptions from "@/context/app/ratio-options";
import { useCrop } from "@/context/crop";
import { Frame } from "lucide-react";

type Props = {};

const CropSettings = (props: Props) => {
  const { cropConfig, updateCrop } = useCrop();
  const { align, aspectRatio, mirror } = cropConfig;

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
      </div>
    </FeatureCard>
  );
};

export default CropSettings;
