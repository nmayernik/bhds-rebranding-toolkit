"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, CornerDownRight, RotateCcw, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Comment } from "@/lib/comments/types";
import { AnchorOutline, resolveAnchorRect } from "./anchorUtils";
import { CommentComposer } from "./CommentComposer";
import { useComments } from "./CommentsProvider";

type Props = {
  comment: Comment;
  surfaceWidth: number;
  surfaceHeight: number;
};

const HOVER_HIDE_DELAY_MS = 180;
const HOVER_SHOW_DELAY_MS = 60;

type Resolved = {
  position: { x: number; y: number };
  rect: DOMRect | null;
  label?: string;
};

function useResolvedAnchor(
  comment: Comment,
  surfaceWidth: number,
  surfaceHeight: number
): Resolved {
  const anchorId = comment.anchor?.id;

  const [, setTick] = useState(0);
  useEffect(() => {
    if (!anchorId) return;
    const bump = () => setTick((n) => n + 1);
    window.addEventListener("scroll", bump, { passive: true });
    window.addEventListener("resize", bump);
    return () => {
      window.removeEventListener("scroll", bump);
      window.removeEventListener("resize", bump);
    };
  }, [anchorId]);
  void surfaceWidth;
  void surfaceHeight;

  if (!comment.anchor) {
    return { position: comment.coords, rect: null };
  }
  if (typeof document === "undefined") {
    return { position: comment.coords, rect: null };
  }

  const surface = document.querySelector<HTMLElement>("[data-comment-surface]");
  if (!surface) return { position: comment.coords, rect: null };

  const resolved = resolveAnchorRect(surface, comment.anchor);
  if (!resolved) return { position: comment.coords, rect: null };

  const surfaceRect = surface.getBoundingClientRect();
  if (surfaceRect.width === 0 || surfaceRect.height === 0) {
    return { position: comment.coords, rect: resolved.rect, label: resolved.label };
  }

  const pinX = resolved.rect.left + comment.anchor.offset.x * resolved.rect.width;
  const pinY = resolved.rect.top + comment.anchor.offset.y * resolved.rect.height;
  return {
    position: {
      x: (pinX - surfaceRect.left) / surfaceRect.width,
      y: (pinY - surfaceRect.top) / surfaceRect.height,
    },
    rect: resolved.rect,
    label: resolved.label,
  };
}

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

export function CommentPin({ comment, surfaceWidth, surfaceHeight }: Props) {
  const { activeCommentId, setActiveComment, addReply, resolve, remove, commentModeEnabled } =
    useComments();
  const [replyingValue, setReplyingValue] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const hideTimerRef = useRef<number | null>(null);
  const showTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const scheduleShow = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (showTimerRef.current !== null) return;
    showTimerRef.current = window.setTimeout(() => {
      showTimerRef.current = null;
      setPreviewOpen(true);
    }, HOVER_SHOW_DELAY_MS);
  }, []);

  const scheduleHide = useCallback(() => {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current !== null) return;
    hideTimerRef.current = window.setTimeout(() => {
      hideTimerRef.current = null;
      setPreviewOpen(false);
    }, HOVER_HIDE_DELAY_MS);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const isActive = activeCommentId === comment.id;
  const isOpen = isActive || previewOpen;
  const resolved = useResolvedAnchor(comment, surfaceWidth, surfaceHeight);

  useEffect(() => {
    if (!isActive) return;
    const onClick = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (cardRef.current.contains(target)) return;
      if (
        target instanceof Element &&
        target.closest('[data-comments-modal="true"]')
      ) {
        return;
      }
      setActiveComment(null);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [isActive, setActiveComment]);

  // Close preview if the user clicks anywhere outside the pin/card.
  useEffect(() => {
    if (!previewOpen) return;
    const onDown = () => {
      if (!isActive) setPreviewOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [previewOpen, isActive]);

  const accent = useMemo(() => colorFor(comment.author), [comment.author]);
  const flipLeft =
    surfaceWidth > 0 && resolved.position.x * surfaceWidth + 320 > surfaceWidth - 16;

  const surfaceEl =
    typeof document === "undefined"
      ? null
      : document.querySelector<HTMLElement>("[data-comment-surface]");
  const surfaceRect = surfaceEl?.getBoundingClientRect() ?? null;
  const showOutline =
    Boolean(comment.anchor) && Boolean(resolved.rect) && (isActive || previewOpen);

  return (
    <>
      {showOutline && resolved.rect && surfaceRect && (
        <AnchorOutline
          rect={resolved.rect}
          surfaceRect={surfaceRect}
          label={resolved.label}
          variant={isActive ? "active" : "muted"}
        />
      )}
      <div
        className="absolute z-30"
        style={{
          left: `${resolved.position.x * 100}%`,
          top: `${resolved.position.y * 100}%`,
        }}
        onMouseEnter={scheduleShow}
        onMouseLeave={scheduleHide}
      >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          clearTimers();
          setPreviewOpen(false);
          setActiveComment(isActive ? null : comment.id);
        }}
        aria-label={`Comment by ${comment.author}`}
        className={cn(
          "relative -translate-x-1/2 -translate-y-full inline-flex h-8 w-8 items-center justify-center rounded-full rounded-bl-sm",
          "text-[11px] font-bold text-white shadow-lg shadow-neutral-900/20 ring-2 ring-white",
          "transition-transform duration-150 [transition-timing-function:var(--bhds-motion-ease-soft)]",
          "hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bhds-focus-ring-color)]",
          isActive && "scale-110",
          comment.resolved && "opacity-60",
          commentModeEnabled && !isActive && "opacity-70"
        )}
        style={{ backgroundColor: accent }}
      >
        {comment.resolved ? (
          <Check className="size-3.5" aria-hidden />
        ) : (
          initials(comment.author)
        )}
      </button>

      {isOpen && (
        <div
          ref={cardRef}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={scheduleShow}
          onMouseLeave={scheduleHide}
          className={cn(
            "absolute top-2 w-[320px] max-w-[calc(100vw-2rem)]",
            flipLeft ? "right-4" : "left-4",
            "rounded-2xl border border-white/10 bg-neutral-900/95 p-3 shadow-xl shadow-neutral-950/40 backdrop-blur-md",
            "[font-family:var(--font-inter)] text-white",
            !isActive && "pointer-events-auto"
          )}
        >
          <Thread comment={comment} accent={accent} />

          {isActive && (
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/10 pt-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => void resolve(comment.id, !comment.resolved)}
                  className="inline-flex h-7 items-center gap-1 rounded-full px-2 text-[11px] font-medium text-neutral-400 hover:bg-white/5 hover:text-white"
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
                  className="inline-flex h-7 items-center gap-1 rounded-full px-2 text-[11px] font-medium text-neutral-400 hover:bg-red-500/15 hover:text-red-400"
                >
                  <Trash2 className="size-3" aria-hidden />
                  Delete
                </button>
              </div>
              {!replyingValue && (
                <button
                  type="button"
                  onClick={() => setReplyingValue(true)}
                  className="inline-flex h-7 items-center gap-1 rounded-full bg-white px-2.5 text-[11px] font-semibold text-neutral-900 hover:bg-neutral-100"
                >
                  <CornerDownRight className="size-3" aria-hidden />
                  Reply
                </button>
              )}
            </div>
          )}

          {isActive && replyingValue && (
            <div className="mt-2">
              <CommentComposer
                onSubmit={(body) => {
                  void addReply(comment.id, body);
                  setReplyingValue(false);
                }}
                onCancel={() => setReplyingValue(false)}
                surfaceWidth={0}
                anchorX={0}
                submitLabel="Reply"
                placeholder="Write a reply…"
                variant="inline"
              />
            </div>
          )}

          {!isActive && (
            <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] uppercase tracking-wide text-neutral-500">
              <span>Click to reply or resolve</span>
            </div>
          )}
        </div>
      )}
      </div>
    </>
  );
}

function Thread({ comment, accent }: { comment: Comment; accent: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Entry
        author={comment.author}
        body={comment.body}
        createdAt={comment.createdAt}
        accent={accent}
      />
      {comment.replies.map((r) => (
        <Entry
          key={r.id}
          author={r.author}
          body={r.body}
          createdAt={r.createdAt}
          accent={colorFor(r.author)}
          indented
        />
      ))}
    </div>
  );
}

function Entry({
  author,
  body,
  createdAt,
  accent,
  indented = false,
}: {
  author: string;
  body: string;
  createdAt: number;
  accent: string;
  indented?: boolean;
}) {
  return (
    <div className={cn("flex items-start gap-2", indented && "pl-6")}>
      <div
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ backgroundColor: accent }}
        aria-hidden
      >
        {initials(author)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-xs font-semibold text-white">
            {author}
          </span>
          <span className="text-[10px] text-neutral-400">
            {formatRelative(createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap break-words text-sm text-neutral-100">
          {body}
        </p>
      </div>
    </div>
  );
}
