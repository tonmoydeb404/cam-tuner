import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnableGuard from "@/guards/enable-guard";
import { useState } from "react";
import ApplyBtn from "./apply-btn";
import Header from "./header";
import Preview from "./preview";
import AdvancedTab from "./tabs/advanced-tab";
import CommonTab from "./tabs/common-tab";
import PreferenceTab from "./tabs/preference-tab";
import UsageTab from "./tabs/usage-tab";

type Props = {};

const App = (props: Props) => {
  const [tab, setTab] = useState<string>("common");

  return (
    <div className="p-5">
      <Header />
      <EnableGuard>
        <div className="flex items-start gap-x-8">
          <div className="w-[350px] shrink-0 flex flex-col justify-between h-full">
            <Preview />
            <ApplyBtn onTroubleshoot={() => setTab("usage")} />
          </div>
          <div className="grow">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="mb-3 w-full">
                <TabsTrigger value="common">Common</TabsTrigger>
                <TabsTrigger value="preference">Preference</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
              </TabsList>
              <TabsContent value="common">
                <CommonTab />
              </TabsContent>
              <TabsContent value="preference">
                <PreferenceTab />
              </TabsContent>
              <TabsContent value="advanced">
                <AdvancedTab />
              </TabsContent>
              <TabsContent value="usage">
                <UsageTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </EnableGuard>
    </div>
  );
};

export default App;
