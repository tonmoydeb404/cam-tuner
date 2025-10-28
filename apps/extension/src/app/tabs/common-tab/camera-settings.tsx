import { FormSelect } from "@/components/form";
import { FeatureCard } from "@/components/ui/feature-card";
import { useAppContext } from "@/context/app";
import { useWebcamsContext } from "@/context/webcams";
import { Camera } from "lucide-react";

type Props = {};

const CameraSettings = (props: Props) => {
  const { cameraSource, setCameraSource } = useAppContext();
  const { webcams } = useWebcamsContext();

  const hasMultipleCameras = webcams.length > 1;

  if (!webcams?.length) return null;

  return (
    <FeatureCard
      title="Camera Source"
      value="camera"
      icon={Camera}
      badge={hasMultipleCameras ? `${webcams.length} available` : undefined}
      badgeVariant="default"
      type="accordion-item"
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
  );
};

export default CameraSettings;
