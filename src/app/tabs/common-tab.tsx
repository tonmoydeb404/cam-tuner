import { FormSelect, FormSlider, FormTabs } from "@/components/form";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import { useAppContext } from "@/context/app";
import ratioOptions from "@/context/app/ratio-options";
import { useWebcamsContext } from "@/context/webcams";
import useThrottle from "@/hooks/use-throttle";
import { Camera, Frame, ZoomIn } from "lucide-react";

type Props = {
  showCameraSelection?: boolean;
};

const CommonTab = (props: Props) => {
  const { showCameraSelection } = props;
  const { cameraSource, setCameraSource, config, updateConfig } =
    useAppContext();
  const { aspectRatio, align, mirror, zoom } = config;
  const { webcams } = useWebcamsContext();

  const throttledUpdateZoom = useThrottle(updateConfig("zoom"), 50);

  const hasMultipleCameras = webcams.length > 1;

  return (
    <div className="space-y-4">
      {/* Camera Selection Section */}
      {showCameraSelection && webcams?.length > 0 && (
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

      {/* Zoom Controls Section */}
      <FeatureCard 
        title="Digital Zoom" 
        description="Magnify your camera feed digitally"
        icon={ZoomIn}
        badge={zoom !== 1 ? `${zoom.toFixed(1)}x` : undefined}
        badgeVariant={zoom !== 1 ? "warning" : "default"}
      >
        <FormSlider
          label="Zoom Level"
          id="zoom"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={throttledUpdateZoom}
          unit="x"
          formatValue={(val) => val.toFixed(1)}
        />

        {/* Quick zoom presets */}
        <div className="pt-4 border-t border-border/30">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Quick Presets
          </h4>

          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateConfig("zoom")(1)}
              disabled={zoom === 1}
              className="text-xs justify-center"
            >
              1x
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => updateConfig("zoom")(1.5)}
              disabled={Math.abs(zoom - 1.5) < 0.05}
              className="text-xs justify-center"
            >
              1.5x
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => updateConfig("zoom")(2)}
              disabled={Math.abs(zoom - 2) < 0.05}
              className="text-xs justify-center"
            >
              2x
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => updateConfig("zoom")(3)}
              disabled={Math.abs(zoom - 3) < 0.05}
              className="text-xs justify-center"
            >
              3x
            </Button>
          </div>
        </div>
      </FeatureCard>
    </div>
  );
};

export default CommonTab;
