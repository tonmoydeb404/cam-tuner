/**
 * Renders a JSON-LD script tag. Only pass data from trusted, first-party
 * sources (data/ files) — values are stringified as-is.
 */
export const JsonLd = ({ data }: { data: object }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
)
