import { paths } from "@/router";
import { Crop, LucideIcon, PartyPopper, Sparkles, Sticker } from "lucide-react";

export type ToolItem = {
  path: string;
  title: string;
  icon: LucideIcon;
  color: string;
};
export const toolsList: ToolItem[] = [
  {
    path: paths.editor.crop,
    title: "Crop & Zoom",
    icon: Crop,
    color: "#ff0000",
  },
  {
    path: paths.editor.effects,
    title: "Effects",
    icon: Sparkles,
    color: "#ff0000",
  },
  {
    path: paths.editor.stickers,
    title: "Stickers",
    icon: Sticker,
    color: "#ff0000",
  },
  {
    path: paths.editor.celebration,
    title: "Celebration",
    icon: PartyPopper,
    color: "#ff0000",
  },
];
