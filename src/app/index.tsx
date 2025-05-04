import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnableGuard from "@/guards/enable-guard";
import { useState } from "react";
import ApplyBtn from "./apply-btn";
import Header from "./header";
import Preview from "./preview";
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
        <div className="flex items-start gap-x-8">
          <div className="w-[350px] shrink-0 flex flex-col justify-between h-full">
            <Preview />
            <ApplyBtn onTroubleshoot={() => setTab("troubleshoot")} />
          </div>
          <div className="grow">
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
        </div>
      </EnableGuard>
    </div>
  );
};

export default App;
