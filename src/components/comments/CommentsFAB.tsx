"use client";

import { MessageSquarePlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { useComments } from "./CommentsProvider";

export function CommentsFAB() {
  const { commentModeEnabled, toggleMode, unresolvedCount } = useComments();

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex items-center gap-2 sm:bottom-6 sm:right-6"
      role="group"
      aria-label="Comments"
    >
      <button
        type="button"
        onClick={toggleMode}
        aria-label={
          commentModeEnabled ? "Exit comment mode" : "Enter comment mode"
        }
        aria-pressed={commentModeEnabled}
        className={cn(
          "pointer-events-auto relative flex h-14 items-center gap-2 rounded-full pl-4 pr-5",
          "border border-white/10 bg-neutral-900/90 text-white shadow-lg shadow-neutral-950/30 backdrop-blur-md",
          "[font-family:var(--font-inter)] text-sm font-semibold",
          "transition-[transform,background-color,box-shadow] duration-200 [transition-timing-function:var(--bhds-motion-ease-soft)]",
          "hover:scale-[1.03] hover:bg-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bhds-focus-ring-color)]",
          "motion-reduce:transition-none",
          commentModeEnabled &&
            "bg-white text-neutral-900 shadow-xl hover:bg-white"
        )}
      >
        <MessageSquarePlus className="size-5" aria-hidden />
        <span className="hidden sm:inline">
          {commentModeEnabled ? "Click to place" : "Comment"}
        </span>
        {unresolvedCount > 0 && !commentModeEnabled && (
          <span
            aria-label={`${unresolvedCount} unresolved comments`}
            className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-(--bhds-color-brand-primary) px-1.5 text-[10px] font-bold text-(--bhds-color-brand-accent) shadow-md"
          >
            {unresolvedCount > 99 ? "99+" : unresolvedCount}
          </span>
        )}
      </button>
    </div>
  );
}
