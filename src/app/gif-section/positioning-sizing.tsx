import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAppContext } from "@/context/app";
import { Settings } from "lucide-react";

const PositioningSizing = () => {
  const { overlay, updateOverlay } = useAppContext();

  return (
    <AccordionItem value="positioning">
      <AccordionTrigger>
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Positioning & Sizing
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {/* Selected GIF Info */}
        {overlay.enabled && overlay.gifUrl && (
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Selected GIF
            </div>
            <div className="flex items-center gap-3 p-2 bg-accent/20 rounded-md border border-border/20">
              <img
                src={overlay.gifUrl}
                alt="Selected GIF"
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Active Overlay</p>
                <p className="text-xs text-muted-foreground">
                  Position: {overlay.position.x}%, {overlay.position.y}% •
                  Scale: {overlay.scale}x • Duration: {overlay.duration}s
                </p>
              </div>
            </div>

            {/* Positioning & Sizing Controls */}
            <div className="space-y-3">
              <div className="text-sm font-medium">Position</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">X Position (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={overlay.position.x}
                    onChange={(e) => {
                      updateOverlay("position")({ ...overlay.position, x: Number(e.target.value) });
                    }}
                    className="w-full"
                  />
                  <div className="text-xs text-center mt-1">{overlay.position.x}%</div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Y Position (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={overlay.position.y}
                    onChange={(e) => {
                      updateOverlay("position")({ ...overlay.position, y: Number(e.target.value) });
                    }}
                    className="w-full"
                  />
                  <div className="text-xs text-center mt-1">{overlay.position.y}%</div>
                </div>
              </div>

              <div className="text-sm font-medium">Scale</div>
              <div>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.05"
                  value={overlay.scale}
                  onChange={(e) => {
                    updateOverlay("scale")(Number(e.target.value));
                  }}
                  className="w-full"
                />
                <div className="text-xs text-center mt-1">{overlay.scale}x</div>
              </div>

              <div className="text-sm font-medium">Duration</div>
              <div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.25"
                  value={overlay.duration}
                  onChange={(e) => {
                    updateOverlay("duration")(Number(e.target.value));
                  }}
                  className="w-full"
                />
                <div className="text-xs text-center mt-1">{overlay.duration}s</div>
              </div>

              <div className="text-sm font-medium">Opacity</div>
              <div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={overlay.opacity}
                  onChange={(e) => {
                    updateOverlay("opacity")(Number(e.target.value));
                  }}
                  className="w-full"
                />
                <div className="text-xs text-center mt-1">{overlay.opacity}%</div>
              </div>

              <div className="text-sm font-medium">Delay</div>
              <div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.25"
                  value={overlay.delay}
                  onChange={(e) => {
                    updateOverlay("delay")(Number(e.target.value));
                  }}
                  className="w-full"
                />
                <div className="text-xs text-center mt-1">{overlay.delay}s</div>
              </div>
            </div>
          </div>
        )}
        
        {!overlay.enabled && (
          <div className="text-center py-8">
            <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Select a GIF first to configure positioning and sizing
            </p>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default PositioningSizing;