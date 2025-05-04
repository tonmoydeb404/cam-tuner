import { FormSelect } from "@/components/form";
import { useAppContext } from "@/context/app";
import ratioOptions from "@/context/app/ratio-options";
import { useWebcamsContext } from "@/context/webcams";

type Props = {};

const CommonTab = (props: Props) => {
  const { cameraSource, setCameraSource, config, updateConfig } =
    useAppContext();
  const { aspectRatio } = config;
  const { webcams } = useWebcamsContext();

  return (
    <div className="space-y-5 p-5 border rounded-2xl">
      <FormSelect
        label="Source Camera"
        id="source-camera"
        value={cameraSource?.deviceId || ""}
        onChange={(value) =>
          setCameraSource(
            webcams.find((item) => item.deviceId === value) ?? null
          )
        }
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
    </div>
  );
};

export default CommonTab;
