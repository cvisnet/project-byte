import "server-only";

import { LRUCache } from "lru-cache";

type Bucket = { count: number; resetAt: number };

const cache = new LRUCache<string, Bucket>({
  max: 5000,
  ttl: 60 * 60 * 1000,
});

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = cache.get(key);

  if (!existing || existing.resetAt <= now) {
    const bucket: Bucket = { count: 1, resetAt: now + windowMs };
    cache.set(key, bucket, { ttl: windowMs });
    return { ok: true, remaining: limit - 1, resetAt: bucket.resetAt };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}
