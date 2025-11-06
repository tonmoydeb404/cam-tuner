"use client"

import { useController, type UseControllerProps, type FieldValues } from "react-hook-form"
import { SliderField } from "@/components/fields/slider-field"

interface FormSliderFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string
  min: number
  max: number
  step: number
  unit?: string
  description?: string
  disabled?: boolean
  formatValue?: (value: number) => string
  showValue?: boolean
  showPercentage?: boolean
  showMinMax?: boolean
  orientation?: "vertical" | "horizontal" | "responsive"
  className?: string
}

export function FormSliderField<T extends FieldValues>({
  label,
  name,
  control,
  rules,
  min,
  max,
  step,
  unit = "",
  description,
  disabled = false,
  formatValue,
  showValue = true,
  showPercentage = true,
  showMinMax = true,
  orientation = "vertical",
  className,
  defaultValue,
  shouldUnregister,
}: FormSliderFieldProps<T>) {
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
    <SliderField
      id={name}
      label={label}
      value={field.value ?? min}
      onChange={field.onChange}
      min={min}
      max={max}
      step={step}
      unit={unit}
      description={description}
      error={error?.message}
      disabled={disabled}
      formatValue={formatValue}
      showValue={showValue}
      showPercentage={showPercentage}
      showMinMax={showMinMax}
      orientation={orientation}
      className={className}
    />
  )
}
