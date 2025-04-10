import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FormSwitchProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  layout?: "single-line" | "double-line";
}

export function FormSwitch({
  label,
  id,
  checked,
  onChange,
  className = "",
  layout = "single-line",
}: FormSwitchProps) {
  if (layout === "single-line") {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
        <Switch id={id} checked={checked} onCheckedChange={onChange} />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <div>
        <Switch id={id} checked={checked} onCheckedChange={onChange} />
      </div>
    </div>
  );
}
