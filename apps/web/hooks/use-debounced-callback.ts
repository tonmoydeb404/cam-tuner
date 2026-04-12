import { useCallback, useRef } from "react"

/**
 * Returns a debounced version of a function that delays invocation
 * until `ms` milliseconds have elapsed since the last call.
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  ms: number
): (...args: Parameters<T>) => void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => callback(...args), ms)
    },
    [callback, ms]
  )
}
