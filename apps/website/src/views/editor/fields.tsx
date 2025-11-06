"use client";

import { FieldGroup } from "@/components/ui/field";
import { ratioOptions } from "@/config/ratio";
import {
  FormInputField,
  FormSelectField,
  FormSliderField,
  FormTabField,
} from "@/lib/react-hook-form";
import type { CropConfig } from "@/store/features/editor/editor-slice";
import { useFormContext } from "react-hook-form";

type Props = {};

const alignOptions = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];

const aspectRatioOptions = ratioOptions.map((ratio) => ({
  label: ratio.label,
  value: ratio.value.toString(),
}));

const EditorFieldsSection = (props: Props) => {
  const { watch } = useFormContext<CropConfig>();
  const fitToFrame = watch("fitToFrame");

  return (
    <div className="p-4">
      <FieldGroup>
        <FormSelectField
          name="aspectRatio"
          label="Aspect Ratio"
          description="Select the aspect ratio for the video"
          decode={(value) => value.toString()}
          encode={(value) => parseFloat(value)}
          options={aspectRatioOptions}
        />

        <FormSliderField
          name="zoom"
          label="Digital Zoom"
          min={1}
          max={3}
          step={0.1}
          unit="x"
          description="Adjust the zoom level"
          formatValue={(value) => value.toFixed(1)}
        />

        <FormTabField
          name="mirror"
          label="Mirror Video"
          description="Flip the video horizontally"
          options={[
            {
              label: "On",
              value: "true",
            },
            {
              label: "Off",
              value: "false",
            },
          ]}
          encode={(value) => value === "true"}
          decode={String}
        />

        <FormTabField
          name="align"
          label="Alignment"
          options={alignOptions}
          description="Align the video within the frame"
        />

        <FormTabField
          name="fitToFrame"
          label="Fit to Frame"
          description="Add letterbox to fit video in frame"
          options={[
            {
              label: "Yes",
              value: "true",
            },
            {
              label: "No",
              value: "false",
            },
          ]}
          encode={(value) => value === "true"}
          decode={String}
        />

        <FormInputField
          name="bgColor"
          label="Background Color"
          type="color"
          description="Background color for letterbox (leave empty for transparent)"
          placeholder="#000000"
          disabled={!fitToFrame}
        />
      </FieldGroup>
    </div>
  );
};

export default EditorFieldsSection;
