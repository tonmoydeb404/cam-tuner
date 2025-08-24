import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import * as React from "react";

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "destructive";
  headerActions?: React.ReactNode;
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  (
    {
      className,
      title,
      description,
      icon: Icon,
      badge,
      badgeVariant = "default",
      headerActions,
      children,
      ...props
    },
    ref
  ) => {
    const badgeClasses = {
      default: "text-muted-foreground bg-muted",
      success:
        "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-950/30",
      warning:
        "text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-950/30",
      destructive:
        "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950/30",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "space-y-4 p-4 bg-card border border-border rounded-lg",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {Icon && (
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg shrink-0">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-card-foreground">
                  {title}
                </h3>
                {badge && (
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full shrink-0 font-medium",
                      badgeClasses[badgeVariant]
                    )}
                  >
                    {badge}
                  </span>
                )}
              </div>
              {description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
          {headerActions && (
            <div className="shrink-0 ml-2">{headerActions}</div>
          )}
        </div>
        {children}
      </div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

export { FeatureCard };
