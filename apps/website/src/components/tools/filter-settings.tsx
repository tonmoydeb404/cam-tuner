"use client";

import { FormSlider } from "@/components/form/form-slider";
import { Button } from "@/components/ui/button";
import { useFilter } from "@/context/filter-context";
import useThrottle from "@/hooks/use-throttle";

const QUICK_PRESETS = [
  {
    name: "Vivid",
    preset: { brightness: 110, contrast: 110, saturation: 110 },
  },
  {
    name: "Moody",
    preset: { brightness: 90, contrast: 120, saturation: 80 },
  },
  {
    name: "Natural",
    preset: { brightness: 105, contrast: 95, saturation: 95 },
  },
  {
    name: "Warm",
    preset: { brightness: 108, contrast: 102, saturation: 115 },
  },
];

export function FilterSettings() {
  const { filterConfig, resetFilter, setFilter, updateFilter } = useFilter();
  const { brightness, contrast, saturation } = filterConfig;

  const isDefaultSettings =
    brightness === 100 && contrast === 100 && saturation === 100;

  const throttledUpdateBrightness = useThrottle(
    updateFilter("brightness"),
    100
  );
  const throttledUpdateContrast = useThrottle(updateFilter("contrast"), 100);
  const throttledUpdateSaturation = useThrottle(
    updateFilter("saturation"),
    100
  );

  return (
    <div className="space-y-4">
      <div className="space-y-3">
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

      <div className="pt-2">
        <p className="text-xs text-gray-500 mb-2">Quick Presets</p>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_PRESETS.map((quickPreset) => (
            <Button
              key={quickPreset.name}
              variant="outline"
              size="sm"
              onClick={() => setFilter(quickPreset.preset)}
              className="text-xs"
            >
              {quickPreset.name}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilter}
            disabled={isDefaultSettings}
            className="text-xs col-span-2"
          >
            Reset All
          </Button>
        </div>
      </div>
    </div>
  );
}
