"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useComments } from "./CommentsProvider";

export function AuthorPrompt() {
  const { pendingAuthor } = useComments();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (pendingAuthor) {
      setValue("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [pendingAuthor]);

  if (!pendingAuthor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pendingAuthor.onConfirm(value);
  };

  const handleCancel = () => {
    pendingAuthor.onConfirm("");
  };

  const title =
    pendingAuthor.reason === "reply"
      ? "Reply as"
      : "Comment as";

  return (
    <div
      role="dialog"
      aria-label="Enter your name"
      aria-modal="true"
      data-comments-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-950/60 p-4 [font-family:var(--font-inter)]"
      onClick={handleCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-5 text-white shadow-2xl shadow-neutral-950/50"
        )}
      >
        <h2 className="text-base font-semibold text-white">
          {title}
        </h2>
        <p className="mt-1 text-xs text-neutral-400">
          Your name is stored on this device so teammates can see who commented.
        </p>
        <label className="mt-4 block">
          <span className="block text-[11px] font-medium text-neutral-400">
            Display name
          </span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={200}
            placeholder="e.g. Alex Rivera"
            className="mt-1 block w-full rounded-lg border border-white/10 bg-neutral-950/60 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </label>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex h-8 items-center rounded-full px-3 text-xs font-medium text-neutral-400 hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!value.trim()}
            className="inline-flex h-8 items-center rounded-full bg-white px-3 text-xs font-semibold text-neutral-900 shadow-sm hover:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
