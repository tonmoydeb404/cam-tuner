/* eslint-disable @typescript-eslint/no-explicit-any */
export type CommonFieldProps<S> = {
  label: string;
  id: string;
  className?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: "vertical" | "horizontal" | "responsive";
  encode?: (value: S) => any;
  decode?: (value: any) => S;
};
