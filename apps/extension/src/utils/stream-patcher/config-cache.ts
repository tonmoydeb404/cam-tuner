export class ConfigCache {
  private cache = new Map<string, any>();

  get<T>(key: string, factory: () => T): T {
    if (!this.cache.has(key)) {
      this.cache.set(key, factory());
    }
    return this.cache.get(key);
  }

  invalidate(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  size(): number {
    return this.cache.size;
  }
}

export function normalizeFilterValue(value?: number): number {
  if (typeof value !== "number") return 1;
  return Math.max(0, value) / 100;
}