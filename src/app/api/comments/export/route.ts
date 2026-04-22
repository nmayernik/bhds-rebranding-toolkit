import { NextResponse, type NextRequest } from "next/server";

import { getStore } from "@/lib/comments/store";
import type { Comment } from "@/lib/comments/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Token-gated dump of every comment across every path. Used by the archive
// GitHub Action to snapshot the canonical history into the repo. Returns a
// stable, sorted shape so git diffs are minimal between snapshots.
export async function GET(req: NextRequest) {
  const token = process.env.ARCHIVE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Archive token not configured" },
      { status: 503 }
    );
  }

  const auth = req.headers.get("authorization") ?? "";
  const provided = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!provided || provided !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = await getStore();
  const raw = await store.listAll();

  const paths = Object.keys(raw).sort();
  const commentsByPath: Record<string, Comment[]> = {};
  let totalComments = 0;
  let totalReplies = 0;
  let totalUnresolved = 0;

  for (const path of paths) {
    const list = [...raw[path]].sort((a, b) => a.createdAt - b.createdAt);
    for (const c of list) {
      totalComments += 1;
      if (!c.resolved) totalUnresolved += 1;
      totalReplies += c.replies.length;
    }
    commentsByPath[path] = list;
  }

  const body = {
    snapshotAt: new Date().toISOString(),
    totals: {
      paths: paths.length,
      comments: totalComments,
      replies: totalReplies,
      unresolved: totalUnresolved,
    },
    commentsByPath,
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
