"use client";

import { useMemo, useState } from "react";
import { Check, MessageSquare, RotateCcw, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Comment } from "@/lib/comments/types";
import { useComments } from "./CommentsProvider";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return `hsl(${hue} 70% 45%)`;
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

type FilterMode = "open" | "resolved" | "all";

function scrollToCommentPin(comment: Comment) {
  const surface = document.querySelector<HTMLElement>("[data-comment-surface]");
  if (!surface) return;
  const rect = surface.getBoundingClientRect();
  const pageY =
    rect.top + window.scrollY + comment.coords.y * surface.offsetHeight;
  const targetY = Math.max(0, pageY - window.innerHeight / 2);
  window.scrollTo({ top: targetY, behavior: "smooth" });
}

export function CommentsPanel() {
  const {
    panelOpen,
    setPanelOpen,
    comments,
    setActiveComment,
    activeCommentId,
    resolve,
    remove,
  } = useComments();

  const [filter, setFilter] = useState<FilterMode>("open");

  const filtered = useMemo(() => {
    const list =
      filter === "all"
        ? comments
        : filter === "open"
          ? comments.filter((c) => !c.resolved)
          : comments.filter((c) => c.resolved);
    return [...list].sort((a, b) => b.createdAt - a.createdAt);
  }, [comments, filter]);

  return (
    <>
      <div
        aria-hidden
        onClick={() => setPanelOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-neutral-900/0 transition-colors duration-200",
          panelOpen
            ? "pointer-events-auto bg-neutral-900/10"
            : "pointer-events-none"
        )}
      />
      <aside
        role="dialog"
        aria-label="Comments"
        aria-hidden={!panelOpen}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col",
          "border-l border-neutral-200/80 bg-white/95 shadow-2xl shadow-neutral-900/15 backdrop-blur-md",
          "[font-family:var(--bhds-font-family-sans)]",
          "transition-transform duration-300 [transition-timing-function:var(--bhds-motion-ease-soft)] motion-reduce:transition-none",
          panelOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <header className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-(--bhds-color-text-secondary)" aria-hidden />
            <h2 className="text-sm font-semibold text-(--bhds-color-text-primary)">
              Comments on this page
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            aria-label="Close comments panel"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-(--bhds-color-text-secondary) hover:bg-neutral-100"
          >
            <X className="size-4" aria-hidden />
          </button>
        </header>

        <div className="flex items-center gap-1 border-b border-neutral-200 px-4 py-2">
          {(["open", "resolved", "all"] as FilterMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilter(mode)}
              aria-pressed={filter === mode}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-medium capitalize",
                filter === mode
                  ? "bg-(--bhds-color-text-primary) text-(--bhds-color-text-inverse)"
                  : "text-(--bhds-color-text-secondary) hover:bg-neutral-100"
              )}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
              <MessageSquare className="size-8 text-neutral-300" aria-hidden />
              <p className="text-sm text-(--bhds-color-text-secondary)">
                {filter === "open"
                  ? "No open comments on this page."
                  : filter === "resolved"
                    ? "Nothing resolved yet."
                    : "No comments on this page yet."}
              </p>
              <p className="text-xs text-(--bhds-color-text-secondary)">
                Click the comment button and pick a spot to start.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {filtered.map((comment) => {
                const isActive = activeCommentId === comment.id;
                const accent = colorFor(comment.author);
                return (
                  <li
                    key={comment.id}
                    className={cn(
                      "border-b border-neutral-200 px-4 py-3 transition-colors",
                      isActive
                        ? "bg-(--bhds-color-brand-primary)/10"
                        : "hover:bg-neutral-50"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setActiveComment(comment.id);
                        scrollToCommentPin(comment);
                      }}
                      className="flex w-full items-start gap-2 text-left"
                    >
                      <span
                        aria-hidden
                        style={{ backgroundColor: accent }}
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      >
                        {comment.resolved ? (
                          <Check className="size-3.5" aria-hidden />
                        ) : (
                          initials(comment.author)
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="truncate text-xs font-semibold text-(--bhds-color-text-primary)">
                            {comment.author}
                          </span>
                          <span className="text-[10px] text-(--bhds-color-text-secondary)">
                            {formatRelative(comment.createdAt)}
                          </span>
                        </div>
                        <p className="line-clamp-3 whitespace-pre-wrap break-words text-sm text-(--bhds-color-text-primary)">
                          {comment.body}
                        </p>
                        {comment.replies.length > 0 && (
                          <p className="mt-1 text-[11px] text-(--bhds-color-text-secondary)">
                            {comment.replies.length}{" "}
                            {comment.replies.length === 1 ? "reply" : "replies"}
                          </p>
                        )}
                      </div>
                    </button>
                    <div className="mt-2 flex items-center gap-1 pl-9">
                      <button
                        type="button"
                        onClick={() => void resolve(comment.id, !comment.resolved)}
                        className="inline-flex h-6 items-center gap-1 rounded-full px-2 text-[11px] font-medium text-(--bhds-color-text-secondary) hover:bg-neutral-100"
                      >
                        {comment.resolved ? (
                          <>
                            <RotateCcw className="size-3" aria-hidden />
                            Reopen
                          </>
                        ) : (
                          <>
                            <Check className="size-3" aria-hidden />
                            Resolve
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(comment.id)}
                        className="inline-flex h-6 items-center gap-1 rounded-full px-2 text-[11px] font-medium text-(--bhds-color-text-secondary) hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="size-3" aria-hidden />
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
