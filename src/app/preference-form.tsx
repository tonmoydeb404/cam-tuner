import { FormSlider } from "@/components/form";
import { useAppContext } from "@/context";

type Props = {};

const PreferenceForm = (props: Props) => {
  const {
    brightness,
    contrast,
    saturation,
    setBrightness,
    setContrast,
    setSaturation,
  } = useAppContext();

  return (
    <div className="space-y-3 border p-5 rounded-2xl">
      <FormSlider
        label="Brightness"
        id="brightness"
        value={brightness}
        min={0}
        max={200}
        step={1}
        onChange={setBrightness}
      />

      <FormSlider
        label="Contrast"
        id="contrast"
        value={contrast}
        min={0}
        max={200}
        step={1}
        onChange={setContrast}
      />

      <FormSlider
        label="Saturation"
        id="saturation"
        value={saturation}
        min={0}
        max={200}
        step={1}
        onChange={setSaturation}
      />
    </div>
  );
};

export default PreferenceForm;
