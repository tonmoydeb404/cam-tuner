"use client";

import { FormSlider } from "@/components/form/form-slider";
import { useMediaOverlayContext } from "@/context/media-overlay-context";
import useThrottle from "@/hooks/use-throttle";
import PositionPicker from "./position-picker";

export default function PositioningSizing() {
  const { mediaOverlay, updateMediaOverlay } = useMediaOverlayContext();

  const throttledUpdateX = useThrottle(
    (value: number) => updateMediaOverlay("position")({ ...mediaOverlay.position, x: value }),
    50
  );

  const throttledUpdateY = useThrottle(
    (value: number) => updateMediaOverlay("position")({ ...mediaOverlay.position, y: value }),
    50
  );

  const throttledUpdateScale = useThrottle(updateMediaOverlay("scale"), 50);
  const throttledUpdateDuration = useThrottle(updateMediaOverlay("duration"), 50);
  const throttledUpdateOpacity = useThrottle(updateMediaOverlay("opacity"), 50);
  const throttledUpdateDelay = useThrottle(updateMediaOverlay("delay"), 50);

  return (
    <div className="space-y-6">
      <PositionPicker />

      <div className="space-y-4 pt-4 border-t">
        <FormSlider
          label="X Position"
          id="position-x"
          value={mediaOverlay.position.x}
          min={0}
          max={100}
          step={1}
          onChange={throttledUpdateX}
          unit="%"
          formatValue={(val) => val.toFixed(0)}
        />

        <FormSlider
          label="Y Position"
          id="position-y"
          value={mediaOverlay.position.y}
          min={0}
          max={100}
          step={1}
          onChange={throttledUpdateY}
          unit="%"
          formatValue={(val) => val.toFixed(0)}
        />

        <FormSlider
          label="Scale"
          id="scale"
          value={mediaOverlay.scale}
          min={0.1}
          max={5}
          step={0.05}
          onChange={throttledUpdateScale}
          unit="x"
          formatValue={(val) => val.toFixed(2)}
        />

        <FormSlider
          label="Duration"
          id="duration"
          value={mediaOverlay.duration}
          min={0.5}
          max={10}
          step={0.25}
          onChange={throttledUpdateDuration}
          unit="s"
          formatValue={(val) => val.toFixed(2)}
        />

        <FormSlider
          label="Opacity"
          id="opacity"
          value={mediaOverlay.opacity}
          min={0}
          max={100}
          step={5}
          onChange={throttledUpdateOpacity}
          unit="%"
        />

        <FormSlider
          label="Delay"
          id="delay"
          value={mediaOverlay.delay}
          min={0}
          max={5}
          step={0.25}
          onChange={throttledUpdateDelay}
          unit="s"
          formatValue={(val) => val.toFixed(2)}
        />
      </div>
    </div>
  );
}
