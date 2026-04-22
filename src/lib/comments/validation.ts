import type { Anchor, AnchorSub } from "./types";

export const MAX_BODY_LENGTH = 2000;
export const MAX_AUTHOR_LENGTH = 200;
export const MAX_ANCHOR_ID_LENGTH = 200;
export const MAX_ANCHOR_LABEL_LENGTH = 200;
export const MAX_ANCHOR_SUB_PATH_LENGTH = 500;

// Only the shapes we generate client-side: tag names, :nth-of-type(n), >, whitespace.
const SUB_PATH_REGEX = /^[A-Za-z][A-Za-z0-9\s:()>_-]*$/;

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

export function sanitizeAnchor(raw: unknown): Anchor | null {
  if (raw == null) return null;
  if (typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const id = typeof obj.id === "string" ? obj.id.trim() : "";
  if (!id || id.length > MAX_ANCHOR_ID_LENGTH) return null;

  const offsetRaw = obj.offset as Record<string, unknown> | undefined;
  const ox = offsetRaw ? sanitizeCoord(offsetRaw.x) : null;
  const oy = offsetRaw ? sanitizeCoord(offsetRaw.y) : null;
  if (ox === null || oy === null) return null;

  let label: string | undefined;
  if (typeof obj.label === "string") {
    const trimmed = obj.label.trim();
    if (trimmed) label = trimmed.slice(0, MAX_ANCHOR_LABEL_LENGTH);
  }

  const sub = sanitizeAnchorSub(obj.sub);

  return { id, label, offset: { x: ox, y: oy }, sub };
}

export function sanitizeAnchorSub(raw: unknown): AnchorSub | null {
  if (raw == null) return null;
  if (typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const path = typeof obj.path === "string" ? obj.path.trim() : "";
  if (!path || path.length > MAX_ANCHOR_SUB_PATH_LENGTH) return null;
  if (!SUB_PATH_REGEX.test(path)) return null;

  let label: string | undefined;
  if (typeof obj.label === "string") {
    const trimmed = obj.label.trim();
    if (trimmed) label = trimmed.slice(0, MAX_ANCHOR_LABEL_LENGTH);
  }

  return { path, label };
}
