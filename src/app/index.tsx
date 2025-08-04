import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnableGuard from "@/guards/enable-guard";
import { useState } from "react";
import Header from "./header";
import CommonTab from "./tabs/common-tab";
import PreferenceTab from "./tabs/preference-tab";
import TroubleshootTab from "./tabs/troubleshoot-tab";

type Props = {};

const App = (props: Props) => {
  const [tab, setTab] = useState<string>("common");

  return (
    <div className="p-5">
      <Header />
      <EnableGuard>
        <div className="">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-3 w-full">
              <TabsTrigger value="common">Common</TabsTrigger>
              <TabsTrigger value="preference">Preference</TabsTrigger>
              <TabsTrigger value="troubleshoot">Troubleshoot</TabsTrigger>
            </TabsList>
            <TabsContent value="common">
              <CommonTab />
            </TabsContent>
            <TabsContent value="preference">
              <PreferenceTab />
            </TabsContent>
            <TabsContent value="troubleshoot">
              <TroubleshootTab />
            </TabsContent>
          </Tabs>
        </div>
      </EnableGuard>
    </div>
  );
};

export default App;
