import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState(props: EmptyStateProps) {
  const { icon, title, description, action, className } = props;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-55 gap-1.75 p-6 text-center text-muted-foreground bg-inset rounded-xl",
        className,
      )}
    >
      <span className="text-faint">{icon}</span>
      <strong className="text-ink text-[0.88rem]">{title}</strong>
      <span className="text-[0.76rem] max-w-55">{description}</span>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
