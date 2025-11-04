"use client";

import CameraPreview from "@/components/camera-preview";
import { ToolsPanel } from "@/components/tools-panel";
import { ConfettiContextProvider } from "@/context/confetti-context";
import { CropProvider } from "@/context/crop-context";
import { FilterProvider } from "@/context/filter-context";
import { MediaOverlayContextProvider } from "@/context/media-overlay-context";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <CropProvider>
      <FilterProvider>
        <ConfettiContextProvider>
          <MediaOverlayContextProvider>
            <div className="grid grid-cols-12 max-w-full h-screen overflow-hidden">
              <div className="col-span-8 p-4">
                <div className="w-full h-full border-2 border-gray-300 border-dashed rounded-2xl p-4">
                  <CameraPreview className="w-full max-w-full max-h-full" />
                </div>
              </div>
              <div className="col-span-4">
                <ToolsPanel />
              </div>
            </div>
          </MediaOverlayContextProvider>
        </ConfettiContextProvider>
      </FilterProvider>
    </CropProvider>
  );
};

export default HomePage;
