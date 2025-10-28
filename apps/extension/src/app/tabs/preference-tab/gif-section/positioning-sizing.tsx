import { Slider } from "@/components/ui/slider";
import { useMediaOverlayContext } from "@/context/media-overlay";
import PositionPicker from "./position-picker";

const PositioningSizing = () => {
  const { mediaOverlay, updateMediaOverlay } = useMediaOverlayContext();

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
              value={[mediaOverlay.position.x]}
              onValueChange={(value) => {
                updateMediaOverlay("position")({
                  ...mediaOverlay.position,
                  x: value[0],
                });
              }}
              className="w-full"
            />
            <div className="text-xs text-center mt-1">
              {mediaOverlay.position.x}%
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
              value={[mediaOverlay.position.y]}
              onValueChange={(value) => {
                updateMediaOverlay("position")({
                  ...mediaOverlay.position,
                  y: value[0],
                });
              }}
              className="w-full"
            />
            <div className="text-xs text-center mt-1">
              {mediaOverlay.position.y}%
            </div>
          </div>
        </div>

        <div className="text-sm font-medium">Scale</div>
        <div>
          <Slider
            min={0.1}
            max={5}
            step={0.05}
            value={[mediaOverlay.scale]}
            onValueChange={(value) => {
              updateMediaOverlay("scale")(value[0]);
            }}
            className="w-full"
          />
          <div className="text-xs text-center mt-1">{mediaOverlay.scale}x</div>
        </div>

        <div className="text-sm font-medium">Duration</div>
        <div>
          <Slider
            min={0.5}
            max={10}
            step={0.25}
            value={[mediaOverlay.duration]}
            onValueChange={(value) => {
              updateMediaOverlay("duration")(value[0]);
            }}
            className="w-full"
          />
          <div className="text-xs text-center mt-1">
            {mediaOverlay.duration}s
          </div>
        </div>

        <div className="text-sm font-medium">Opacity</div>
        <div>
          <Slider
            min={0}
            max={100}
            step={5}
            value={[mediaOverlay.opacity]}
            onValueChange={(value) => {
              updateMediaOverlay("opacity")(value[0]);
            }}
            className="w-full"
          />
          <div className="text-xs text-center mt-1">
            {mediaOverlay.opacity}%
          </div>
        </div>

        <div className="text-sm font-medium">Delay</div>
        <div>
          <Slider
            min={0}
            max={5}
            step={0.25}
            value={[mediaOverlay.delay]}
            onValueChange={(value) => {
              updateMediaOverlay("delay")(value[0]);
            }}
            className="w-full"
          />
          <div className="text-xs text-center mt-1">{mediaOverlay.delay}s</div>
        </div>
      </div>
    </div>
  );
};

export default PositioningSizing;
