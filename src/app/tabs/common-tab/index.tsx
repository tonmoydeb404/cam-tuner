import { Accordion } from "@/components/ui/accordion";
import CameraSettings from "./camera-settings";
import CropSettings from "./crop-settings";
import PlaceholderSettings from "./placeholder-settings";
import ZoomSettings from "./zoom-settings";

type Props = {
  showCameraSelection?: boolean;
};

const CommonTab = (props: Props) => {
  const { showCameraSelection } = props;

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {showCameraSelection && <CameraSettings />}
      <CropSettings />
      <ZoomSettings />
      <PlaceholderSettings />
    </Accordion>
  );
};

export default CommonTab;
