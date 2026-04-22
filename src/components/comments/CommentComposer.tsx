"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  onSubmit: (body: string) => void;
  onCancel: () => void;
  surfaceWidth: number;
  anchorX: number;
  submitLabel?: string;
  placeholder?: string;
  autoFocus?: boolean;
  variant?: "floating" | "inline";
};

const CARD_WIDTH = 320;

export function CommentComposer({
  onSubmit,
  onCancel,
  surfaceWidth,
  anchorX,
  submitLabel = "Send",
  placeholder = "Leave a comment…",
  autoFocus = true,
  variant = "floating",
}: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const flipLeft =
    variant === "floating" &&
    surfaceWidth > 0 &&
    anchorX * surfaceWidth + CARD_WIDTH > surfaceWidth - 16;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  };

  const floatingClasses = cn(
    "absolute top-2 w-[320px] max-w-[calc(100vw-2rem)]",
    flipLeft ? "right-4 -translate-x-0" : "left-4",
    "rounded-2xl border border-white/10 bg-neutral-900/95 p-3 shadow-xl shadow-neutral-950/40 backdrop-blur-md",
    "[font-family:var(--font-inter)] text-white"
  );

  const inlineClasses = cn(
    "w-full rounded-xl border border-white/10 bg-neutral-900 p-2",
    "[font-family:var(--font-inter)] text-white"
  );

  return (
    <form
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      className={variant === "floating" ? floatingClasses : inlineClasses}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            handleSubmit(e);
          }
          if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
        }}
        placeholder={placeholder}
        rows={3}
        maxLength={2000}
        className={cn(
          "block w-full resize-none rounded-lg border border-white/25 bg-neutral-950/60 px-3 py-2",
          "text-sm text-white placeholder:text-neutral-500",
          "focus:outline-none focus:ring-2 focus:ring-white/30"
        )}
      />
      <div className="mt-2 flex flex-col gap-2">
        <span className="text-[11px] text-neutral-400">
          Esc to cancel · ⌘↵ to send
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-full border border-white/10 px-3 text-xs font-medium text-neutral-300 hover:bg-white/5 hover:text-white"
          >
            <X className="size-3.5" aria-hidden />
            Cancel
          </button>
          <button
            type="submit"
            disabled={!value.trim()}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-full bg-fuchsia-500 px-3 text-xs font-semibold text-white shadow-sm shadow-fuchsia-500/30 disabled:opacity-40 disabled:pointer-events-none hover:bg-fuchsia-400"
          >
            <Send className="size-3.5" aria-hidden />
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
