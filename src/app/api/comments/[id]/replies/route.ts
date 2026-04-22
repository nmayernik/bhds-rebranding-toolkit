import { NextResponse, type NextRequest } from "next/server";

import { createId } from "@/lib/comments/id";
import { clientKey, consumeToken } from "@/lib/comments/rateLimit";
import { getStore } from "@/lib/comments/store";
import type { Reply } from "@/lib/comments/types";
import { sanitizeAuthor, sanitizeBody } from "@/lib/comments/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  if (!consumeToken(clientKey(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await params;
  const raw = await req.json().catch(() => null);
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const payload = raw as Record<string, unknown>;

  const author = sanitizeAuthor(payload.author);
  const body = sanitizeBody(payload.body);
  if (!author || !body) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const store = await getStore();
  const found = await store.findById(id);
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const reply: Reply = {
    id: createId(),
    author,
    body,
    createdAt: Date.now(),
  };

  const comments = await store.list(found.path);
  const next = comments.map((c) =>
    c.id === id ? { ...c, replies: [...c.replies, reply] } : c
  );
  await store.save(found.path, next);

  return NextResponse.json({ reply, comment: next.find((c) => c.id === id) });
}
