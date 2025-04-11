import { FormSelect, FormSlider } from "@/components/form";
import { useAppContext } from "@/context";
import ratioOptions from "@/context/ratio-options";
import useWebcams from "@/hooks/use-web-cams";
import { useEffect } from "react";

type Props = {};

const SettingsForm = (props: Props) => {
  const {
    aspectRatio,
    setAspectRatio,
    setZoom: setZoomLevel,
    zoom: zoomLevel,
    cameraSource,
    setCameraSource,
  } = useAppContext();
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
          .map((cam) => ({ id: cam.deviceId, label: cam.label }))}
      />

      <FormSelect
        label="Aspect Ratio"
        id="aspect-ratio"
        value={aspectRatio}
        onChange={setAspectRatio}
        options={ratioOptions}
      />
      <FormSlider
        label="Zoom"
        id="zoom"
        value={zoomLevel}
        min={1}
        max={3}
        step={0.1}
        onChange={setZoomLevel}
      />
    </div>
  );
};

export default SettingsForm;
