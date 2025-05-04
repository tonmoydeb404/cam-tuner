import { FormSlider, FormSwitch } from "@/components/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/app";
import { IAppConfig } from "@/context/app/types";

type Props = {};

const AdvancedTab = (props: Props) => {
  const { config, updateConfig } = useAppContext();
  const { mirror, zoom, align } = config;

  return (
    <div className="space-y-5 p-5 border rounded-2xl">
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
        label="Mirror Camera"
        id="mirror"
        checked={mirror}
        onChange={updateConfig("mirror")}
        layout="double-line"
      />

      <Tabs
        value={align}
        onValueChange={(v) =>
          updateConfig("align")(v as unknown as IAppConfig["align"])
        }
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="left">Left</TabsTrigger>
          <TabsTrigger value="center">Center</TabsTrigger>
          <TabsTrigger value="right">Right</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AdvancedTab;
