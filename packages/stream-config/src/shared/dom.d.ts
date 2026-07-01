/**
 * Type declarations for browser APIs used by the stream processing engines
 * that aren't yet in standard TypeScript lib definitions.
 *
 * This file is ambient (no import/export) so declarations merge globally.
 */

// --- requestVideoFrameCallback (Chromium + Firefox) ---
interface HTMLVideoElement {
  requestVideoFrameCallback(callback: VideoFrameCallback): number
  cancelVideoFrameCallback(handle: number): void
}

type VideoFrameCallback = (
  now: number,
  metadata: VideoFrameCallbackMetadata
) => void

interface VideoFrameCallbackMetadata {
  mediaTime: number
  presentedFrames: number
  expectedDisplayTime: number
  width?: number
  height?: number
}

// --- Canvas captureStream with requestFrame ---
interface CanvasCaptureMediaStreamTrack extends MediaStreamTrack {
  requestFrame(): void
  readonly canvas: HTMLCanvasElement
}

// --- WebCodecs Insertable Streams ---
interface MediaStreamTrackProcessorInit {
  track: MediaStreamTrack
  maxBufferSize?: number
}

interface MediaStreamTrackProcessor {
  readable: ReadableStream<VideoFrame>
}

interface MediaStreamTrackGeneratorInit {
  kind: "video" | "audio"
}

interface MediaStreamTrackGenerator extends MediaStreamTrack {
  writable: WritableStream<VideoFrame>
}

declare var MediaStreamTrackProcessor: {
  new (init: MediaStreamTrackProcessorInit): MediaStreamTrackProcessor
}

declare var MediaStreamTrackGenerator: {
  new (init: MediaStreamTrackGeneratorInit): MediaStreamTrackGenerator
}

// --- VideoFrame with visibleRect constructor option ---
interface VideoFrameInit {
  visibleRect?: DOMRectInit
}
