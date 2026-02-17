interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimiter {
  check(identifier: string): { allowed: boolean };
  reset(identifier: string): void;
}

export function createRateLimiter(
  name: string,
  maxAttempts: number,
  windowMs: number
): RateLimiter {
  const store = new Map<string, RateLimitEntry>();

  // Clean up stale entries every 5 minutes
  const CLEANUP_INTERVAL = 5 * 60 * 1000;
  let lastCleanup = Date.now();

  function cleanup(): void {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;
    for (const [key, entry] of store) {
      if (now > entry.resetTime) {
        store.delete(key);
      }
    }
  }

  return {
    check(identifier: string): { allowed: boolean } {
      cleanup();
      const now = Date.now();
      const entry = store.get(identifier);

      if (!entry || now > entry.resetTime) {
        store.set(identifier, { count: 1, resetTime: now + windowMs });
        return { allowed: true };
      }

      entry.count++;
      if (entry.count > maxAttempts) {
        return { allowed: false };
      }

      return { allowed: true };
    },

    reset(identifier: string): void {
      store.delete(identifier);
    },
  };
}
