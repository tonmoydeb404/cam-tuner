"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";

const DOTS = "…";

/** Page numbers to render, collapsing the middle into a single ellipsis. */
function buildPageRange(
  page: number,
  pageCount: number,
  siblingCount: number,
): (number | typeof DOTS)[] {
  const totalVisible = siblingCount * 2 + 5;
  if (totalVisible >= pageCount) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblingCount, 1);
  const right = Math.min(page + siblingCount, pageCount);
  const showLeftDots = left > 2;
  const showRightDots = right < pageCount - 1;

  if (!showLeftDots && showRightDots) {
    const size = 3 + siblingCount * 2;
    return [...Array.from({ length: size }, (_, i) => i + 1), DOTS, pageCount];
  }

  if (showLeftDots && !showRightDots) {
    const size = 3 + siblingCount * 2;
    return [
      1,
      DOTS,
      ...Array.from({ length: size }, (_, i) => pageCount - size + i + 1),
    ];
  }

  return [
    1,
    DOTS,
    ...Array.from({ length: right - left + 1 }, (_, i) => left + i),
    DOTS,
    pageCount,
  ];
}

type Props = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Page links shown on each side of the current page. */
  siblingCount?: number;
  className?: string;
};

/** Reusable numbered pagination control for client-side paged lists. */
export function PaginationControl({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  className,
}: Props) {
  if (pageCount <= 1) return null;

  const range = buildPageRange(page, pageCount, siblingCount);

  function go(e: React.MouseEvent, target: number) {
    e.preventDefault();
    if (target >= 1 && target <= pageCount) onPageChange(target);
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
            onClick={(e) => go(e, page - 1)}
          />
        </PaginationItem>

        {range.map((p, i) =>
          p === DOTS ? (
            <PaginationItem key={`dots-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e) => go(e, p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page >= pageCount}
            className={
              page >= pageCount ? "pointer-events-none opacity-50" : undefined
            }
            onClick={(e) => go(e, page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
