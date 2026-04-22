export const MAX_BODY_LENGTH = 2000;
export const MAX_AUTHOR_LENGTH = 200;

export function sanitizeBody(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > MAX_BODY_LENGTH) return null;
  return trimmed;
}

export function sanitizeAuthor(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > MAX_AUTHOR_LENGTH) return null;
  return trimmed;
}

export function sanitizePath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  if (!raw.startsWith("/")) return null;
  if (raw.length > 500) return null;
  return raw;
}

export function sanitizeCoord(raw: unknown): number | null {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return null;
  if (n < 0 || n > 1) return null;
  return n;
}
