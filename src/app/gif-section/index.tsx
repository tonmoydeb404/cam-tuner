import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/ui/feature-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/app";
import { Image, ImageIcon, Play, Settings, X } from "lucide-react";
import GifBrowser from "./gif-browser";
import PositioningSizing from "./positioning-sizing";

const GifSection = () => {
  const { overlay, resetOverlay, setOverlayEnable } = useAppContext();

  const isOverlayValid = overlay.mp4Url && overlay.gifUrl;

  const handlePlay = () => {
    setOverlayEnable(true);
  };

  const handleClear = () => {
    resetOverlay();
  };

  return (
    <FeatureCard
      title="GIF Overlays"
      description="Add animated GIFs to your video recordings"
      icon={ImageIcon}
    >
      {/* GIF Preview */}
      {isOverlayValid && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-3 p-2 bg-accent/20 rounded-md border border-border/20">
            <img
              src={overlay.gifUrl}
              alt="Selected GIF"
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Active Overlay</p>
              <p className="text-xs text-muted-foreground">
                Position: {overlay.position.x}%, {overlay.position.y}% • Scale:{" "}
                {overlay.scale}x • Duration: {overlay.duration}s
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handlePlay}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
              disabled={!isOverlayValid}
            >
              <Play className="h-4 w-4" />
              Play
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="gif" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gif" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            GIF
          </TabsTrigger>
          <TabsTrigger value="positioning" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Positioning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gif">
          <GifBrowser />
        </TabsContent>

        <TabsContent value="positioning">
          <PositioningSizing />
        </TabsContent>
      </Tabs>
    </FeatureCard>
  );
};

export default GifSection;
