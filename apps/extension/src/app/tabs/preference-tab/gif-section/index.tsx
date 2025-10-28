import { FeatureCard } from "@/components/ui/feature-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, ImageIcon, Settings } from "lucide-react";
import GifBrowser from "./gif-browser";
import PositioningSizing from "./positioning-sizing";

const GifSection = () => {
  return (
    <FeatureCard
      title="GIF Overlays"
      description="Add animated GIFs to your video recordings"
      icon={ImageIcon}
      type="accordion-item"
      value="gif"
    >
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
