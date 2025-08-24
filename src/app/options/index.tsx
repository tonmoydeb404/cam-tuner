import useWebcamPermission from "@/hooks/use-webcam-permission";
import PreviewSection from "./preview";
import SettingsSection from "./settings";

type Props = {};

const OptionsContent = (props: Props) => {
  const { hasPermission, isSupported, requestPermission } =
    useWebcamPermission();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-8 space-y-2">
        {isSupported && hasPermission && <PreviewSection />}
        <SettingsSection
          hasPermission={hasPermission}
          isSupported={isSupported}
          requestPermission={requestPermission}
        />
      </div>
    </div>
  );
};

export default OptionsContent;
