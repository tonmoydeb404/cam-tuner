export interface PersonSegmenter {
  segment(
    source: CanvasImageSource,
    width: number,
    height: number
  ): Promise<Float32Array | null>
  isReady(): boolean
  destroy(): void
}
