import { StreamPatcherConfig, StreamPatcherSize } from "@/types/stream-patcher";
import { streamPatcher } from "@/utils/stream-patcher";
import { cleanupMediaStream } from "@/utils/stream-utils";
import { useCallback, useEffect, useRef, useState } from "react";

type IdleCallbackId = number;

// Fallback for requestIdleCallback
const requestIdle =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? window.requestIdleCallback
    : (cb: IdleRequestCallback): number =>
        window.setTimeout(
          () => cb({ didTimeout: false, timeRemaining: () => 50 }),
          0
        );

const cancelIdle =
  typeof window !== "undefined" && "cancelIdleCallback" in window
    ? window.cancelIdleCallback
    : (id: number) => clearTimeout(id);

function useStreamPatcher(
  stream: MediaStream | null,
  size: StreamPatcherSize | null,
  config: StreamPatcherConfig = {} // Set default empty object if undefined
) {
  const [patchedStream, setPatchedStream] = useState<MediaStream | null>(null);
  const previousPatchedStreamRef = useRef<MediaStream | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleCallbackRef = useRef<IdleCallbackId | null>(null);

  // Memoize the patching logic to avoid unnecessary recalculations
  const patchStream = useCallback(() => {
    if (!stream || !size) return;

    const newPatchedStream = streamPatcher(stream, size, config);

    // Check if the patched stream is different from the previous one
    if (previousPatchedStreamRef.current !== newPatchedStream) {
      // Stop the tracks from the previous patched stream
      if (previousPatchedStreamRef.current) {
        cleanupMediaStream(previousPatchedStreamRef.current);
      }

      previousPatchedStreamRef.current = newPatchedStream;
      setPatchedStream(newPatchedStream);
    }
  }, [stream, size, config]);

  useEffect(() => {
    if (!stream || !size) {
      setPatchedStream(null);
      return;
    }

    // Clear any existing scheduled tasks
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    if (idleCallbackRef.current !== null) cancelIdle(idleCallbackRef.current);

    debounceTimeoutRef.current = setTimeout(() => {
      idleCallbackRef.current = requestIdle(() => {
        patchStream();
      });
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      if (idleCallbackRef.current !== null) cancelIdle(idleCallbackRef.current);
    };
  }, [stream, size, config, patchStream]); // Added patchStream to dependencies

  // Cleanup when component unmounts or stream is removed
  useEffect(() => {
    return () => {
      cleanupMediaStream(previousPatchedStreamRef.current);
    };
  }, []);

  return patchedStream;
}

export default useStreamPatcher;
