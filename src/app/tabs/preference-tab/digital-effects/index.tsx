import { FormSlider } from "@/components/form";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import { useAppContext } from "@/context/app";
import { ColorPreset } from "@/context/app/types";
import useThrottle from "@/hooks/use-throttle";
import { Sliders } from "lucide-react";
import { useCallback } from "react";

type QuickPreset = {
  name: string;
  preset: ColorPreset;
  description?: string;
};

const QUICK_PRESETS: QuickPreset[] = [
  {
    name: "Vivid",
    preset: {
      brightness: 110,
      contrast: 110,
      saturation: 110,
    },
    description: "Enhanced colors and brightness",
  },
  {
    name: "Moody",
    preset: {
      brightness: 90,
      contrast: 120,
      saturation: 80,
    },
    description: "Dramatic, high-contrast look",
  },
  {
    name: "Natural",
    preset: {
      brightness: 105,
      contrast: 95,
      saturation: 95,
    },
    description: "Subtle, natural enhancement",
  },
  {
    name: "Warm",
    preset: {
      brightness: 108,
      contrast: 102,
      saturation: 115,
    },
    description: "Warm, cozy feeling",
  },
  {
    name: "Cool",
    preset: {
      brightness: 95,
      contrast: 110,
      saturation: 85,
    },
    description: "Cool, professional tone",
  },
  {
    name: "Portrait",
    preset: {
      brightness: 112,
      contrast: 98,
      saturation: 105,
    },
    description: "Optimized for faces",
  },
];

type Props = {};

const DigitalEffects = (props: Props) => {
  const { config, updateConfig, applyPreset } = useAppContext();
  const { brightness, contrast, saturation } = config;

  const isDefaultSettings =
    brightness === 100 && contrast === 100 && saturation === 100;

  // Throttle expensive operations to improve performance
  const throttledUpdateBrightness = useThrottle(
    updateConfig("brightness"),
    100
  );
  const throttledUpdateContrast = useThrottle(updateConfig("contrast"), 100);
  const throttledUpdateSaturation = useThrottle(
    updateConfig("saturation"),
    100
  );

  const resetToDefaults = useCallback(() => {
    applyPreset({
      brightness: 100,
      contrast: 100,
      saturation: 100,
    });
  }, [applyPreset]);

  return (
    <FeatureCard
      title="Color Effects"
      description="Adjust color properties in real-time"
      icon={Sliders}
      badge={!isDefaultSettings ? "Modified" : undefined}
      badgeVariant={!isDefaultSettings ? "warning" : "default"}
      type="accordion-item"
      value="effects"
    >
      <div className="space-y-3">
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
          {QUICK_PRESETS.map((quickPreset) => (
            <Button
              key={quickPreset.name}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(quickPreset.preset)}
              className="text-xs justify-start"
              title={quickPreset.description}
            >
              {quickPreset.name}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            disabled={isDefaultSettings}
            className="text-xs justify-start"
            title="Reset to default values"
          >
            Reset All
          </Button>
        </div>
      </div>

      {/* Real-time feedback */}
      <div className="text-xs text-muted-foreground italic p-3 bg-accent/20 rounded-md border border-border/20">
        All color adjustments are applied in real-time. Extreme values may
        affect performance.
      </div>
    </FeatureCard>
  );
};

export default DigitalEffects;
