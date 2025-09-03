import { FormSwitch } from "@/components/form";
import { FeatureCard } from "@/components/ui/feature-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlaceholder } from "@/context/placeholder";
import { Eye } from "lucide-react";
import BackgroundSection from "./background-section";
import ForegroundSection from "./foreground-section";
import PositionSection from "./position-section";

const PlaceholderSettings = () => {
  const { placeholderConfig, enablePlaceholder, disablePlaceholder } =
    usePlaceholder();
  const { enabled } = placeholderConfig;

  return (
    <FeatureCard
      title="Placeholder Configuration"
      icon={Eye}
      type="accordion-item"
      value="placeholder"
    >
      <div className="space-y-4">
        <FormSwitch
          label="Enable"
          id="placeholder-enabled"
          checked={!!enabled}
          onChange={(value) =>
            value ? enablePlaceholder() : disablePlaceholder()
          }
        />

        <Tabs defaultValue="config" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="position">Position & Sizing</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4">
            <BackgroundSection />
            <ForegroundSection />
          </TabsContent>

          <TabsContent value="position" className="space-y-4">
            <PositionSection />
          </TabsContent>
        </Tabs>
      </div>
    </FeatureCard>
  );
};

export default PlaceholderSettings;
