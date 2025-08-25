import PreviewPlayer from "@/components/preview-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/app";
import EnableGuard from "@/guards/enable-guard";
import useKeyboardShortcuts from "@/hooks/use-keyboard-shortcuts";
import { LucideSparkles } from "lucide-react";
import { useState } from "react";
import Header from "../header";
import CommonTab from "../tabs/common-tab";
import PreferenceTab from "../tabs/preference-tab";
import TroubleshootTab from "../tabs/troubleshoot-tab";

type Props = {};

const SidepanelContent = (props: Props) => {
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
    <>
      <Header />
      <EnableGuard>
        <div className="px-4 mb-5">
          <PreviewPlayer />
        </div>

        <Tabs
          value={tab}
          onValueChange={setTab}
          className="h-full flex-1 flex flex-col px-4 pb-4"
        >
          <TabsList className="w-full mb-4 ">
            <TabsTrigger value="common" className="text-sm">
              Camera
            </TabsTrigger>
            <TabsTrigger value="preference" className="text-sm">
              Effects <LucideSparkles className="text-primary" />
            </TabsTrigger>
            <TabsTrigger value="troubleshoot" className="text-sm">
              Help
            </TabsTrigger>
          </TabsList>

          <div className="">
            <TabsContent value="common">
              <CommonTab showCameraSelection />
            </TabsContent>
            <TabsContent value="preference">
              <PreferenceTab />
            </TabsContent>
            <TabsContent value="troubleshoot">
              <TroubleshootTab />
            </TabsContent>
          </div>
        </Tabs>
      </EnableGuard>
    </>
  );
};

export default SidepanelContent;
