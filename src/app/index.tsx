import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context";
import PreferenceForm from "./preference-form";
import Preview from "./preview";
import SettingsForm from "./settings-form";

type Props = {};

const App = (props: Props) => {
  const { saveToStorage } = useAppContext();

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
