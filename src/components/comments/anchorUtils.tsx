"use client";

import { cn } from "@/lib/utils";

export function cssEscape(value: string): string {
  if (typeof window !== "undefined" && typeof window.CSS?.escape === "function") {
    return window.CSS.escape(value);
  }
  return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

export function AnchorOutline({
  anchorId,
  label,
  surface,
  surfaceRect,
  variant = "active",
}: {
  anchorId: string;
  label?: string;
  surface: HTMLElement;
  surfaceRect: DOMRect;
  variant?: "active" | "muted";
}) {
  const el = surface.querySelector<HTMLElement>(
    `[data-comment-anchor="${cssEscape(anchorId)}"]`
  );
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  if (surfaceRect.width === 0 || surfaceRect.height === 0) return null;

  const left = ((rect.left - surfaceRect.left) / surfaceRect.width) * 100;
  const top = ((rect.top - surfaceRect.top) / surfaceRect.height) * 100;
  const width = (rect.width / surfaceRect.width) * 100;
  const height = (rect.height / surfaceRect.height) * 100;

  return (
    <div
      className="pointer-events-none absolute z-20"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
      aria-hidden
    >
      <div
        className={cn(
          "absolute inset-0 rounded-[10px] border-2 border-dashed",
          variant === "active"
            ? "border-fuchsia-500/85 shadow-[0_0_0_3px_rgba(217,70,239,0.14)]"
            : "border-fuchsia-500/50"
        )}
      />
      {label && (
        <span
          className={cn(
            "absolute left-0 top-0 -translate-y-full",
            "inline-flex items-center gap-1 rounded-md bg-fuchsia-500 px-2 py-0.5",
            "text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm",
            "[font-family:var(--font-inter)]"
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
