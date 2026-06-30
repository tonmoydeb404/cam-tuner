---
source: GitHub source (google-ai-edge/mediapipe) — exact .d.ts files
library: MediaPipe
package: @mediapipe/tasks-vision
topic: TypeScript type definitions for FaceDetector result types
fetched: 2026-06-30T12:00:00Z
official_docs: https://ai.google.dev/edge/mediapipe/solutions/vision/face_detector/web_ts
---

# @mediapipe/tasks-vision — Exact TypeScript Type Definitions

All definitions below are copied verbatim from the actual `.d.ts` source files
in the `google-ai-edge/mediapipe` repository (master branch, June 2026).

---

## BoundingBox (`bounding_box.d.ts`)

```typescript
/** An integer bounding box, axis aligned. */
export declare interface BoundingBox {
  /** The X coordinate of the top-left corner, in pixels. */
  originX: number;
  /** The Y coordinate of the top-left corner, in pixels. */
  originY: number;
  /** The width of the bounding box, in pixels. */
  width: number;
  /** The height of the bounding box, in pixels. */
  height: number;
  /**
   * Angle of rotation of the original non-rotated box around the top left
   * corner of the original non-rotated box, in clockwise degrees from the
   * horizontal.
   */
  angle: number;
}
```

**Coordinate system: PIXELS relative to the input frame.**
NOT normalized 0..1. NOT `{x, y}` — it's `{originX, originY}`.

---

## Category (`category.d.ts`)

```typescript
/** A classification category. */
export declare interface Category {
  /** The probability score of this label category. */
  score: number;
  /** The index of the category in the corresponding label file. */
  index: number;
  /**
   * The label of this category object. Defaults to an empty string if there
   * is no category.
   */
  categoryName: string;
  /**
   * The display name of the label, which may be translated for different
   * locales. Defaults to an empty string if there is no display name.
   */
  displayName: string;
}
```

---

## NormalizedKeypoint (`keypoint.d.ts`)

```typescript
/**
 * A keypoint, defined by the coordinates (x, y), normalized by the image
 * dimensions.
 */
export declare interface NormalizedKeypoint {
  /** X in normalized image coordinates. */
  x: number;
  /** Y in normalized image coordinates. */
  y: number;
  /** Optional label of the keypoint. */
  label?: string;
  /** Optional score of the keypoint. */
  score?: number;
}
```

**Coordinate system: NORMALIZED 0..1** (multiply by image width/height for pixels).

---

## Detection (`detection_result.d.ts`)

```typescript
import { BoundingBox } from './bounding_box';
import { Category } from './category';
import { NormalizedKeypoint } from './keypoint';

/** Represents one detection by a detection task. */
export declare interface Detection {
  /** A list of `Category` objects. */
  categories: Category[];

  /** The bounding box of the detected objects. */
  boundingBox?: BoundingBox;

  /**
   * List of keypoints associated with the detection. Keypoints represent
   * interesting points related to the detection. For example, the keypoints
   * represent the eye, ear and mouth from face detection model. Contains an
   * empty list if no keypoints are detected.
   */
  keypoints: NormalizedKeypoint[];
}

/** Detection results of a model. */
export declare interface DetectionResult {
  /** A list of Detections. */
  detections: Detection[];
}
```

---

## FaceDetectorResult (`face_detector_result.d.ts`)

```typescript
// FaceDetectorResult is simply a re-export of DetectionResult:
export { BoundingBox } from './bounding_box';
export { Category } from './category';
export { Detection, DetectionResult as FaceDetectorResult } from './detection_result';
```

**So `FaceDetectorResult = { detections: Detection[] }`**

---

## FaceDetectorOptions (`face_detector_options.d.ts`)

```typescript
import { VisionTaskOptions } from './vision_task_options';

/** Options to configure the MediaPipe Face Detector Task */
export declare interface FaceDetectorOptions extends VisionTaskOptions {
  /**
   * The minimum confidence score for the face detection to be considered
   * successful. Defaults to 0.5.
   */
  minDetectionConfidence?: number | undefined;

  /**
   * The minimum non-maximum-suppression threshold for face detection to be
   * considered overlapped. Defaults to 0.3.
   */
  minSuppressionThreshold?: number | undefined;
}
```

---

## VisionTaskOptions (`vision_task_options.d.ts`)

```typescript
export type RunningMode = 'IMAGE' | 'VIDEO';

export declare interface VisionTaskOptions extends TaskRunnerOptions {
  /**
   * The canvas element to bind textures to. Required for GPU processing.
   */
  canvas?: HTMLCanvasElement | OffscreenCanvas;

  /**
   * The running mode of the task. Default to the image mode.
   * 1) IMAGE: for processing single image inputs.
   * 2) VIDEO: for processing decoded frames of a video.
   */
  runningMode?: RunningMode;
}
```

---

## WasmFileset (`wasm_fileset.d.ts`)

```typescript
/** An object containing the locations of the Wasm assets */
export declare interface WasmFileset {
  /** The path to the Wasm loader script. */
  wasmLoaderPath: string;
  /** The path to the Wasm binary. */
  wasmBinaryPath: string;
  /** The optional path to the asset loader script. */
  assetLoaderPath?: string;
  /** The optional path to the assets binary. */
  assetBinaryPath?: string;
}
```

---

## FaceDetector class — key methods (`face_detector.ts`)

```typescript
export class FaceDetector extends VisionTaskRunner {

  // ── Factory methods ──
  static createFromOptions(
    wasmFileset: WasmFileset,
    faceDetectorOptions: FaceDetectorOptions,
  ): Promise<FaceDetector>;

  static createFromModelPath(
    wasmFileset: WasmFileset,
    modelAssetPath: string,
  ): Promise<FaceDetector>;

  static createFromModelBuffer(
    wasmFileset: WasmFileset,
    modelAssetBuffer: Uint8Array | ReadableStreamDefaultReader,
  ): Promise<FaceDetector>;

  // ── Update options after creation ──
  setOptions(options: FaceDetectorOptions): Promise<void>;

  // ── IMAGE mode detection ──
  detect(
    image: ImageSource,
    imageProcessingOptions?: ImageProcessingOptions,
  ): FaceDetectorResult;

  // ── VIDEO mode detection ──
  detectForVideo(
    videoFrame: ImageSource,
    timestamp: number,
    imageProcessingOptions?: ImageProcessingOptions,
  ): FaceDetectorResult;

  // ── Lifecycle ──
  close(): void;  // inherited from TaskRunner, releases WASM graph + resources
}
```

---

## Coordinate System Summary

| Field | Type | Coordinate System |
|-------|------|-------------------|
| `Detection.boundingBox.originX/originY/width/height` | `number` | **PIXELS** relative to input frame |
| `Detection.boundingBox.angle` | `number` | clockwise degrees |
| `Detection.keypoints[].x/y` | `number` | **NORMALIZED 0..1** |
| `Detection.categories[].score` | `number` | **0..1** confidence |
