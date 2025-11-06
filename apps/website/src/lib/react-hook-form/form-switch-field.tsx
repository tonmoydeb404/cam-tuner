"use client";

import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { SwitchField, SwitchFieldProps } from "@/components/fields/switch-field";

interface FormSwitchFieldProps<T extends FieldValues>
  extends Omit<SwitchFieldProps, "checked" | "onChange" | "id"> {
  name: FieldPath<T>;
}

export function FormSwitchField<T extends FieldValues>(
  props: FormSwitchFieldProps<T>
) {
  const { name, ...others } = props;
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <SwitchField
          id={name}
          checked={field.value ?? false}
          onChange={field.onChange}
          error={error?.message}
          {...others}
        />
      )}
    />
  );
}
