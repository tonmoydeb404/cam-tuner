"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Settings } from "lucide-react";
import GifBrowser from "./gif-browser";
import PositioningSizing from "./positioning-sizing";

export default function GifSection() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="browser" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="browser" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Browser
          </TabsTrigger>
          <TabsTrigger value="positioning" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Positioning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browser">
          <GifBrowser />
        </TabsContent>

        <TabsContent value="positioning">
          <PositioningSizing />
        </TabsContent>
      </Tabs>
    </div>
  );
}
