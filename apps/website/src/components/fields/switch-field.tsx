"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { CommonFieldProps } from "./types";

export interface SwitchFieldProps extends Omit<CommonFieldProps<boolean>, "required"> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SwitchField({
  label,
  id,
  checked,
  onChange,
  className = "",
  description,
  error,
  disabled = false,
  orientation = "horizontal",
  encode = (v) => v,
  decode = (v) => v,
}: SwitchFieldProps) {
  const isInvalid = !!error;

  const handleChange = (newChecked: boolean) => {
    onChange(encode(newChecked));
  };

  return (
    <Field
      className={className}
      orientation={orientation}
      data-invalid={isInvalid}
      data-disabled={disabled}
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Switch
        id={id}
        checked={decode(checked)}
        onCheckedChange={handleChange}
        disabled={disabled}
        aria-invalid={isInvalid}
        aria-describedby={description ? `${id}-description` : undefined}
      />
      {description && (
        <FieldDescription id={`${id}-description`}>
          {description}
        </FieldDescription>
      )}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
