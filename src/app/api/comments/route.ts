import { NextResponse, type NextRequest } from "next/server";

import { createId } from "@/lib/comments/id";
import { clientKey, consumeToken } from "@/lib/comments/rateLimit";
import { getStore } from "@/lib/comments/store";
import type { Comment } from "@/lib/comments/types";
import {
  sanitizeAnchor,
  sanitizeAuthor,
  sanitizeBody,
  sanitizeCoord,
  sanitizePath,
} from "@/lib/comments/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const path = sanitizePath(req.nextUrl.searchParams.get("path"));
  if (!path) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const store = await getStore();
  const comments = await store.list(path);
  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest) {
  if (!consumeToken(clientKey(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const raw = await req.json().catch(() => null);
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const payload = raw as Record<string, unknown>;

  const path = sanitizePath(payload.path);
  const author = sanitizeAuthor(payload.author);
  const body = sanitizeBody(payload.body);
  const coordsRaw = payload.coords as Record<string, unknown> | undefined;
  const x = coordsRaw ? sanitizeCoord(coordsRaw.x) : null;
  const y = coordsRaw ? sanitizeCoord(coordsRaw.y) : null;
  const anchor = sanitizeAnchor(payload.anchor);

  if (!path || !author || !body || x === null || y === null) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const store = await getStore();
  const existing = await store.list(path);

  const comment: Comment = {
    id: createId(),
    path,
    coords: { x, y },
    anchor,
    author,
    body,
    createdAt: Date.now(),
    resolved: false,
    replies: [],
  };

  await store.save(path, [...existing, comment]);
  return NextResponse.json({ comment }, { status: 201 });
}
