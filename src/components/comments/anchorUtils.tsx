"use client";

import type { Anchor, AnchorSub } from "@/lib/comments/types";
import { cn } from "@/lib/utils";

export function cssEscape(value: string): string {
  if (typeof window !== "undefined" && typeof window.CSS?.escape === "function") {
    return window.CSS.escape(value);
  }
  return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

// Build a structural CSS selector between two ancestor/descendant elements,
// using tag names + :nth-of-type so it survives class changes.
function buildSubPath(from: HTMLElement, to: HTMLElement): string | null {
  if (from === to) return null;
  if (!from.contains(to)) return null;

  const parts: string[] = [];
  let node: HTMLElement = to;
  while (node !== from) {
    const parent = node.parentElement;
    if (!parent) return null;
    const tag = node.tagName.toLowerCase();
    let index = 0;
    let count = 0;
    for (const sib of Array.from(parent.children)) {
      if (sib.tagName === node.tagName) {
        count += 1;
        if (sib === node) index = count;
      }
    }
    if (index === 0) return null;
    parts.unshift(`${tag}:nth-of-type(${index})`);
    node = parent;
  }
  return parts.length > 0 ? parts.join(" > ") : null;
}

function deriveSubLabel(el: HTMLElement): string | undefined {
  const aria = el.getAttribute("aria-label");
  if (aria) return aria.trim().slice(0, 60) || undefined;
  const text = (el.textContent ?? "").trim().replace(/\s+/g, " ");
  if (text) return text.slice(0, 60);
  return el.tagName.toLowerCase();
}

function findLeafAtPoint(
  surface: HTMLElement,
  clientX: number,
  clientY: number
): HTMLElement | null {
  const stack = document.elementsFromPoint(clientX, clientY);
  for (const node of stack) {
    if (!(node instanceof HTMLElement)) continue;
    if (!surface.contains(node)) continue;
    if (node === surface) continue;
    if (node.dataset.commentOverlay === "true") continue;
    if (node.closest('[data-comments-modal="true"]')) continue;
    return node;
  }
  return null;
}

export type ResolvedAnchor = {
  anchor: Anchor;
  primary: HTMLElement;
  leaf: HTMLElement;
  leafRect: DOMRect;
};

// Resolves the anchor for a point on screen. Picks the topmost leaf element
// inside `surface`, then walks up to its nearest [data-comment-anchor] ancestor
// as the primary scope. If the leaf is deeper than the primary, records a
// structural sub-selector so the pin can target the leaf specifically.
export function resolveAnchorAtPoint(
  surface: HTMLElement,
  clientX: number,
  clientY: number
): ResolvedAnchor | null {
  const leaf = findLeafAtPoint(surface, clientX, clientY);
  if (!leaf) return null;
  const primary = leaf.closest<HTMLElement>("[data-comment-anchor]");
  if (!primary || !surface.contains(primary)) return null;
  const id = primary.dataset.commentAnchor;
  if (!id) return null;

  const primaryLabel =
    primary.dataset.commentAnchorLabel ??
    primary.getAttribute("aria-label") ??
    undefined;

  let sub: AnchorSub | null = null;
  let leafEl: HTMLElement = primary;
  if (leaf !== primary) {
    const path = buildSubPath(primary, leaf);
    if (path) {
      sub = { path, label: deriveSubLabel(leaf) };
      leafEl = leaf;
    }
  }

  const leafRect = leafEl.getBoundingClientRect();
  if (leafRect.width === 0 || leafRect.height === 0) return null;

  const offsetX = (clientX - leafRect.left) / leafRect.width;
  const offsetY = (clientY - leafRect.top) / leafRect.height;

  return {
    anchor: {
      id,
      label: primaryLabel,
      offset: {
        x: Math.max(0, Math.min(1, offsetX)),
        y: Math.max(0, Math.min(1, offsetY)),
      },
      sub,
    },
    primary,
    leaf: leafEl,
    leafRect,
  };
}

// Returns the effective rect for an anchor: the sub element's rect when the
// sub selector resolves, otherwise the primary anchor's rect. Also returns the
// most specific label for display.
export function resolveAnchorRect(
  surface: HTMLElement,
  anchor: Anchor
): { rect: DOMRect; label?: string } | null {
  const primary = surface.querySelector<HTMLElement>(
    `[data-comment-anchor="${cssEscape(anchor.id)}"]`
  );
  if (!primary) return null;

  if (anchor.sub?.path) {
    const subEl = primary.querySelector<HTMLElement>(anchor.sub.path);
    if (subEl) {
      const rect = subEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return { rect, label: anchor.sub.label ?? anchor.label };
      }
    }
  }

  const rect = primary.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  return { rect, label: anchor.label };
}

type OutlineVariant = "active" | "muted" | "hover";

const VARIANT_CLASS: Record<OutlineVariant, string> = {
  active:
    "border-fuchsia-500/85 shadow-[0_0_0_3px_rgba(217,70,239,0.14)]",
  muted: "border-fuchsia-500/50",
  hover:
    "border-fuchsia-500/75 shadow-[0_0_0_3px_rgba(217,70,239,0.10)]",
};

// Draws a dashed fuchsia outline + label around a given absolute-viewport rect,
// positioned relative to the surface. Callers compute the rect so we can reuse
// this for drafts, active pins, hover previews, and sub-element targeting.
export function AnchorOutline({
  rect,
  surfaceRect,
  label,
  variant = "active",
}: {
  rect: DOMRect;
  surfaceRect: DOMRect;
  label?: string;
  variant?: OutlineVariant;
}) {
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
          "absolute inset-0 rounded-[10px] border-2 border-dashed transition-opacity duration-75",
          VARIANT_CLASS[variant]
        )}
      />
      {label && (
        <span
          className={cn(
            "absolute left-0 top-0 -translate-y-full",
            "inline-flex max-w-[280px] items-center gap-1 truncate rounded-md bg-fuchsia-500 px-2 py-0.5",
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
