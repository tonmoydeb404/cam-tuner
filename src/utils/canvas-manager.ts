/**
 * Canvas Resource Manager
 * Manages canvas lifecycle, pooling, and cleanup for optimal performance
 */

export interface CanvasResource {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  lastUsed: number;
  inUse: boolean;
}

interface CanvasPoolConfig {
  maxPoolSize: number;
  maxIdleTime: number; // ms
  cleanupInterval: number; // ms
}

export class CanvasManager {
  private static instance: CanvasManager;
  private pool: Map<string, CanvasResource[]> = new Map();
  private cleanupTimer: number | null = null;
  private config: CanvasPoolConfig;

  private constructor(config: Partial<CanvasPoolConfig> = {}) {
    this.config = {
      maxPoolSize: 3,
      maxIdleTime: 30000, // 30 seconds
      cleanupInterval: 15000, // 15 seconds
      ...config
    };

    this.startCleanupTimer();
  }

  static getInstance(config?: Partial<CanvasPoolConfig>): CanvasManager {
    if (!CanvasManager.instance) {
      CanvasManager.instance = new CanvasManager(config);
    }
    return CanvasManager.instance;
  }

  /**
   * Get or create a canvas resource
   */
  getCanvas(width: number, height: number): CanvasResource {
    const key = `${width}x${height}`;
    const poolArray = this.pool.get(key) || [];
    
    // Try to reuse an available canvas
    const available = poolArray.find(resource => !resource.inUse);
    if (available) {
      available.inUse = true;
      available.lastUsed = performance.now();
      return available;
    }

    // Create new canvas if pool not full
    if (poolArray.length < this.config.maxPoolSize) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d', {
        alpha: true,
        desynchronized: true, // Performance optimization
        willReadFrequently: false
      });

      if (!ctx) {
        throw new Error('Failed to get 2D context from canvas');
      }

      const resource: CanvasResource = {
        canvas,
        ctx,
        width,
        height,
        lastUsed: performance.now(),
        inUse: true
      };

      poolArray.push(resource);
      this.pool.set(key, poolArray);
      
      return resource;
    }

    // Pool is full, force reuse oldest canvas
    const oldest = poolArray.reduce((prev, curr) => 
      prev.lastUsed < curr.lastUsed ? prev : curr
    );
    
    oldest.inUse = true;
    oldest.lastUsed = performance.now();
    return oldest;
  }

  /**
   * Release canvas back to pool
   */
  releaseCanvas(resource: CanvasResource): void {
    resource.inUse = false;
    resource.lastUsed = performance.now();
    
    // Clear the canvas for reuse
    resource.ctx.clearRect(0, 0, resource.width, resource.height);
    resource.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transforms
  }

  /**
   * Clean up idle canvas resources
   */
  private cleanup(): void {
    const now = performance.now();
    
    for (const [key, poolArray] of this.pool.entries()) {
      const activeResources = poolArray.filter(resource => {
        const isIdle = !resource.inUse && 
                      (now - resource.lastUsed) > this.config.maxIdleTime;
        return !isIdle;
      });
      
      if (activeResources.length === 0) {
        this.pool.delete(key);
      } else if (activeResources.length !== poolArray.length) {
        this.pool.set(key, activeResources);
      }
    }
  }

  private startCleanupTimer(): void {
    if (this.cleanupTimer) return;
    
    this.cleanupTimer = window.setInterval(
      () => this.cleanup(), 
      this.config.cleanupInterval
    );
  }

  /**
   * Force cleanup of all resources
   */
  dispose(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    this.pool.clear();
  }

  /**
   * Get pool statistics for monitoring
   */
  getStats() {
    const stats = {
      totalPools: this.pool.size,
      totalCanvases: 0,
      inUseCanvases: 0,
      poolDetails: {} as Record<string, { total: number; inUse: number }>
    };

    for (const [key, poolArray] of this.pool.entries()) {
      const inUse = poolArray.filter(r => r.inUse).length;
      stats.totalCanvases += poolArray.length;
      stats.inUseCanvases += inUse;
      stats.poolDetails[key] = {
        total: poolArray.length,
        inUse
      };
    }

    return stats;
  }
}