"use client";

import { SelectField } from "@/components/fields";
import { FieldGroup } from "@/components/ui/field";
import { ratioOptions } from "@/config/ratio";
import {
  FormInputField,
  FormSliderField,
  FormSwitchField,
} from "@/lib/react-hook-form";
import type { CropConfig } from "@/store/features/editor/editor-slice";
import { useController, useFormContext } from "react-hook-form";

type Props = {};

const EditorFieldsSection = (props: Props) => {
  const { control } = useFormContext<CropConfig>();

  // Custom controller for aspectRatio to handle number conversion
  const {
    field: aspectRatioField,
    fieldState: { error: aspectRatioError },
  } = useController({
    name: "aspectRatio",
    control,
  });

  const aspectRatioOptions = ratioOptions.map((ratio) => ({
    label: ratio.label,
    value: ratio.value.toString(),
  }));

  const alignOptions = [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ];

  // Custom controller for align
  const {
    field: alignField,
    fieldState: { error: alignError },
  } = useController({
    name: "align",
    control,
  });

  return (
    <div className="p-4">
      <FieldGroup>
        <SelectField
          id="aspectRatio"
          label="Aspect Ratio"
          value={aspectRatioField.value.toString()}
          onChange={(value) => aspectRatioField.onChange(parseFloat(value))}
          options={aspectRatioOptions}
          description="Select the aspect ratio for the video"
          error={aspectRatioError?.message}
        />

        <FormSliderField
          name="zoom"
          control={control}
          label="Digital Zoom"
          min={1}
          max={3}
          step={0.1}
          unit="x"
          description="Adjust the zoom level"
          formatValue={(value) => value.toFixed(1)}
        />

        <FormSwitchField
          name="mirror"
          control={control}
          label="Mirror Video"
          description="Flip the video horizontally"
        />

        <SelectField
          id="align"
          label="Alignment"
          value={alignField.value}
          onChange={alignField.onChange}
          options={alignOptions}
          description="Align the video within the frame"
          error={alignError?.message}
        />

        <FormSwitchField
          name="fitToFrame"
          control={control}
          label="Fit to Frame"
          description="Add letterbox to fit video in frame"
        />

        <FormInputField
          name="bgColor"
          control={control}
          label="Background Color"
          type="color"
          description="Background color for letterbox (leave empty for transparent)"
          placeholder="#000000"
        />
      </FieldGroup>
    </div>
  );
};

export default EditorFieldsSection;
