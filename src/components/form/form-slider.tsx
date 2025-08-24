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
  const percentage = ((value - min) / (max - min)) * 100;
  const isDefault = value === (min + max) / 2 || value === 100; // Assume 100 or middle is default
  const descriptionId = `${id}-description`;
  const valueId = `${id}-value`;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
        <div className="flex items-center gap-2">
          <span 
            id={valueId}
            aria-live="polite"
            className="text-sm font-medium text-foreground bg-muted/50 px-2 py-1 rounded-md min-w-[3rem] text-center"
          >
            {displayValue}{unit}
          </span>
          {isDefault && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Default
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Slider
          id={id}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          aria-describedby={descriptionId}
          aria-valuetext={`${displayValue}${unit}`}
        />
        
        {/* Visual indicators */}
        <div id={descriptionId} className="flex justify-between text-xs text-muted-foreground">
          <span>{min}{unit}</span>
          <span className="font-medium">
            {percentage.toFixed(0)}%
          </span>
          <span>{max}{unit}</span>
        </div>
      </div>
      
      {/* Quick access buttons for common values */}
      {label === "Digital Zoom" && (
        <div className="flex gap-1.5" role="group" aria-label="Quick zoom presets">
          {[1, 1.5, 2, 2.5, 3].map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`text-xs px-2.5 py-1.5 rounded-md border transition-all ${
                Math.abs(value - preset) < 0.1 
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                  : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground hover:border-border'
              }`}
              title={`Set zoom to ${preset}x`}
              aria-label={`Set zoom to ${preset}x`}
            >
              {preset}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
