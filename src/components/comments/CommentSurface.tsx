"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { Anchor } from "@/lib/comments/types";
import { cn } from "@/lib/utils";
import {
  AnchorOutline,
  resolveAnchorAtPoint,
  resolveAnchorRect,
} from "./anchorUtils";
import { CommentComposer } from "./CommentComposer";
import { CommentPin } from "./CommentPin";
import { useComments } from "./CommentsProvider";

function useSurfaceElement() {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const found = document.querySelector<HTMLElement>("[data-comment-surface]");
    setEl(found);
  }, []);
  return el;
}

type HoverPreview = {
  anchor: Anchor;
  rect: DOMRect;
};

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

  const [tick, setTick] = useState(0);
  const [hoverPreview, setHoverPreview] = useState<HoverPreview | null>(null);
  const rafRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (!commentModeEnabled) setHoverPreview(null);
  }, [commentModeEnabled]);

  if (!surface) return null;

  const handleSurfaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!commentModeEnabled) return;
    const rect = surface.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    const x = Math.max(0, Math.min(1, localX / rect.width));
    const y = Math.max(0, Math.min(1, localY / rect.height));

    const resolved = resolveAnchorAtPoint(surface, e.clientX, e.clientY);

    placeDraft({
      coords: { x, y },
      clientX: localX,
      clientY: localY,
      anchor: resolved?.anchor ?? null,
    });
    setHoverPreview(null);
  };

  const handleSurfaceMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!commentModeEnabled) return;
    if (draft) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const resolved = resolveAnchorAtPoint(surface, clientX, clientY);
      if (!resolved) {
        setHoverPreview(null);
        return;
      }
      setHoverPreview({ anchor: resolved.anchor, rect: resolved.leafRect });
    });
  };

  const handleSurfaceLeave = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHoverPreview(null);
  };

  const surfaceRect = surface.getBoundingClientRect();
  const surfaceWidth = surface.offsetWidth;
  const surfaceHeight = surface.offsetHeight;

  // Re-read on each tick (scroll/resize) so draft anchor follows its element.
  void tick;

  const draftRect =
    draft && draft.anchor ? resolveAnchorRect(surface, draft.anchor) : null;
  const draftPosition = draft
    ? computePinPosition(surfaceRect, draft.anchor, draftRect?.rect, draft.coords)
    : null;

  const hoverLabel =
    hoverPreview?.anchor.sub?.label ?? hoverPreview?.anchor.label;

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
          data-comment-overlay="true"
          onClick={handleSurfaceClick}
          onMouseMove={handleSurfaceMove}
          onMouseLeave={handleSurfaceLeave}
          className={cn(
            "absolute inset-0 z-30 cursor-crosshair",
            "bg-[var(--bhds-color-brand-primary)]/[0.03]"
          )}
          aria-hidden
        />
      )}

      {/* Live hover outline while in placement mode */}
      {commentModeEnabled && !draft && hoverPreview && (
        <AnchorOutline
          rect={hoverPreview.rect}
          surfaceRect={surfaceRect}
          label={hoverLabel}
          variant="hover"
        />
      )}

      {/* Draft outline while composing */}
      {draft && draft.anchor && draftRect && (
        <AnchorOutline
          rect={draftRect.rect}
          surfaceRect={surfaceRect}
          label={draftRect.label}
          variant="active"
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

// Surface-relative percentage position, derived from the anchor's effective
// rect when available so pins track the real DOM through reflow. Falls back
// to the legacy surface coords when no anchor is present.
function computePinPosition(
  surfaceRect: DOMRect,
  anchor: Anchor | null | undefined,
  anchorRect: DOMRect | null | undefined,
  fallback: { x: number; y: number }
): { x: number; y: number } {
  if (!anchor || !anchorRect) return fallback;
  if (surfaceRect.width === 0 || surfaceRect.height === 0) return fallback;

  const pinX = anchorRect.left + anchor.offset.x * anchorRect.width;
  const pinY = anchorRect.top + anchor.offset.y * anchorRect.height;
  return {
    x: (pinX - surfaceRect.left) / surfaceRect.width,
    y: (pinY - surfaceRect.top) / surfaceRect.height,
  };
}
