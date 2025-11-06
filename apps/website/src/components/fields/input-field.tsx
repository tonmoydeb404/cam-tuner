"use client"

import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

interface InputFieldProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  className?: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  description?: string
  error?: string
  disabled?: boolean
  required?: boolean
  orientation?: "vertical" | "horizontal" | "responsive"
}

export function InputField({
  label,
  id,
  value,
  onChange,
  className = "",
  type = "text",
  placeholder,
  description,
  error,
  disabled = false,
  required = false,
  orientation = "vertical",
}: InputFieldProps) {
  const isInvalid = !!error

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
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
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
