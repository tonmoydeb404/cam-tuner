import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { useAppContext } from "@/context/app";
import { useWebcamsContext } from "@/context/webcams";
import useDebounce from "@/hooks/use-debounce";
import { Eye, Power, Settings } from "lucide-react";
import Browser from "webextension-polyfill";

type Props = {
  showPreviewBtn?: boolean;
};

const Header = (props: Props) => {
  const { showPreviewBtn } = props;
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

  const openLivePreview = async () => {
    if (__BROWSER__ === "chrome") {
      const currentWindow = await chrome.windows.getCurrent();
      if (currentWindow?.id) {
        chrome.sidePanel.open({ windowId: currentWindow.id });
        window.close();
        return;
      }
    }

    Browser.runtime.openOptionsPage();
  };

  return (
    <div className="p-3 border-b mb-5">
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

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Live Preview Button */}
          {showPreviewBtn && (
            <Button
              onClick={openLivePreview}
              variant="outline"
              size="icon"
              className="rounded-sm"
              title="Open Live Preview"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Enable/Disable Toggle Button */}
          <Button
            onClick={() => debouncedSetEnable(!enable)}
            variant={enable ? "default" : "outline"}
            size="icon"
            className="rounded-sm"
            title={enable ? "Turn OFF" : "Turn ON"}
          >
            <Power className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
