import CameraSettings from "./camera-settings";
import CropSettings from "./crop-settings";
import ZoomSettings from "./zoom-settings";

type Props = {
  showCameraSelection?: boolean;
};

const CommonTab = (props: Props) => {
  const { showCameraSelection } = props;

  return (
    <div className="space-y-4">
      {showCameraSelection && <CameraSettings />}
      <CropSettings />
      <ZoomSettings />
    </div>
  );
};

export default CommonTab;
