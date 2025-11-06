"use client";

import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { TabField, TabFieldProps } from "@/components/fields";

interface FormTabFieldProps<T extends FieldValues>
  extends Omit<TabFieldProps, "value" | "onChange" | "id"> {
  name: FieldPath<T>;
}

export function FormTabField<T extends FieldValues>(
  props: FormTabFieldProps<T>
) {
  const { name, ...others } = props;
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TabField
          id={name}
          value={field.value ?? ""}
          onChange={field.onChange}
          error={error?.message}
          {...others}
        />
      )}
    />
  );
}
