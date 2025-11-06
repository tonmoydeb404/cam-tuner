"use client";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { CommonFieldProps } from "./types";

export interface SliderFieldProps extends CommonFieldProps<number> {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  formatValue?: (value: number) => string;
  showValue?: boolean;
  showPercentage?: boolean;
  showMinMax?: boolean;
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
  encode = (v) => v,
  decode = (v) => v,
}: SliderFieldProps) {
  const isInvalid = !!error;
  const decodedValue = decode(value);
  const displayValue = formatValue
    ? formatValue(decodedValue)
    : decodedValue.toString();
  const percentage = ((decodedValue - min) / (max - min)) * 100;

  const handleChange = (newValue: number) => {
    onChange(encode(newValue));
  };

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
            className="text-sm font-medium text-foreground bg-muted/50 px-2 py-1 rounded-md min-w-12 text-center"
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
          value={[decodedValue]}
          onValueChange={(values) => handleChange(values[0])}
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
  );
}
