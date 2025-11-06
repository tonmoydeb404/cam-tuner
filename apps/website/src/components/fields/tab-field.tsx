"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { CommonFieldProps } from "./types";

export interface TabOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface TabFieldProps extends CommonFieldProps<string> {
  value: string;
  onChange: (value: string) => void;
  options: TabOption[];
}

export function TabField({
  label,
  id,
  value,
  onChange,
  options,
  className = "",
  description,
  error,
  disabled = false,
  required = false,
  orientation = "vertical",
  encode = (v) => v,
  decode = (v) => v,
}: TabFieldProps) {
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
      <Tabs
        value={decode(value)}
        onValueChange={handleChange}
        className="w-full"
      >
        <TabsList className="w-full bg-accent dark:bg-background">
          {options.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {description && (
        <FieldDescription id={`${id}-description`}>
          {description}
        </FieldDescription>
      )}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
