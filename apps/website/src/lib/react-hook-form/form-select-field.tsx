"use client"

import { useController, type UseControllerProps, type FieldValues } from "react-hook-form"
import { SelectField, type SelectOption } from "@/components/fields/select-field"

interface FormSelectFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string
  options: SelectOption[]
  placeholder?: string
  description?: string
  disabled?: boolean
  required?: boolean
  orientation?: "vertical" | "horizontal" | "responsive"
  className?: string
}

export function FormSelectField<T extends FieldValues>({
  label,
  name,
  control,
  rules,
  options,
  placeholder = "Select an option",
  description,
  disabled = false,
  required = false,
  orientation = "vertical",
  className,
  defaultValue,
  shouldUnregister,
}: FormSelectFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister,
  })

  return (
    <SelectField
      id={name}
      label={label}
      value={field.value ?? ""}
      onChange={field.onChange}
      options={options}
      placeholder={placeholder}
      description={description}
      error={error?.message}
      disabled={disabled}
      required={required}
      orientation={orientation}
      className={className}
    />
  )
}
