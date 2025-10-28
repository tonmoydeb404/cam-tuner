import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  loading: boolean;
  error?: string | null;
  retryAction?: () => void;
  loadingText?: string;
  variant?: "skeleton" | "spinner" | "minimal";
  size?: "sm" | "md" | "lg";
}

const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ 
    className, 
    loading, 
    error, 
    retryAction, 
    loadingText = "Loading...",
    variant = "spinner",
    size = "md",
    children,
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: "text-xs",
      md: "text-sm", 
      lg: "text-base"
    };

    const iconSizes = {
      sm: 16,
      md: 20,
      lg: 24
    };

    if (error) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-col items-center justify-center p-4 text-center space-y-2 bg-destructive/5 border border-destructive/20 rounded-lg",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          <p className="text-destructive font-medium">Error: {error}</p>
          {retryAction && (
            <button
              onClick={retryAction}
              className="text-xs text-primary hover:underline focus:outline-none focus:underline"
            >
              Try again
            </button>
          )}
        </div>
      );
    }

    if (loading) {
      if (variant === "skeleton") {
        return (
          <div
            ref={ref}
            className={cn("space-y-2", className)}
            {...props}
          >
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        );
      }

      if (variant === "minimal") {
        return (
          <div
            ref={ref}
            className={cn("flex items-center gap-2", sizeClasses[size], className)}
            {...props}
          >
            <Loader2 className="animate-spin" size={iconSizes[size]} />
            <span className="text-muted-foreground">{loadingText}</span>
          </div>
        );
      }

      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-col items-center justify-center p-6 space-y-3 bg-muted/20 rounded-lg",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          <Loader2 className="animate-spin text-primary" size={iconSizes[size]} />
          <span className="text-muted-foreground">{loadingText}</span>
        </div>
      );
    }

    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);

LoadingState.displayName = "LoadingState";

export { LoadingState };