import * as React from "react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "active" | "inactive" | "warning" | "error" | "connecting";
  size?: "sm" | "md" | "lg";
  showPulse?: boolean;
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, status, size = "md", showPulse = false, ...props }, ref) => {
    const sizeClasses = {
      sm: "w-2 h-2",
      md: "w-3 h-3", 
      lg: "w-4 h-4"
    };

    const statusClasses = {
      active: "bg-green-500",
      inactive: "bg-gray-400",
      warning: "bg-yellow-500", 
      error: "bg-red-500",
      connecting: "bg-blue-500"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-full",
          sizeClasses[size],
          statusClasses[status],
          showPulse && (status === "active" || status === "connecting") && "animate-pulse",
          className
        )}
        {...props}
      />
    );
  }
);

StatusIndicator.displayName = "StatusIndicator";

export { StatusIndicator };