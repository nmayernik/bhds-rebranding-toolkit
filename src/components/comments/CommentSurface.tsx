"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { Anchor } from "@/lib/comments/types";
import { cn } from "@/lib/utils";
import { AnchorOutline, cssEscape } from "./anchorUtils";
import { CommentComposer } from "./CommentComposer";
import { CommentPin } from "./CommentPin";
import { useComments } from "./CommentsProvider";

type AnchorResolution = {
  anchor: Anchor;
  rect: DOMRect;
};

function resolveAnchorForPoint(
  root: HTMLElement,
  clientX: number,
  clientY: number
): AnchorResolution | null {
  const stack = document.elementsFromPoint(clientX, clientY);
  for (const node of stack) {
    if (!(node instanceof HTMLElement)) continue;
    if (!root.contains(node)) continue;
    const el = node.closest<HTMLElement>("[data-comment-anchor]");
    if (!el || !root.contains(el)) continue;
    const id = el.dataset.commentAnchor;
    if (!id) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const offsetX = (clientX - rect.left) / rect.width;
    const offsetY = (clientY - rect.top) / rect.height;
    const label = el.dataset.commentAnchorLabel ?? el.getAttribute("aria-label") ?? undefined;
    return {
      anchor: {
        id,
        label,
        offset: {
          x: Math.max(0, Math.min(1, offsetX)),
          y: Math.max(0, Math.min(1, offsetY)),
        },
      },
      rect,
    };
  }
  return null;
}

function useSurfaceElement() {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const found = document.querySelector<HTMLElement>("[data-comment-surface]");
    setEl(found);
  }, []);
  return el;
}

export function CommentSurface() {
  const surface = useSurfaceElement();
  const {
    commentModeEnabled,
    comments,
    draft,
    placeDraft,
    clearDraft,
    submitDraft,
  } = useComments();

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!surface) return;
    const observer = new ResizeObserver(() => setTick((n) => n + 1));
    observer.observe(surface);
    const onScroll = () => setTick((n) => n + 1);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [surface]);

  if (!surface) return null;

  const handleSurfaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!commentModeEnabled) return;
    const rect = surface.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    const x = Math.max(0, Math.min(1, localX / rect.width));
    const y = Math.max(0, Math.min(1, localY / rect.height));

    const resolved = resolveAnchorForPoint(surface, e.clientX, e.clientY);

    placeDraft({
      coords: { x, y },
      clientX: localX,
      clientY: localY,
      anchor: resolved?.anchor ?? null,
    });
  };

  const surfaceRect = surface.getBoundingClientRect();
  const surfaceWidth = surface.offsetWidth;
  const surfaceHeight = surface.offsetHeight;

  // Re-read on each tick (scroll/resize) so draft anchor follows its element.
  void tick;

  const draftPosition = draft
    ? resolvePosition(surface, surfaceRect, draft.anchor, draft.coords)
    : null;

  return createPortal(
    <>
      {comments.map((comment) => (
        <CommentPin
          key={comment.id}
          comment={comment}
          surfaceWidth={surfaceWidth}
          surfaceHeight={surfaceHeight}
        />
      ))}

      {commentModeEnabled && (
        <div
          ref={overlayRef}
          onClick={handleSurfaceClick}
          className={cn(
            "absolute inset-0 z-30 cursor-crosshair",
            "bg-[var(--bhds-color-brand-primary)]/[0.03]"
          )}
          aria-hidden
        />
      )}

      {draft && draft.anchor && (
        <AnchorOutline
          anchorId={draft.anchor.id}
          label={draft.anchor.label}
          surface={surface}
          surfaceRect={surfaceRect}
        />
      )}

      {draft && draftPosition && (
        <div
          className="absolute z-40"
          style={{
            left: `${draftPosition.x * 100}%`,
            top: `${draftPosition.y * 100}%`,
          }}
        >
          <div className="absolute -translate-x-1/2 -translate-y-full -mt-2">
            <div className="h-6 w-6 rounded-full rounded-bl-sm bg-fuchsia-500 shadow-lg shadow-fuchsia-500/40 ring-2 ring-white" />
          </div>
          <CommentComposer
            onSubmit={(body) => void submitDraft(body)}
            onCancel={clearDraft}
            surfaceWidth={surfaceWidth}
            anchorX={draftPosition.x}
          />
        </div>
      )}
    </>,
    surface
  );
}

// Returns a surface-relative percentage position. If an anchor element is
// available, the position is re-derived from its current bounding box so the
// pin tracks the element through reflow. Otherwise falls back to the stored
// surface-relative coords (legacy behavior).
function resolvePosition(
  surface: HTMLElement,
  surfaceRect: DOMRect,
  anchor: Anchor | null | undefined,
  fallback: { x: number; y: number }
): { x: number; y: number } {
  if (!anchor) return fallback;
  const el = surface.querySelector<HTMLElement>(
    `[data-comment-anchor="${cssEscape(anchor.id)}"]`
  );
  if (!el) return fallback;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return fallback;
  if (surfaceRect.width === 0 || surfaceRect.height === 0) return fallback;

  const pinX = rect.left + anchor.offset.x * rect.width;
  const pinY = rect.top + anchor.offset.y * rect.height;
  return {
    x: (pinX - surfaceRect.left) / surfaceRect.width,
    y: (pinY - surfaceRect.top) / surfaceRect.height,
  };
}

