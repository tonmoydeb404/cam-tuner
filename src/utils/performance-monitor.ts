/**
 * Performance Monitor Utility
 * Tracks performance metrics and provides insights for optimization
 */

export interface PerformanceMetrics {
  fps: number;
  avgRenderTime: number;
  droppedFrames: number;
  maxRenderTime: number;
  memoryUsage?: number;
  activeStreams: number;
}

export interface PerformanceThresholds {
  maxRenderTime: number; // ms
  minFps: number;
  maxDropRate: number; // percentage
}

export class GlobalPerformanceMonitor {
  private static instance: GlobalPerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private thresholds: PerformanceThresholds = {
    maxRenderTime: 16.67, // 60fps threshold
    minFps: 15,
    maxDropRate: 10
  };
  private listeners: Array<(metrics: PerformanceMetrics, id: string) => void> = [];

  static getInstance(): GlobalPerformanceMonitor {
    if (!GlobalPerformanceMonitor.instance) {
      GlobalPerformanceMonitor.instance = new GlobalPerformanceMonitor();
    }
    return GlobalPerformanceMonitor.instance;
  }

  registerStream(id: string, initialMetrics: PerformanceMetrics): void {
    this.metrics.set(id, initialMetrics);
    this.notifyListeners(initialMetrics, id);
  }

  updateMetrics(id: string, metrics: PerformanceMetrics): void {
    this.metrics.set(id, metrics);
    this.checkThresholds(metrics, id);
    this.notifyListeners(metrics, id);
  }

  removeStream(id: string): void {
    this.metrics.delete(id);
  }

  getAggregateMetrics(): PerformanceMetrics {
    const allMetrics = Array.from(this.metrics.values());
    if (allMetrics.length === 0) {
      return {
        fps: 0,
        avgRenderTime: 0,
        droppedFrames: 0,
        maxRenderTime: 0,
        activeStreams: 0
      };
    }

    return {
      fps: allMetrics.reduce((sum, m) => sum + m.fps, 0) / allMetrics.length,
      avgRenderTime: allMetrics.reduce((sum, m) => sum + m.avgRenderTime, 0) / allMetrics.length,
      droppedFrames: allMetrics.reduce((sum, m) => sum + m.droppedFrames, 0),
      maxRenderTime: Math.max(...allMetrics.map(m => m.maxRenderTime)),
      activeStreams: allMetrics.length,
      memoryUsage: this.getMemoryUsage()
    };
  }

  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      return memInfo.usedJSHeapSize / (1024 * 1024); // MB
    }
    return undefined;
  }

  private checkThresholds(metrics: PerformanceMetrics, id: string): void {
    const issues: string[] = [];

    if (metrics.avgRenderTime > this.thresholds.maxRenderTime) {
      issues.push(`High render time: ${metrics.avgRenderTime.toFixed(2)}ms`);
    }

    if (metrics.fps < this.thresholds.minFps) {
      issues.push(`Low FPS: ${metrics.fps}`);
    }

    const dropRate = (metrics.droppedFrames / (metrics.fps * 60)) * 100; // Assuming 60s window
    if (dropRate > this.thresholds.maxDropRate) {
      issues.push(`High drop rate: ${dropRate.toFixed(1)}%`);
    }

    if (issues.length > 0) {
      console.warn(`[CamTuner] Performance issues detected for stream ${id}:`, issues);
      
      // Auto-optimization suggestions
      this.suggestOptimizations(metrics, id);
    }
  }

  private suggestOptimizations(metrics: PerformanceMetrics, id: string): void {
    const suggestions: string[] = [];

    if (metrics.avgRenderTime > 20) {
      suggestions.push('Consider reducing video resolution or frame rate');
    }

    if (metrics.droppedFrames > 100) {
      suggestions.push('Check for background tab throttling');
    }

    if (metrics.memoryUsage && metrics.memoryUsage > 100) {
      suggestions.push('High memory usage detected, consider restarting the stream');
    }

    if (suggestions.length > 0) {
      console.info(`[CamTuner] Optimization suggestions for stream ${id}:`, suggestions);
    }
  }

  onMetricsUpdate(callback: (metrics: PerformanceMetrics, id: string) => void): void {
    this.listeners.push(callback);
  }

  private notifyListeners(metrics: PerformanceMetrics, id: string): void {
    this.listeners.forEach(listener => {
      try {
        listener(metrics, id);
      } catch (error) {
        console.error('[CamTuner] Error in performance listener:', error);
      }
    });
  }

  setThresholds(newThresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  generateReport(): string {
    const aggregate = this.getAggregateMetrics();
    
    return `
CamTuner Performance Report
===========================
Active Streams: ${aggregate.activeStreams}
Average FPS: ${aggregate.fps.toFixed(1)}
Average Render Time: ${aggregate.avgRenderTime.toFixed(2)}ms
Total Dropped Frames: ${aggregate.droppedFrames}
Peak Render Time: ${aggregate.maxRenderTime.toFixed(2)}ms
${aggregate.memoryUsage ? `Memory Usage: ${aggregate.memoryUsage.toFixed(1)}MB` : ''}

Stream Details:
${Array.from(this.metrics.entries()).map(([id, metrics]) => 
  `  ${id}: ${metrics.fps}fps, ${metrics.avgRenderTime.toFixed(1)}ms avg`
).join('\n')}
    `.trim();
  }
}