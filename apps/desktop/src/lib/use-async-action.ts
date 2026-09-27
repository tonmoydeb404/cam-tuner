import { useCallback, useRef, useState } from "react";

/**
 * Wraps an async action with its own loading/error state, so callers don't
 * have to hand-roll a `[loading, error]` pair for every mutation.
 * Stale calls (superseded by a newer one before they resolve) don't clobber
 * the loading/error state of the latest call.
 */
export function useAsyncAction<Args extends unknown[], Result>(
  action: (...args: Args) => Promise<Result>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const callId = useRef(0);

  const run = useCallback(
    async (...args: Args) => {
      const id = ++callId.current;
      setIsLoading(true);
      setError(null);
      try {
        return await action(...args);
      } catch (err) {
        if (id === callId.current) {
          setError(err instanceof Error ? err.message : String(err));
        }
        throw err;
      } finally {
        if (id === callId.current) setIsLoading(false);
      }
    },
    [action],
  );

  return { run, isLoading, error };
}
