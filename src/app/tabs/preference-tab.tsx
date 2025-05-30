import { FormSlider } from "@/components/form";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app";

type Props = {};

const PreferenceTab = (props: Props) => {
  const { config, updateConfig } = useAppContext();
  const { brightness, contrast, saturation, zoom } = config;

  return (
    <div className="space-y-5 border p-5 rounded-2xl">
      <FormSlider
        label="Zoom"
        id="zoom"
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        onChange={updateConfig("zoom")}
      />

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

      <Button
        variant={"outline"}
        className="w-full"
        onClick={() => {
          updateConfig("brightness")(100);
          updateConfig("contrast")(100);
          updateConfig("saturation")(100);
          updateConfig("zoom")(1);
        }}
      >
        Reset Default
      </Button>
    </div>
  );
};

export default PreferenceTab;
