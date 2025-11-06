"use client";

import {
  SelectField,
  SelectFieldProps,
} from "@/components/fields/select-field";
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface FormSelectFieldProps<T extends FieldValues>
  extends Omit<SelectFieldProps, "value" | "onChange" | "id" | "error"> {
  name: FieldPath<T>;
}

export function FormSelectField<T extends FieldValues>(
  props: FormSelectFieldProps<T>
) {
  const { name, ...others } = props;
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <SelectField
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
