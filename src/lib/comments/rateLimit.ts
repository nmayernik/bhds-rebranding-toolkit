type Bucket = {
  tokens: number;
  updatedAt: number;
};

const BUCKETS = new Map<string, Bucket>();

const CAPACITY = 10;
const REFILL_PER_MS = 10 / 60_000;

export function consumeToken(key: string): boolean {
  const now = Date.now();
  const bucket = BUCKETS.get(key) ?? { tokens: CAPACITY, updatedAt: now };

  const elapsed = now - bucket.updatedAt;
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsed * REFILL_PER_MS);
  bucket.updatedAt = now;

  if (bucket.tokens < 1) {
    BUCKETS.set(key, bucket);
    return false;
  }

  bucket.tokens -= 1;
  BUCKETS.set(key, bucket);
  return true;
}

export function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const real = req.headers.get("x-real-ip");
  const ip = (forwarded?.split(",")[0] ?? real ?? "unknown").trim();
  return `ip:${ip}`;
}
