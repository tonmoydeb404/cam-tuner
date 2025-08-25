import { Slider } from "@/components/ui/slider";
import { useAppContext } from "@/context/app";
import PositionPicker from "./position-picker";

const PositioningSizing = () => {
  const { overlay, updateOverlay } = useAppContext();

  return (
    <div className="pt-4">
      {/* Positioning & Sizing Controls */}
      <div className="space-y-3 mt-6">
        <div className="text-sm font-medium">Position</div>
        <PositionPicker />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">
              X Position (%)
            </label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[overlay.position.x]}
              onValueChange={(value) => {
                updateOverlay("position")({
                  ...overlay.position,
                  x: value[0],
                });
              }}
              className="w-full"
            />
            <div className="text-xs text-center mt-1">
              {overlay.position.x}%
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">
              Y Position (%)
            </label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[overlay.position.y]}
              onValueChange={(value) => {
                updateOverlay("position")({
                  ...overlay.position,
                  y: value[0],
                });
              }}
              className="w-full"
            />
            <div className="text-xs text-center mt-1">
              {overlay.position.y}%
            </div>
          </div>
        </div>

        <div className="text-sm font-medium">Scale</div>
        <div>
          <Slider
            min={0.1}
            max={5}
            step={0.05}
            value={[overlay.scale]}
            onValueChange={(value) => {
              updateOverlay("scale")(value[0]);
            }}
            className="w-full"
          />
          <div className="text-xs text-center mt-1">{overlay.scale}x</div>
        </div>

        <div className="text-sm font-medium">Duration</div>
        <div>
          <Slider
            min={0.5}
            max={10}
            step={0.25}
            value={[overlay.duration]}
            onValueChange={(value) => {
              updateOverlay("duration")(value[0]);
            }}
            className="w-full"
          />
          <div className="text-xs text-center mt-1">{overlay.duration}s</div>
        </div>

        <div className="text-sm font-medium">Opacity</div>
        <div>
          <Slider
            min={0}
            max={100}
            step={5}
            value={[overlay.opacity]}
            onValueChange={(value) => {
              updateOverlay("opacity")(value[0]);
            }}
            className="w-full"
          />
          <div className="text-xs text-center mt-1">{overlay.opacity}%</div>
        </div>

        <div className="text-sm font-medium">Delay</div>
        <div>
          <Slider
            min={0}
            max={5}
            step={0.25}
            value={[overlay.delay]}
            onValueChange={(value) => {
              updateOverlay("delay")(value[0]);
            }}
            className="w-full"
          />
          <div className="text-xs text-center mt-1">{overlay.delay}s</div>
        </div>
      </div>
    </div>
  );
};

export default PositioningSizing;
