import { Accordion } from "@/components/ui/accordion";
import CameraSettings from "./camera-settings";
import CropSettings from "./crop-settings";
import ZoomSettings from "./zoom-settings";

type Props = {
  showCameraSelection?: boolean;
};

const CommonTab = (props: Props) => {
  const { showCameraSelection } = props;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="frame"
      className="space-y-4"
    >
      {showCameraSelection && <CameraSettings />}
      <CropSettings />
      <ZoomSettings />
    </Accordion>
  );
};

export default CommonTab;
