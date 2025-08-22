import { FloatingPreview } from "@/components/floating-preview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/app";
import EnableGuard from "@/guards/enable-guard";
import useFloatingPreview from "@/hooks/use-floating-preview";
import useKeyboardShortcuts from "@/hooks/use-keyboard-shortcuts";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Header from "./header";
import CommonTab from "./tabs/common-tab";
import PreferenceTab from "./tabs/preference-tab";
import TroubleshootTab from "./tabs/troubleshoot-tab";

type Props = {};

const App = (props: Props) => {
  const [tab, setTab] = useState<string>("common");
  const { enable, setEnable } = useAppContext();
  const floatingPreview = useFloatingPreview();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: '1',
      action: () => setTab('common'),
      description: 'Switch to Camera tab'
    },
    {
      key: '2', 
      action: () => setTab('preference'),
      description: 'Switch to Effects tab'
    },
    {
      key: '3',
      action: () => setTab('troubleshoot'),
      description: 'Switch to Help tab'
    },
    {
      key: ' ',
      ctrlKey: true,
      action: () => setEnable(!enable),
      description: 'Toggle extension on/off'
    },
    {
      key: 'p',
      ctrlKey: true,
      action: () => floatingPreview.togglePreview(),
      description: 'Toggle floating preview'
    }
  ], true);

  return (
    <div className="h-screen flex flex-col">
      {/* Header - fixed height */}
      <div className="shrink-0 bg-background border-b border-border/50">
        <Header />
      </div>

      <EnableGuard>
        <div className="flex-1 flex flex-col min-h-0">
          {/* Floating Preview Control */}
          <div className="p-4 pb-3 border-b border-border/50">
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground">
                    Floating Preview
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    View camera changes in real-time while using other apps
                  </p>
                </div>
              </div>
              <Button
                onClick={floatingPreview.togglePreview}
                variant={floatingPreview.isVisible ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                {floatingPreview.isVisible ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Show Preview
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex-1 min-h-0 flex flex-col px-4">
            <Tabs value={tab} onValueChange={setTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mb-4 h-9 bg-muted/30">
                <TabsTrigger value="common" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Camera
                </TabsTrigger>
                <TabsTrigger value="preference" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Effects
                </TabsTrigger>
                <TabsTrigger value="troubleshoot" className="text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
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

      {/* Floating Preview Window */}
      {floatingPreview.isVisible && (
        <FloatingPreview onClose={floatingPreview.hidePreview} />
      )}
    </div>
  );
};

export default App;
