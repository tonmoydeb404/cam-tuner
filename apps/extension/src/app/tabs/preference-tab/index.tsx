import { Accordion } from "@/components/ui/accordion";
import ConfettiSection from "./confetti-section";
import DigitalEffects from "./digital-effects";
import GifSection from "./gif-section";

const PreferenceTab = () => {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="confetti"
      className="space-y-4"
    >
      <GifSection />
      <ConfettiSection />
      <DigitalEffects />
    </Accordion>
  );
};

export default PreferenceTab;
