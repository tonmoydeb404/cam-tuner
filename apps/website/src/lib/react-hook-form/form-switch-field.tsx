"use client"

import { useController, type UseControllerProps, type FieldValues } from "react-hook-form"
import { SwitchField } from "@/components/fields/switch-field"

interface FormSwitchFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string
  description?: string
  disabled?: boolean
  orientation?: "vertical" | "horizontal" | "responsive"
  className?: string
}

export function FormSwitchField<T extends FieldValues>({
  label,
  name,
  control,
  rules,
  description,
  disabled = false,
  orientation = "horizontal",
  className,
  defaultValue,
  shouldUnregister,
}: FormSwitchFieldProps<T>) {
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
    <SwitchField
      id={name}
      label={label}
      checked={field.value ?? false}
      onChange={field.onChange}
      description={description}
      error={error?.message}
      disabled={disabled}
      orientation={orientation}
      className={className}
    />
  )
}
