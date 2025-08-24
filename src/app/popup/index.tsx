import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/app";
import EnableGuard from "@/guards/enable-guard";
import useKeyboardShortcuts from "@/hooks/use-keyboard-shortcuts";
import { useState } from "react";
import Header from "../header";
import CommonTab from "../tabs/common-tab";
import PreferenceTab from "../tabs/preference-tab";
import TroubleshootTab from "../tabs/troubleshoot-tab";

type Props = {};

const PopupContent = (props: Props) => {
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
      <Header showPreviewBtn />
      <EnableGuard>
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
              Effects
            </TabsTrigger>
            <TabsTrigger value="troubleshoot" className="text-sm">
              Help
            </TabsTrigger>
          </TabsList>

          <div className="">
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
      </EnableGuard>
    </>
  );
};

export default PopupContent;
