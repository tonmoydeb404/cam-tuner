import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "destructive";
  headerActions?: React.ReactNode;
  type?: "card" | "accordion-item";
  value?: string; // Required for accordion-item type
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
      type = "card",
      value,
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

    const headerContent = (
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
    );

    if (type === "accordion-item") {
      return (
        <AccordionItem
          value={value || title}
          className={cn(className, "border-0")}
          {...props}
        >
          <AccordionTrigger className="px-4 py-4 bg-card border border-border rounded-lg hover:no-underline hover:bg-muted/50 transition-colors [&[data-state=open]]:border-b-0 [&[data-state=open]]:rounded-b-none">
            <div className="flex items-start justify-between w-full">
              {headerContent}
              {headerActions && (
                <div className="shrink-0 ml-2">{headerActions}</div>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 bg-card border-l border-r border-b border-border rounded-b-lg">
            {children}
          </AccordionContent>
        </AccordionItem>
      );
    }

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
          {headerContent}
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

export { Accordion, FeatureCard };
