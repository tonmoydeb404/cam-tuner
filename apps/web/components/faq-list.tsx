interface FaqItem {
  q: string
  a: string
}

/**
 * Accessible Q&A list using native details/summary — rendered in the initial
 * HTML so crawlers and AI engines extract the answers directly.
 */
export const FaqList = ({
  items,
  className = "",
}: {
  items: FaqItem[]
  className?: string
}) => (
  <div
    className={`divide-y divide-border border-y border-foreground ${className}`}
  >
    {items.map((item) => (
      <details key={item.q} className="group py-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
          {item.q}
        </summary>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          {item.a}
        </p>
      </details>
    ))}
  </div>
)
