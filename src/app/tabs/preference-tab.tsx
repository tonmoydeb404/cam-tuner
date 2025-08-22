import { FormSlider } from "@/components/form";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import { useAppContext } from "@/context/app";
import useThrottle from "@/hooks/use-throttle";
import { Sliders } from "lucide-react";
import { useCallback } from "react";

type Props = {};

const PreferenceTab = (props: Props) => {
  const { config, updateConfig } = useAppContext();
  const { brightness, contrast, saturation, zoom } = config;

  const isDefaultSettings = brightness === 100 && contrast === 100 && saturation === 100 && zoom === 1;

  // Throttle expensive operations to improve performance
  const throttledUpdateBrightness = useThrottle(updateConfig("brightness"), 100);
  const throttledUpdateContrast = useThrottle(updateConfig("contrast"), 100);
  const throttledUpdateSaturation = useThrottle(updateConfig("saturation"), 100);
  const throttledUpdateZoom = useThrottle(updateConfig("zoom"), 50);

  const resetToDefaults = useCallback(() => {
    updateConfig("brightness")(100);
    updateConfig("contrast")(100);
    updateConfig("saturation")(100);
    updateConfig("zoom")(1);
  }, [updateConfig]);
  
  return (
    <div className="space-y-4">
      {/* Digital Effects Section */}
      <FeatureCard
        title="Digital Effects"
        description="Adjust zoom and color properties in real-time"
        icon={Sliders}
        badge={!isDefaultSettings ? "Modified" : undefined}
        badgeVariant={!isDefaultSettings ? "warning" : "default"}
      >

        <FormSlider
          label="Digital Zoom"
          id="zoom"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={throttledUpdateZoom}
          unit="x"
          formatValue={(val) => val.toFixed(1)}
        />

        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Color Adjustments
          </h4>
          
          <FormSlider
            label="Brightness"
            id="brightness"
            value={brightness}
            min={0}
            max={200}
            step={5}
            onChange={throttledUpdateBrightness}
            unit="%"
          />

          <FormSlider
            label="Contrast"
            id="contrast"
            value={contrast}
            min={0}
            max={200}
            step={5}
            onChange={throttledUpdateContrast}
            unit="%"
          />

          <FormSlider
            label="Saturation"
            id="saturation"
            value={saturation}
            min={0}
            max={200}
            step={5}
            onChange={throttledUpdateSaturation}
            unit="%"
          />
        </div>

        {/* Quick presets */}
        <div className="pt-4 border-t border-border/30">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Quick Presets
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateConfig("brightness")(110);
                updateConfig("contrast")(110);
                updateConfig("saturation")(110);
              }}
              className="text-xs justify-start"
            >
              Vivid
            </Button>
            
            <Button
              variant="outline" 
              size="sm"
              onClick={() => {
                updateConfig("brightness")(90);
                updateConfig("contrast")(120);
                updateConfig("saturation")(80);
              }}
              className="text-xs justify-start"
            >
              Moody
            </Button>
            
            <Button
              variant="outline"
              size="sm" 
              onClick={() => {
                updateConfig("brightness")(105);
                updateConfig("contrast")(95);
                updateConfig("saturation")(95);
              }}
              className="text-xs justify-start"
            >
              Natural
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              disabled={isDefaultSettings}
              className="text-xs justify-start"
            >
              Reset All
            </Button>
          </div>
        </div>

        {/* Real-time feedback */}
        <div className="text-xs text-muted-foreground italic p-3 bg-accent/20 rounded-md border border-border/20">
          All adjustments are applied in real-time. Extreme values may affect performance.
        </div>
      </FeatureCard>
    </div>
  );
};

export default PreferenceTab;
