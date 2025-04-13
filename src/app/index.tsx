import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context";
import EnableGuard from "@/guards/enable-guard";
import Header from "./header";
import PreferenceForm from "./preference-form";
import Preview from "./preview";
import SettingsForm from "./settings-form";

type Props = {};

const App = (props: Props) => {
  const { applySettings: saveToStorage } = useAppContext();

  return (
    <div className="p-5">
      <Header />
      <EnableGuard>
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
      </EnableGuard>
    </div>
  );
};

export default App;
