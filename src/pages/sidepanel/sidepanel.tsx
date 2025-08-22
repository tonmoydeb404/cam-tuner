import CommonTab from "@/app/tabs/common-tab";
import PreferenceTab from "@/app/tabs/preference-tab";
import TroubleshootTab from "@/app/tabs/troubleshoot-tab";
import { FormSwitch } from "@/components/form";
import { LoadingState } from "@/components/ui/loading-state";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/app";
import { useWebcamsContext } from "@/context/webcams";
import EnableGuard from "@/guards/enable-guard";
import useDebounce from "@/hooks/use-debounce";
import useKeyboardShortcuts from "@/hooks/use-keyboard-shortcuts";
import useMediaStream from "@/hooks/use-media-stream";
import useStreamPatcher from "@/hooks/use-stream-patcher";
import { RefreshCw, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const { enable, setEnable, cameraSource } = useAppContext();
  const { webcams } = useWebcamsContext();

  const debouncedSetEnable = useDebounce((checked: boolean) => {
    setEnable(checked);
  }, 100);

  const hasActiveCamera = cameraSource && webcams.length > 0;
  const getStatus = () => {
    if (!enable) return "inactive";
    return hasActiveCamera ? "active" : "warning";
  };

  const getStatusText = () => {
    if (!enable) return "Disabled";
    return hasActiveCamera ? "Active & Connected" : "Active - No Camera";
  };

  return (
    <div className="p-3 border-b border-border bg-background">
      <div className="flex items-center justify-between">
        {/* App Title with Status */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <Settings className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">CamTuner</h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <StatusIndicator
                status={getStatus()}
                size="sm"
                showPulse={enable && !!hasActiveCamera}
              />
              <span className="text-xs">{getStatusText()}</span>
            </div>
          </div>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-foreground">
            {enable ? "ON" : "OFF"}
          </div>
          <FormSwitch
            checked={enable}
            onChange={debouncedSetEnable}
            id="enable"
            label=""
            className="gap-1"
          />
        </div>
      </div>
    </div>
  );
};

const LivePreview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { cameraSource, config } = useAppContext();
  const { stream, error, loading, size } = useMediaStream(
    cameraSource?.deviceId ?? null
  );
  const patchedStream = useStreamPatcher(stream, size, config);

  const handleRetry = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (videoRef.current && patchedStream) {
      videoRef.current.srcObject = patchedStream;
    }
  }, [patchedStream]);

  return (
    <div className="p-3">
      <div className="relative aspect-video w-full bg-muted/20 rounded-lg overflow-hidden border border-border shadow-sm group">
        <LoadingState
          loading={loading}
          error={error?.message}
          retryAction={handleRetry}
          loadingText="Connecting to camera"
          variant="spinner"
          size="sm"
          className="absolute inset-0 bg-background/90 backdrop-blur-sm"
        >
          {/* Video Preview */}
          <video
            ref={videoRef}
            className="w-full h-full object-contain rounded-lg"
            autoPlay
            muted
            playsInline
          />

          {/* Video Overlay Indicators */}
          <div className="absolute top-3 left-3 flex gap-2">
            <div className="px-2 py-1 rounded-md bg-black/70 text-white text-xs font-medium backdrop-blur-sm">
              Live
            </div>
          </div>

          {/* Quality Indicator */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="px-2 py-1 rounded-md bg-black/70 text-white text-xs backdrop-blur-sm">
              {size?.width || 0}×{size?.height || 0}
            </div>
          </div>

          {/* Controls Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none">
            <div className="absolute bottom-3 left-3 flex gap-2 pointer-events-auto">
              <button
                onClick={handleRetry}
                className="p-2 bg-black/70 hover:bg-black/90 text-white rounded-md backdrop-blur-sm transition-colors"
                title="Refresh camera feed"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </LoadingState>
      </div>
    </div>
  );
};

const SidePanelContent = () => {
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
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header />

      <EnableGuard>
        <div className="flex-1 flex flex-col min-h-0">
          {/* Live Preview */}
          <div className="border-b border-border">
            <LivePreview />
          </div>

          {/* Controls Section */}
          <div className="flex-1 min-h-0 flex flex-col px-3 pt-3">
            <Tabs
              value={tab}
              onValueChange={setTab}
              className="h-full flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-3 mb-3 h-8 bg-muted/30">
                <TabsTrigger
                  value="common"
                  className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Camera
                </TabsTrigger>
                <TabsTrigger
                  value="preference"
                  className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Effects
                </TabsTrigger>
                <TabsTrigger
                  value="troubleshoot"
                  className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  Help
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0 overflow-y-auto pb-3">
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

const SidePanel = () => {
  return <SidePanelContent />;
};

export default SidePanel;
