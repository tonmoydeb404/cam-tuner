"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Sparkles } from "lucide-react";
import ConfettiBrowser from "./confetti-browser";
import ConfettiSettings from "./confetti-settings";

export default function ConfettiSection() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="effects" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="effects" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="effects">
          <ConfettiBrowser />
        </TabsContent>

        <TabsContent value="settings">
          <ConfettiSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
