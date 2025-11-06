"use client"

import { Slider } from "@/components/ui/slider"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldContent,
  FieldTitle,
} from "@/components/ui/field"

interface SliderFieldProps {
  label: string
  id: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  unit?: string
  className?: string
  description?: string
  error?: string
  disabled?: boolean
  formatValue?: (value: number) => string
  showValue?: boolean
  showPercentage?: boolean
  showMinMax?: boolean
  orientation?: "vertical" | "horizontal" | "responsive"
}

export function SliderField({
  label,
  id,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
  className = "",
  description,
  error,
  disabled = false,
  formatValue,
  showValue = true,
  showPercentage = true,
  showMinMax = true,
  orientation = "vertical",
}: SliderFieldProps) {
  const isInvalid = !!error
  const displayValue = formatValue ? formatValue(value) : value.toString()
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <Field
      className={className}
      orientation={orientation}
      data-invalid={isInvalid}
      data-disabled={disabled}
    >
      <div className="flex items-center justify-between w-full">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {showValue && (
          <span
            id={`${id}-value`}
            aria-live="polite"
            className="text-sm font-medium text-foreground bg-muted/50 px-2 py-1 rounded-md min-w-[3rem] text-center"
          >
            {displayValue}
            {unit}
          </span>
        )}
      </div>

      <FieldContent>
        <Slider
          id={id}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          disabled={disabled}
          aria-invalid={isInvalid}
          aria-describedby={description ? `${id}-description` : undefined}
          aria-valuetext={`${displayValue}${unit}`}
        />

        {(showMinMax || showPercentage) && (
          <div className="flex justify-between text-xs text-muted-foreground">
            {showMinMax && (
              <span>
                {min}
                {unit}
              </span>
            )}
            {showPercentage && (
              <span className="font-medium">{percentage.toFixed(0)}%</span>
            )}
            {showMinMax && (
              <span>
                {max}
                {unit}
              </span>
            )}
          </div>
        )}

        {description && (
          <FieldDescription id={`${id}-description`}>
            {description}
          </FieldDescription>
        )}
      </FieldContent>

      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}
