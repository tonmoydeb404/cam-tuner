import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context";
import useWebcamPermission from "@/hooks/use-webcam-permission";
import { LucideCamera, LucideCameraOff } from "lucide-react";
import Browser from "webextension-polyfill";
import PreferenceForm from "./preference-form";
import Preview from "./preview";
import SettingsForm from "./settings-form";

type Props = {};

const App = (props: Props) => {
  const { saveToStorage } = useAppContext();
  const { hasPermission, isSupported } = useWebcamPermission();

  if (!isSupported) {
    return (
      <div className="px-5 py-10 text-center flex flex-col items-center justify-center">
        <LucideCameraOff size={34} className="mb-4 text-muted-foreground" />
        <h1 className="text-lg font-bold mb-1">Camera Access Not Supported</h1>
        <p className="text-sm text-muted-foreground">
          Your browser doesn't support camera devices, or access has been
          restricted. Please check your browser settings or try a different one.
        </p>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="px-5 py-10 text-center flex flex-col items-center justify-center">
        <LucideCamera size={34} className="mb-4 text-muted-foreground" />
        <h1 className="text-lg font-bold mb-1">Camera Permission Needed</h1>
        <p className="text-sm text-muted-foreground mb-4">
          To continue, please allow access to your camera in the browser
          settings.
        </p>
        <Button onClick={() => Browser.runtime.openOptionsPage()}>
          Allow Access
        </Button>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-lg font-bold mb-5">Cam Tuner</h1>
      <Preview />
      <div className="flex flex-col mb-5">
        <Button onClick={() => saveToStorage()}>Save Settings</Button>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="mb-5 w-full">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="preference">Preference</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <SettingsForm />
        </TabsContent>
        <TabsContent value="preference">
          <PreferenceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default App;
