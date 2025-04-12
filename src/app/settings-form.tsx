import { FormSelect, FormSlider, FormSwitch } from "@/components/form";
import { useAppContext } from "@/context";
import ratioOptions from "@/context/ratio-options";
import useWebcams from "@/hooks/use-web-cams";
import { useEffect } from "react";

type Props = {};

const SettingsForm = (props: Props) => {
  const { cameraSource, setCameraSource, config, updateConfig } =
    useAppContext();
  const { mirror, zoom, aspectRatio } = config;
  const { webcams } = useWebcams();

  useEffect(() => {
    if (webcams.length > 0) {
      setCameraSource(webcams[0].deviceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcams]);

  return (
    <div className="space-y-5 p-5 border rounded-2xl">
      <FormSelect
        label="Source Camera"
        id="source-camera"
        value={cameraSource || ""}
        onChange={setCameraSource}
        options={webcams
          .filter((cam) => Boolean(cam.deviceId))
          .map((cam) => ({ value: cam.deviceId, label: cam.label }))}
      />

      <FormSelect
        label="Aspect Ratio"
        id="aspect-ratio"
        value={String(aspectRatio)}
        onChange={(value) =>
          updateConfig("aspectRatio")(Number(value) || ratioOptions[0].value)
        }
        options={ratioOptions.map((item) => ({
          ...item,
          value: String(item.value),
        }))}
      />
      <FormSlider
        label="Zoom"
        id="zoom"
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        onChange={updateConfig("zoom")}
      />

      <FormSwitch
        label="Mirror"
        id="mirror"
        checked={mirror}
        onChange={updateConfig("mirror")}
        layout="single-line"
      />
    </div>
  );
};

export default SettingsForm;
