import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";

interface FormInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: React.HTMLInputTypeAttribute;
}

export function FormInput({
  label,
  id,
  value,
  onChange,
  className = "",
  type,
}: FormInputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <div>
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
        />
      </div>
    </div>
  );
}
