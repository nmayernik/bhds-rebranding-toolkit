"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
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
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
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

    placeDraft({
      coords: { x, y },
      clientX: localX,
      clientY: localY,
    });
  };

  const surfaceRect = surface.getBoundingClientRect();
  const surfaceWidth = surface.offsetWidth;
  const surfaceHeight = surface.offsetHeight;

  void tick;
  void surfaceRect;

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

      {draft && (
        <div
          className="absolute z-40"
          style={{
            left: `${draft.coords.x * 100}%`,
            top: `${draft.coords.y * 100}%`,
          }}
        >
          <div className="absolute -translate-x-1/2 -translate-y-full -mt-2">
            <div className="h-6 w-6 rounded-full rounded-bl-sm bg-(--bhds-color-brand-primary) shadow-lg shadow-neutral-900/20 ring-2 ring-white" />
          </div>
          <CommentComposer
            onSubmit={(body) => void submitDraft(body)}
            onCancel={clearDraft}
            surfaceWidth={surfaceWidth}
            anchorX={draft.coords.x}
          />
        </div>
      )}
    </>,
    surface
  );
}
