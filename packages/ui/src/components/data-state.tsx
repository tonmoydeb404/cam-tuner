import { cn } from "@workspace/ui/lib/utils";
import * as React from "react";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";

type DataStateProps<T> = {
  /** True while the first load is in flight. */
  loading: boolean;
  /** Error message, if the load failed. */
  error: string | null;
  /** The loaded rows. Empty array renders the empty state. */
  data: T[] | null | undefined;
  /** Title shown when there is nothing to render. */
  emptyTitle: string;
  /** Supporting text for the empty state. */
  emptyHint?: string;
  /** Action (e.g. a create button) rendered inside the empty state. */
  emptyAction?: React.ReactNode;
  /** Called by the error state's retry button. Defaults to a no-op reload. */
  onRetry?: () => void;
  /** Number of skeleton rows during loading. */
  skeletonCount?: number;
  /**
   * Custom loading UI, overriding the default skeleton rows. Pass a render
   * function to repeat it `skeletonCount` times, or a plain node to render once.
   */
  loadingComponent?: React.ReactNode | ((index: number) => React.ReactNode);
  className?: string;
  children: (data: T[]) => React.ReactNode;
};

/**
 * One component for every async list state: skeleton rows while loading,
 * message + retry on error, illustration-free empty state, and the real
 * content otherwise. Data flows in via props; content renders via children.
 */
export function DataState<T>({
  loading,
  error,
  data,
  emptyTitle,
  emptyHint,
  emptyAction,
  onRetry,
  skeletonCount = 1,
  loadingComponent,
  className,
  children,
}: DataStateProps<T>) {
  if (loading) {
    if (typeof loadingComponent === "function") {
      return (
        <>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <React.Fragment key={i}>{loadingComponent(i)}</React.Fragment>
          ))}
        </>
      );
    }

    if (loadingComponent) return <>{loadingComponent}</>;

    return (
      <div
        className={cn("grid gap-2", className)}
        aria-busy="true"
        aria-live="polite"
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "grid justify-items-center gap-2 rounded-lg border border-border p-8 text-center",
          className,
        )}
        role="alert"
      >
        <p className="text-sm font-medium text-destructive">
          Something went wrong
        </p>
        <p className="max-w-xs text-sm text-muted-foreground">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => (onRetry ? onRetry() : window.location.reload())}
        >
          Try again
        </Button>
      </div>
    );
  }

  const rows = data ?? [];
  if (rows.length === 0) {
    return (
      <div
        className={cn(
          "grid justify-items-center gap-1.5 rounded-lg border border-dashed border-border p-8 text-center",
          className,
        )}
      >
        <p className="text-sm font-medium">{emptyTitle}</p>
        {emptyHint && (
          <p className="max-w-xs text-sm text-muted-foreground">{emptyHint}</p>
        )}
        {emptyAction && <div className="mt-2">{emptyAction}</div>}
      </div>
    );
  }

  return <>{children(rows)}</>;
}
