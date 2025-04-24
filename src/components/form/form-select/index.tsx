"use client";

import { CustomVariant } from "./custom";
import { DefaultVariant } from "./default";

export type Option = {
  label: string;
  value: string;
};

export interface FormSelectProps {
  label: string;
  id: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}

export function FormSelect(props: FormSelectProps) {
  if (__BROWSER__ === "firefox") {
    return <CustomVariant {...props} />;
  }

  return <DefaultVariant {...props} />;
}
