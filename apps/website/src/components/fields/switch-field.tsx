"use client"

import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

interface SwitchFieldProps {
  label: string
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  description?: string
  error?: string
  disabled?: boolean
  orientation?: "vertical" | "horizontal" | "responsive"
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
}: SwitchFieldProps) {
  const isInvalid = !!error

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
        checked={checked}
        onCheckedChange={onChange}
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
  )
}
