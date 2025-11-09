"use client";

import PreviewPlayer from "./player";
import PreviewStatesWrapper from "./states-wrapper";

type Props = {};

const EditorPreview = (props: Props) => {
  return (
    <PreviewStatesWrapper>
      <PreviewPlayer />
    </PreviewStatesWrapper>
  );
};

export default EditorPreview;
