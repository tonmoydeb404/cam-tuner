import { Crop, LucideIcon, PartyPopper, Sparkles, Sticker } from "lucide-react";

export type ToolItem = {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
};
export const toolsList: ToolItem[] = [
  { id: "frame", title: "Frame Configuration", icon: Crop, color: "#ff0000" },
  { id: "effects", title: "Effects", icon: Sparkles, color: "#ff0000" },
  { id: "stickers", title: "Stickers", icon: Sticker, color: "#ff0000" },
  { id: "confetti", title: "Confetti", icon: PartyPopper, color: "#ff0000" },
];
