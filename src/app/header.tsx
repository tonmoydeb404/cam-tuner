import { FormSwitch } from "@/components/form";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app";
import { useWebcamsContext } from "@/context/webcams";
import useDebounce from "@/hooks/use-debounce";
import { Settings, Eye } from "lucide-react";

type Props = {};

const Header = (props: Props) => {
  const { enable, setEnable, cameraSource } = useAppContext();
  const { webcams } = useWebcamsContext();

  const debouncedSetEnable = useDebounce((checked: boolean) => {
    setEnable(checked);
  }, 100);

  const hasActiveCamera = cameraSource && webcams.length > 0;
  const getStatus = () => {
    if (!enable) return 'inactive';
    return hasActiveCamera ? 'active' : 'warning';
  };

  const getStatusText = () => {
    if (!enable) return 'Disabled';
    return hasActiveCamera ? 'Active & Connected' : 'Active - No Camera';
  };

  const openSidePanel = async () => {
    try {
      // Check if sidePanel API is available (Chrome only)
      if (typeof chrome !== 'undefined' && chrome.sidePanel) {
        const currentWindow = await chrome.windows.getCurrent();
        if (currentWindow.id) {
          await chrome.sidePanel.open({ windowId: currentWindow.id });
        }
      }
    } catch (error) {
      console.warn('Failed to open side panel:', error);
    }
  };

  return (
    <div className="p-3">
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
          <Button
            onClick={openSidePanel}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Open Live Preview"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          
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
    </div>
  );
};

export default Header;
