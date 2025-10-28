import * as React from "react";
import { cn } from "@/lib/utils";

interface KeyboardShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  keys: string[];
  separator?: string;
}

const KeyboardShortcut = React.forwardRef<HTMLSpanElement, KeyboardShortcutProps>(
  ({ className, keys, separator = "+", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 text-xs font-mono text-muted-foreground",
          className
        )}
        {...props}
      >
        {keys.map((key, index) => (
          <React.Fragment key={key}>
            <kbd className="bg-muted px-1.5 py-0.5 rounded border border-border text-xs font-mono">
              {key}
            </kbd>
            {index < keys.length - 1 && (
              <span className="text-muted-foreground/50">{separator}</span>
            )}
          </React.Fragment>
        ))}
      </span>
    );
  }
);

KeyboardShortcut.displayName = "KeyboardShortcut";

export { KeyboardShortcut };