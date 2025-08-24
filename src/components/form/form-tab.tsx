"use client";

import { Label } from "../ui/label";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export type FormTabOption<T> = {
  label: string;
  value: T;
};

export interface FormTabsProps<T> {
  label: string;
  id: string;
  value: T;
  options: FormTabOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function FormTabs<T extends string>({
  label,
  id,
  value,
  options,
  onChange,
  className = "",
}: FormTabsProps<T>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Tabs
        value={value}
        onValueChange={onChange as () => void}
        className="w-full"
      >
        <TabsList className="w-full bg-accent dark:bg-background">
          {options.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
