import {
  streamPatcher,
  StreamPatcherConfig,
  StreamPatcherSize,
} from "@/utils/stream-patcher";
import { useEffect, useRef, useState } from "react";

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
  config?: StreamPatcherConfig
) {
  const [patchedStream, setPatchedStream] = useState<MediaStream | null>(null);
  const previousPatchedStreamRef = useRef<MediaStream | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleCallbackRef = useRef<IdleCallbackId | null>(null);

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
        const newPatchedStream = streamPatcher(stream, size, config);

        if (previousPatchedStreamRef.current) {
          previousPatchedStreamRef.current.getTracks().forEach((t) => t.stop());
        }

        previousPatchedStreamRef.current = newPatchedStream;
        setPatchedStream(newPatchedStream);
      });
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      if (idleCallbackRef.current !== null) cancelIdle(idleCallbackRef.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stream,
    size?.width,
    size?.height,
    config?.aspectRatio,
    config?.zoom,
    config?.brightness,
    config?.contrast,
    config?.saturation,
    config?.mirror,
  ]);

  useEffect(() => {
    return () => {
      previousPatchedStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return patchedStream;
}

export default useStreamPatcher;
