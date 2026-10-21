import { buildLlmsFull } from "@/lib/llms"

// Fully determined by build-time data files, so prerender it.
export const dynamic = "force-static"

export function GET() {
  return new Response(buildLlmsFull(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  })
}
