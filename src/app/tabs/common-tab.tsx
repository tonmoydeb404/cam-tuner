import { FormSelect, FormTabs } from "@/components/form";
import { FeatureCard } from "@/components/ui/feature-card";
import { useAppContext } from "@/context/app";
import ratioOptions from "@/context/app/ratio-options";
import { useWebcamsContext } from "@/context/webcams";
import { Camera, Frame } from "lucide-react";

type Props = {
  showCameraSelection?: boolean;
};

const CommonTab = (props: Props) => {
  const { showCameraSelection } = props;
  const { cameraSource, setCameraSource, config, updateConfig } =
    useAppContext();
  const { aspectRatio, align, mirror } = config;
  const { webcams } = useWebcamsContext();

  const hasMultipleCameras = webcams.length > 1;

  return (
    <div className="space-y-4">
      {/* Camera Selection Section */}
      {showCameraSelection && (
        <FeatureCard
          title="Camera Source"
          icon={Camera}
          badge={hasMultipleCameras ? `${webcams.length} available` : undefined}
          badgeVariant="default"
        >
          <FormSelect
            label="Active Camera"
            id="source-camera"
            value={cameraSource?.deviceId || ""}
            onChange={(value) =>
              setCameraSource(
                webcams.find((item) => item.deviceId === value) ?? null
              )
            }
            options={webcams
              .filter((cam) => Boolean(cam.deviceId))
              .map((cam) => ({
                value: cam.deviceId,
                label: cam.label || `Camera ${cam.deviceId.slice(-4)}`,
              }))}
          />
        </FeatureCard>
      )}

      {/* Frame Settings Section */}
      <FeatureCard title="Frame Configuration" icon={Frame}>
        <div className="space-y-4">
          <FormSelect
            label="Aspect Ratio"
            id="aspect-ratio"
            value={String(aspectRatio)}
            onChange={(value) =>
              updateConfig("aspectRatio")(
                Number(value) || ratioOptions[0].value
              )
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
            onChange={updateConfig("align")}
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
            onChange={(value) => updateConfig("mirror")(value === "true")}
            options={[
              { label: "Off", value: "false" },
              { label: "On", value: "true" },
            ]}
          />
        </div>
      </FeatureCard>
    </div>
  );
};

export default CommonTab;
