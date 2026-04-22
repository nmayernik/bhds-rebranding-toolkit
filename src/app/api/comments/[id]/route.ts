import { NextResponse, type NextRequest } from "next/server";

import { clientKey, consumeToken } from "@/lib/comments/rateLimit";
import { getStore } from "@/lib/comments/store";
import { sanitizeBody } from "@/lib/comments/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!consumeToken(clientKey(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await params;
  const raw = await req.json().catch(() => null);
  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const payload = raw as Record<string, unknown>;

  const nextBody = payload.body !== undefined ? sanitizeBody(payload.body) : undefined;
  const nextResolved =
    payload.resolved !== undefined ? Boolean(payload.resolved) : undefined;

  if (nextBody === null) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const store = await getStore();
  const found = await store.findById(id);
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const comments = await store.list(found.path);
  const next = comments.map((c) =>
    c.id === id
      ? {
          ...c,
          body: nextBody ?? c.body,
          resolved: nextResolved ?? c.resolved,
        }
      : c
  );
  await store.save(found.path, next);

  const updated = next.find((c) => c.id === id);
  return NextResponse.json({ comment: updated });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!consumeToken(clientKey(req))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await params;
  const store = await getStore();
  const found = await store.findById(id);
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const comments = await store.list(found.path);
  await store.save(
    found.path,
    comments.filter((c) => c.id !== id)
  );
  return NextResponse.json({ ok: true });
}
