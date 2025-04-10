import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreferenceForm from "./preference-form";
import SettingsForm from "./settings-form";

type Props = {};

const App = (props: Props) => {
  return (
    <div className="p-5">
      <h1 className="text-lg font-bold mb-5">Cam Tuner</h1>
      <video
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        className="aspect-video rounded-xl mb-5 w-full"
      />
      <div className="flex flex-col mb-5">
        <Button>Save Settings</Button>
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
