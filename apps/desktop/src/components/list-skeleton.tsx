import { Skeleton } from "@workspace/ui/components/skeleton";

function RowSkeleton() {
  return (
    <div className="flex items-center gap-2.5 border-b border-separator px-3 py-[11px] last:border-b-0">
      <Skeleton className="size-8 shrink-0 rounded-lg" />
      <div className="grid min-w-0 flex-1 gap-[3px]">
        <Skeleton className="h-3 w-1/3 rounded-full" />
        <Skeleton className="h-2.5 w-2/3 rounded-full" />
      </div>
      <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
    </div>
  );
}

function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-inset">
      <div className="flex items-center justify-between bg-inset/95 px-3 py-1.5 backdrop-blur-[6px]">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <RowSkeleton key={i} />
      ))}
    </div>
  );
}

export { ListSkeleton, RowSkeleton };
