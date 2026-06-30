---
source: Context7 API + GitHub source (google-ai-edge/mediapipe) + npm registry
library: MediaPipe
package: @mediapipe/tasks-vision
topic: FaceDetector API (web/TypeScript)
fetched: 2026-06-30T12:00:00Z
official_docs: https://ai.google.dev/edge/mediapipe/solutions/vision/face_detector/web_ts
---

# @mediapipe/tasks-vision — FaceDetector API (Web/TypeScript)

## 1. Installation

**Current version on npm: `0.10.35`** (as of June 2026)

```bash
npm install @mediapipe/tasks-vision
# or
yarn add @mediapipe/tasks-vision
# or
pnpm add @mediapipe/tasks-vision
```

Package details:
- **License**: Apache-2.0
- **Entry**: `vision_bundle.mjs` (ESM) / `vision_bundle.cjs` (CommonJS)
- **Types**: `vision.d.ts`
- **Unpacked size**: ~34.8 MB (includes WASM binaries)

Import in code:
```typescript
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
```

---

## 2. Initialization / Setup

### 2a. Loading the WASM runtime via FilesetResolver

```typescript
import { FilesetResolver } from "@mediapipe/tasks-vision";

const visionFileset = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
);
```

**What `wasmPath` should point to**: A URL to the **directory** containing the WASM files.
Internally, `forVisionTasks()` resolves to a `WasmFileset` object:

```typescript
// What forVisionTasks() produces internally:
{
  wasmLoaderPath: "<wasmPath>/vision_wasm_internal.js",
  wasmBinaryPath: "<wasmPath>/vision_wasm_internal.wasm",
}
```

**Where are the WASM files physically?**

- **CDN**: `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm/`
  - `vision_wasm_internal.js` (loader script)
  - `vision_wasm_internal.wasm` (binary)
  - `vision_wasm_nosimd_internal.js` / `.wasm` (non-SIMD fallback)
- **npm package**: `node_modules/@mediapipe/tasks-vision/wasm/`
  - Same files as above

The package `exports` map also exposes them:
```json
{
  "./vision_wasm_internal.js": "./wasm/vision_wasm_internal.js",
  "./vision_wasm_internal.wasm": "./wasm/vision_wasm_internal.wasm",
  "./vision_wasm_nosimd_internal.js": "./wasm/vision_wasm_nosimd_internal.js",
  "./vision_wasm_nosimd_internal.wasm": "./wasm/vision_wasm_nosimd_internal.wasm"
}
```

### 2b. Creating a FaceDetector

There are **three factory methods**:

```typescript
// Option A: Full options object (recommended)
const faceDetector = await FaceDetector.createFromOptions(visionFileset, {
  baseOptions: {
    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"
  },
  runningMode: "VIDEO", // "IMAGE" or "VIDEO"
  minDetectionConfidence: 0.5,
  minSuppressionThreshold: 0.3,
});

// Option B: Shorthand via model path only (defaults to IMAGE mode)
const faceDetector = await FaceDetector.createFromModelPath(
  visionFileset,
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"
);

// Option C: From a binary buffer
const modelBuffer = await fetch(modelUrl).then(r => r.arrayBuffer());
const faceDetector = await FaceDetector.createFromModelBuffer(
  visionFileset,
  new Uint8Array(modelBuffer)
);
```

### FaceDetectorOptions (complete interface)

```typescript
// From face_detector_options.d.ts
export declare interface FaceDetectorOptions extends VisionTaskOptions {
  /**
   * The minimum confidence score for the face detection to be considered
   * successful. Defaults to 0.5.
   */
  minDetectionConfidence?: number;

  /**
   * The minimum non-maximum-suppression threshold for face detection to be
   * considered overlapped. Defaults to 0.3.
   */
  minSuppressionThreshold?: number;
}

// VisionTaskOptions (inherited) provides:
export type RunningMode = 'IMAGE' | 'VIDEO';

export declare interface VisionTaskOptions extends TaskRunnerOptions {
  /** Canvas element for GPU processing (optional). */
  canvas?: HTMLCanvasElement | OffscreenCanvas;

  /** Running mode. Defaults to "IMAGE". */
  runningMode?: RunningMode;
}

// TaskRunnerOptions provides:
export declare interface TaskRunnerOptions {
  baseOptions?: {
    modelAssetPath?: string;
    modelAssetBuffer?: Uint8Array | ReadableStreamDefaultReader;
    delegate?: "CPU" | "GPU";
  };
}
```

**Recommended options for face DETECTION on video streams:**

| Option | Recommended | Default | Notes |
|--------|------------|---------|-------|
| `runningMode` | `"VIDEO"` | `"IMAGE"` | MUST be VIDEO for `detectForVideo()` |
| `baseOptions.modelAssetPath` | BlazeFace short-range `.tflite` | — | See model URL below |
| `minDetectionConfidence` | `0.5` | `0.5` | Range 0.0–1.0 |
| `minSuppressionThreshold` | `0.3` | `0.3` | IoU threshold for NMS |
| `baseOptions.delegate` | `"CPU"` or `"GPU"` | CPU | GPU needs a canvas |

**Model selection**: The Tasks API does NOT use `model: "short_range"` / `"full_range"` (that was the legacy API). Instead you provide the model file path directly:
- **Short-range** (optimized for faces within ~2m): `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`
- This is the primary model available for the Tasks API Face Detector.

---

## 3. Running Detection on a Video Stream

### detectForVideo() — exact signature

```typescript
// From face_detector.ts (verified source)
detectForVideo(
  videoFrame: ImageSource,    // <video>, <canvas>, ImageData, ImageBitmap, etc.
  timestamp: number,          // timestamp in MILLISECONDS
  imageProcessingOptions?: ImageProcessingOptions  // optional (rotation, ROI)
): FaceDetectorResult         // returns SYNCHRONOUSLY
```

**Critical constraint**: `timestamp` MUST be **monotonically increasing** across
successive calls. If you pass a timestamp that is ≤ the previous timestamp,
the WASM graph will throw an error or silently drop the frame.

```typescript
// CORRECT pattern:
let lastTimestamp = -1;
function onVideoFrame() {
  const now = performance.now();
  // Ensure monotonic increase (performance.now() can repeat at high FPS)
  const timestamp = Math.max(now, lastTimestamp + 1);
  lastTimestamp = timestamp;

  const result = faceDetector.detectForVideo(videoElement, timestamp);
  // process result...
}
```

> **NOTE**: `detectForVideo()` returns synchronously (not a Promise). The call
> blocks until inference completes. This is different from `detectForVideo()`
> with a callback overload that exists on other tasks (FaceLandmarker, etc.).
> For FaceDetector, there is NO callback overload — it always returns the result
> directly.

---

## 4. The Result Object — FaceDetectorResult

### ⚠️ CRITICAL: boundingBox coordinate system

```typescript
// FaceDetectorResult is a re-export of DetectionResult
// face_detector_result.d.ts:
export { DetectionResult as FaceDetectorResult } from '.../detection_result';

// detection_result.d.ts:
export declare interface DetectionResult {
  detections: Detection[];
}

export declare interface Detection {
  categories: Category[];
  boundingBox?: BoundingBox;   // ← PIXEL coordinates, NOT normalized!
  keypoints: NormalizedKeypoint[];  // ← normalized 0..1
}
```

### BoundingBox — IN PIXELS relative to the input frame

```typescript
// bounding_box.d.ts:
/** An integer bounding box, axis aligned. */
export declare interface BoundingBox {
  /** The X coordinate of the top-left corner, IN PIXELS. */
  originX: number;
  /** The Y coordinate of the top-left corner, IN PIXELS. */
  originY: number;
  /** The width of the bounding box, IN PIXELS. */
  width: number;
  /** The height of the bounding box, IN PIXELS. */
  height: number;
  /** Rotation angle in clockwise degrees from horizontal. */
  angle: number;
}
```

> **ANSWER TO KEY QUESTION**: The bounding box format is
> `{ originX, originY, width, height, angle }` where ALL spatial values are in
> **PIXELS relative to the input frame dimensions** (NOT normalized 0..1).
>
> To convert to `{ x, y, width, height }` for your face-tracking adapter:
> ```typescript
> const box = detection.boundingBox;
> const pixelBox = { x: box.originX, y: box.originY, width: box.width, height: box.height };
> ```
> No multiplication by frame dimensions needed — values are already in pixels!

### Category

```typescript
// category.d.ts:
export declare interface Category {
  score: number;        // confidence score 0..1
  index: number;        // category index in label file
  categoryName: string; // label (e.g., "face")
  displayName: string;  // localized display name
}
```

For face detection, `categories[0]` typically contains `{ score: <confidence>, categoryName: "" }`.

### NormalizedKeypoint — normalized 0..1

```typescript
// keypoint.d.ts:
export declare interface NormalizedKeypoint {
  x: number;      // normalized 0..1 (multiply by image width for pixels)
  y: number;      // normalized 0..1 (multiply by image height for pixels)
  label?: string; // e.g., "right_eye", "left_eye", "nose_tip", "mouth", "right_ear", "left_ear"
  score?: number; // keypoint confidence
}
```

> **MIXED coordinate systems**: `boundingBox` is in PIXELS, but `keypoints` are
> NORMALIZED (0..1). To get keypoint pixel coordinates:
> ```typescript
> const kp = detection.keypoints[i];
> const px = kp.x * videoWidth;
> const py = kp.y * videoHeight;
> ```

---

## 5. Lifecycle — Cleanup

```typescript
// From task_runner.ts + vision_task_runner.ts (verified source)

// VisionTaskRunner overrides close():
close(): void {
  this.shaderContext.close();  // releases WebGL shader context
  super.close();
}

// TaskRunner.close():
close(): void {
  this.keepaliveNode = undefined;
  this.logger?.logSessionEnd();
  this.logger?.close();
  this.graphRunner.closeGraph();  // tears down the WASM graph, frees memory
}
```

**Usage**:
```typescript
// When done (e.g., component unmount, tab close):
faceDetector.close();
// That's it. close() releases the WASM graph and all GPU/CPU resources.
// No separate WASM memory deallocation is needed.
```

> `close()` is **synchronous** (returns `void`, not a Promise).
> After calling `close()`, the instance is no longer usable.

---

## 6. Bundling WASM for a Browser Extension (MV3)

### Hosting WASM files locally

1. Copy the WASM files from the npm package into your extension's public assets:
```bash
# From your project root:
mkdir -p extension/assets/wasm
cp node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_internal.js extension/assets/wasm/
cp node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_internal.wasm extension/assets/wasm/
```

2. Point `forVisionTasks` at the local URL (extension-relative):
```typescript
const visionFileset = await FilesetResolver.forVisionTasks(
  chrome.runtime.getURL("assets/wasm")
);
```

3. Declare the WASM files as `web_accessible_resources` in `manifest.json`:
```json
{
  "web_accessible_resources": [{
    "resources": ["assets/wasm/*"],
    "matches": ["<all_urls>"]
  }]
}
```

### CSP considerations for MV3

**Manifest V3 requires `wasm-unsafe-eval`** in the extension's Content-Security-Policy
for WebAssembly to execute. Without it, loading the WASM module will fail.

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
  }
}
```

> `'wasm-unsafe-eval'` is a special CSP keyword (supported since Chrome 96+
> / extension platform) that allows WebAssembly compilation WITHOUT allowing
> general `eval()`. This is the MV3-recommended way to run WASM in extensions.
>
> **Do NOT use `'unsafe-eval'`** — it is disallowed in MV3 `extension_pages`.
> Use `'wasm-unsafe-eval'` instead.

---

## 7. Full Minimal Code Example

```typescript
import { FilesetResolver, FaceDetector } from "@mediapipe/tasks-vision";

// ── Types for your adapter ──
interface PixelBoundingBox {
  x: number;      // top-left X in pixels
  y: number;      // top-left Y in pixels
  width: number;  // width in pixels
  height: number; // height in pixels
}

interface FaceDetectionResult {
  boundingBox: PixelBoundingBox;
  confidence: number;
  keypoints: Array<{ x: number; y: number; label?: string }>;
}

class FaceTrackingAdapter {
  private faceDetector: FaceDetector | null = null;
  private lastTimestamp = -1;
  private video: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  async init() {
    // 1. Load WASM runtime
    const visionFileset = await FilesetResolver.forVisionTasks(
      // For CDN: "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      // For extension: chrome.runtime.getURL("assets/wasm")
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    // 2. Create FaceDetector with VIDEO mode
    this.faceDetector = await FaceDetector.createFromOptions(visionFileset, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
        delegate: "CPU",
      },
      runningMode: "VIDEO",
      minDetectionConfidence: 0.5,
      minSuppressionThreshold: 0.3,
    });
  }

  /**
   * Call this on each requestAnimationFrame or video frame.
   * Returns pixel-coordinate bounding boxes.
   */
  detect(): FaceDetectionResult[] {
    if (!this.faceDetector) return [];

    // Ensure monotonically increasing timestamp
    const now = performance.now();
    const timestamp = now <= this.lastTimestamp ? this.lastTimestamp + 1 : now;
    this.lastTimestamp = timestamp;

    // Run detection — SYNCHRONOUS return
    const result = this.faceDetector.detectForVideo(this.video, timestamp);

    // Parse results → pixel coordinate boxes
    return result.detections.map((d) => {
      // boundingBox is already in PIXELS — just rename fields
      const box = d.boundingBox!;
      return {
        boundingBox: {
          x: box.originX,
          y: box.originY,
          width: box.width,
          height: box.height,
        },
        confidence: d.categories[0]?.score ?? 0,
        // keypoints are NORMALIZED (0..1) — convert to pixels
        keypoints: d.keypoints.map((kp) => ({
          x: kp.x * this.video.videoWidth,
          y: kp.y * this.video.videoHeight,
          label: kp.label,
        })),
      };
    });
  }

  destroy() {
    this.faceDetector?.close();
    this.faceDetector = null;
  }
}

// ── Usage ──
async function main() {
  const video = document.querySelector("video")!;
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  await video.play();

  const adapter = new FaceTrackingAdapter(video);
  await adapter.init();

  function loop() {
    const faces = adapter.detect();
    if (faces.length > 0) {
      console.log("Face at:", faces[0].boundingBox); // {x, y, width, height} in pixels
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
```
