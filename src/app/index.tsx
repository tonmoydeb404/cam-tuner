import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnableGuard from "@/guards/enable-guard";
import ApplyBtn from "./apply-btn";
import Header from "./header";
import Preview from "./preview";
import AdvancedTab from "./tabs/advanced-tab";
import PreferenceTab from "./tabs/preference-tab";
import SettingsTab from "./tabs/settings-tab";

type Props = {};

const App = (props: Props) => {
  return (
    <div className="p-5">
      <Header />
      <EnableGuard>
        <Preview />
        <ApplyBtn />

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="mb-5 w-full">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preference">Preference</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
          <TabsContent value="preference">
            <PreferenceTab />
          </TabsContent>
          <TabsContent value="advanced">
            <AdvancedTab />
          </TabsContent>
        </Tabs>
      </EnableGuard>
    </div>
  );
};

export default App;
