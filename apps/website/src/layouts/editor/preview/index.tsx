"use client";

import { Camera } from "lucide-react";
import PreviewStatesWrapper from "./states-wrapper";

type Props = {};

const EditorPreview = (props: Props) => {
  return (
    <PreviewStatesWrapper>
      <div className="flex h-full w-full items-center justify-center bg-black">
        <div className="text-white text-center">
          <Camera className="size-16 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Camera access granted</p>
        </div>
      </div>
    </PreviewStatesWrapper>
  );
};

export default EditorPreview;
