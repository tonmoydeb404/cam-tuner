"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommonFieldProps } from "./types";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectFieldProps extends CommonFieldProps<string> {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  className = "",
  placeholder = "Select an option",
  description,
  error,
  disabled = false,
  required = false,
  orientation = "vertical",
  encode = (v) => v,
  decode = (v) => v,
}: SelectFieldProps) {
  const isInvalid = !!error;

  const handleChange = (newValue: string) => {
    onChange(encode(newValue));
  };

  return (
    <Field
      className={className}
      orientation={orientation}
      data-invalid={isInvalid}
      data-disabled={disabled}
    >
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </FieldLabel>
      <Select
        value={decode(value)}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          aria-invalid={isInvalid}
          aria-describedby={description ? `${id}-description` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && (
        <FieldDescription id={`${id}-description`}>
          {description}
        </FieldDescription>
      )}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
