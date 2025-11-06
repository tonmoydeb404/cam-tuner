"use client"

import { useController, type UseControllerProps, type FieldValues } from "react-hook-form"
import { InputField } from "@/components/fields/input-field"

interface FormInputFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  description?: string
  disabled?: boolean
  required?: boolean
  orientation?: "vertical" | "horizontal" | "responsive"
  className?: string
}

export function FormInputField<T extends FieldValues>({
  label,
  name,
  control,
  rules,
  type = "text",
  placeholder,
  description,
  disabled = false,
  required = false,
  orientation = "vertical",
  className,
  defaultValue,
  shouldUnregister,
}: FormInputFieldProps<T>) {
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
    <InputField
      id={name}
      label={label}
      value={field.value ?? ""}
      onChange={field.onChange}
      type={type}
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
