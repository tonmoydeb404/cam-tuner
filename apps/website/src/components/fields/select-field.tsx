"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface SelectFieldProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  className?: string
  placeholder?: string
  description?: string
  error?: string
  disabled?: boolean
  required?: boolean
  orientation?: "vertical" | "horizontal" | "responsive"
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
}: SelectFieldProps) {
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
      <Select value={value} onValueChange={onChange} disabled={disabled}>
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
  )
}
