import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/app";
import EnableGuard from "@/guards/enable-guard";
import useKeyboardShortcuts from "@/hooks/use-keyboard-shortcuts";
import { useState } from "react";
import Header from "./header";
import CommonTab from "./tabs/common-tab";
import PreferenceTab from "./tabs/preference-tab";
import TroubleshootTab from "./tabs/troubleshoot-tab";

type Props = {};

const App = (props: Props) => {
  const [tab, setTab] = useState<string>("common");
  const { enable, setEnable } = useAppContext();

  // Keyboard shortcuts
  useKeyboardShortcuts(
    [
      {
        key: "1",
        action: () => setTab("common"),
        description: "Switch to Camera tab",
      },
      {
        key: "2",
        action: () => setTab("preference"),
        description: "Switch to Effects tab",
      },
      {
        key: "3",
        action: () => setTab("troubleshoot"),
        description: "Switch to Help tab",
      },
      {
        key: " ",
        ctrlKey: true,
        action: () => setEnable(!enable),
        description: "Toggle extension on/off",
      },
    ],
    true
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header - fixed height */}
      <div className="shrink-0 bg-background border-b border-border/50">
        <Header />
      </div>

      <EnableGuard>
        <div className="flex-1 flex flex-col min-h-0">
          {/* Controls Section */}
          <div className="flex-1 min-h-0 flex flex-col px-4 pt-4">
            <Tabs
              value={tab}
              onValueChange={setTab}
              className="h-full flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-3 mb-4 h-9 bg-muted/30">
                <TabsTrigger
                  value="common"
                  className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Camera
                </TabsTrigger>
                <TabsTrigger
                  value="preference"
                  className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Effects
                </TabsTrigger>
                <TabsTrigger
                  value="troubleshoot"
                  className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Help
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0 overflow-y-auto pb-4">
                <TabsContent value="common" className="mt-0 h-full">
                  <CommonTab />
                </TabsContent>
                <TabsContent value="preference" className="mt-0 h-full">
                  <PreferenceTab />
                </TabsContent>
                <TabsContent value="troubleshoot" className="mt-0 h-full">
                  <TroubleshootTab />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </EnableGuard>
    </div>
  );
};

export default App;
