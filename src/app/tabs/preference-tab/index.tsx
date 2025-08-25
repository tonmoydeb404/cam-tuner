import { Accordion } from "@/components/ui/accordion";
import DigitalEffects from "./digital-effects";
import GifSection from "./gif-section";

const PreferenceTab = () => {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="gif"
      className="space-y-4"
    >
      <GifSection />
      <DigitalEffects />
    </Accordion>
  );
};

export default PreferenceTab;
