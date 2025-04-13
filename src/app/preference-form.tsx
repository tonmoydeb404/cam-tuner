import { FormSlider } from "@/components/form";
import { useAppContext } from "@/context";

type Props = {};

const PreferenceForm = (props: Props) => {
  const { config, updateConfig } = useAppContext();
  const { brightness, contrast, saturation } = config;

  return (
    <div className="space-y-5 border p-5 rounded-2xl">
      <FormSlider
        label="Brightness"
        id="brightness"
        value={brightness}
        min={0}
        max={200}
        step={1}
        onChange={updateConfig("brightness")}
      />

      <FormSlider
        label="Contrast"
        id="contrast"
        value={contrast}
        min={0}
        max={200}
        step={1}
        onChange={updateConfig("contrast")}
      />

      <FormSlider
        label="Saturation"
        id="saturation"
        value={saturation}
        min={0}
        max={200}
        step={1}
        onChange={updateConfig("saturation")}
      />
    </div>
  );
};

export default PreferenceForm;
