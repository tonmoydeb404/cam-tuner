"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Crop, Filter, Image, Sparkles, X } from "lucide-react";
import { useState } from "react";
import ConfettiSection from "./tools/confetti/confetti-section";
import { CropSettings } from "./tools/crop-settings";
import { FilterSettings } from "./tools/filter-settings";
import GifSection from "./tools/gif/gif-section";

type ToolId = "camera" | "crop" | "filter" | "confetti" | "gif";

interface Tool {
  id: ToolId;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ComponentType;
  color: string;
}

const tools: Tool[] = [
  // {
  //   id: "camera",
  //   title: "Camera Source",
  //   description: "Select your camera input",
  //   icon: Camera,
  //   component: CameraSettings,
  //   color: "from-blue-500 to-cyan-500",
  // },
  {
    id: "crop",
    title: "Crop & Resize",
    description: "Frame and zoom settings",
    icon: Crop,
    component: CropSettings,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "filter",
    title: "Filters",
    description: "Color and effects",
    icon: Filter,
    component: FilterSettings,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "confetti",
    title: "Confetti Effects",
    description: "Celebratory animations",
    icon: Sparkles,
    component: ConfettiSection,
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: "gif",
    title: "GIF Overlay",
    description: "Add animated overlays",
    icon: Image,
    component: GifSection,
    color: "from-green-500 to-emerald-500",
  },
];

export function ToolsPanel() {
  const [selectedTool, setSelectedTool] = useState<ToolId | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const activeTool = tools.find((tool) => tool.id === selectedTool);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedTool(null);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  return (
    <div className="relative h-screen max-h-screen">
      {/* Main Folder View Panel */}
      <div
        className={`h-full flex flex-col bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 border-l border-gray-200 dark:border-gray-800 transition-opacity duration-300 ${
          selectedTool && !isClosing ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Camera Tools
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Select a tool to get started
          </p>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="grid grid-cols-2 gap-4 p-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className="group relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-transparent hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 bg-white dark:bg-gray-900 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                  style={{
                    animationDelay: `${index * 75}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  {/* Gradient background on hover */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${tool.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300`}
                  />

                  {/* Icon with gradient background */}
                  <div className="relative">
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${tool.color} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`}
                    />
                    <div
                      className={`relative size-16 rounded-2xl bg-linear-to-br ${tool.color} p-0.5 shadow-lg group-hover:shadow-2xl transition-shadow duration-300`}
                    >
                      <div className="size-full rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center">
                        <Icon className="size-7 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="relative text-center space-y-1">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {tool.title}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                      {tool.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Tool Detail Panel - Slides in from right */}
      {(selectedTool || isClosing) && activeTool && (
        <div
          key={selectedTool}
          className={`absolute inset-0 h-full flex flex-col bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 border-l border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-out ${
            isClosing
              ? "translate-x-full"
              : "translate-x-0 animate-in slide-in-from-right duration-300"
          }`}
        >
          {/* Header */}
          <div className="shrink-0 p-6 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all hover:gap-3 duration-200"
            >
              <ArrowLeft className="size-4" />
              Back to tools
            </button>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  {activeTool.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activeTool.description}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="size-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-6">
              <activeTool.component />
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
