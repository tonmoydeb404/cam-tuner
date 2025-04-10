import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FormSliderProps {
  label: string;
  id: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  className?: string;
  formatValue?: (value: number) => string;
}

export function FormSlider({
  label,
  id,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
  className = "",
  formatValue,
}: FormSliderProps) {
  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-sm text-muted-foreground">
          {displayValue}
          {unit}
        </span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
      />
    </div>
  );
}
