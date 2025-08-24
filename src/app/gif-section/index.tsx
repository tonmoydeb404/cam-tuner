import { FeatureCard } from "@/components/ui/feature-card";
import { Accordion } from "@/components/ui/accordion";
import { useAppContext } from "@/context/app";
import { ImageIcon } from "lucide-react";
import GifBrowser from "./gif-browser";
import PositioningSizing from "./positioning-sizing";

const GifSection = () => {
  const { overlay } = useAppContext();

  return (
    <FeatureCard
      title="GIF Overlays"
      description="Add animated GIFs to your video recordings"
      icon={ImageIcon}
      badge={overlay.enabled ? "Active" : undefined}
      badgeVariant={overlay.enabled ? "success" : "default"}
    >
      <Accordion type="multiple" defaultValue={["gif", "positioning"]} className="w-full">
        <GifBrowser />
        <PositioningSizing />
      </Accordion>
    </FeatureCard>
  );
};

export default GifSection;