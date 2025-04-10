import { FormSelect, FormSlider } from "@/components/form";
import { useAppContext } from "@/context";
import ratioOptions from "@/context/ratio-options";

type Props = {};

const SettingsForm = (props: Props) => {
  const {
    aspectRatio,
    setAspectRatio,
    setZoomLevel,
    zoomLevel,
    cameraSource,
    setCameraSource,
  } = useAppContext();
  return (
    <div className="space-y-5 p-5 border rounded-2xl">
      <FormSelect
        label="Source Camera"
        id="source-camera"
        value={cameraSource || ""}
        onChange={setCameraSource}
        options={[]}
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
