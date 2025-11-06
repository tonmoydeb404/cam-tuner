"use client";

import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { SliderField, SliderFieldProps } from "@/components/fields/slider-field";

interface FormSliderFieldProps<T extends FieldValues>
  extends Omit<SliderFieldProps, "value" | "onChange" | "id"> {
  name: FieldPath<T>;
}

export function FormSliderField<T extends FieldValues>(
  props: FormSliderFieldProps<T>
) {
  const { name, min, ...others } = props;
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <SliderField
          id={name}
          value={field.value ?? min}
          onChange={field.onChange}
          min={min}
          error={error?.message}
          {...others}
        />
      )}
    />
  );
}
