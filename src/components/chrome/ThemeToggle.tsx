"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";
import { useIsClient } from "@/lib/useIsClient";
import { useTheme } from "@/lib/useTheme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();
  const desc1Id = useId();
  const desc2Id = useId();

  const isBhds2 = isClient && theme === "bhds2";

  const segmentBase =
    "[font-family:var(--bhds-font-family-sans)] relative z-10 flex w-full min-w-0 flex-col items-center justify-center gap-0.5 rounded-full text-center sm:gap-0.5";

  const segmentSize =
    "min-h-[3rem] px-3 py-1.5 sm:min-h-[4.5rem] sm:px-8 sm:py-2.5";

  const activeStyles = "text-(--bhds-color-text-inverse)";

  const inactiveStyles =
    "border-0 bg-transparent shadow-none ring-0 text-(--bhds-color-text-primary) hover:bg-transparent hover:opacity-90";

  return (
    <div
      role="group"
      aria-label="Design system theme"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-4 pt-2 sm:px-4 sm:pb-6 bhds-page-intro bhds-page-intro-delay-2"
    >
      <div className="pointer-events-auto relative grid w-full max-w-3xl grid-cols-2 gap-1 overflow-hidden rounded-full border border-neutral-200/80 bg-white/90 p-1 shadow-lg shadow-neutral-900/10 backdrop-blur-md">
        <div
          aria-hidden="true"
          className={cn(
            // p-1 => inset=0.25rem, gap-1 => 0.25rem.
            // Pill width = (100% - leftInset*2 - gap) / 2 = 50% - 0.375rem
            "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-full bg-(--bhds-color-text-primary) shadow-(--bhds-shadow-sm)",
            // Move by pill width (100%) + the gap (0.25rem)
            isBhds2 ? "translate-x-[calc(100%+0.25rem)]" : "translate-x-0"
          )}
        />
        <div data-theme="bhds1" className="min-w-0">
          <button
            type="button"
            aria-pressed={!isBhds2}
            aria-describedby={desc1Id}
            onClick={() => setTheme("bhds1")}
            className={cn(
              segmentBase,
              segmentSize,
              !isBhds2 ? activeStyles : inactiveStyles
            )}
          >
            <span className="text-xs font-semibold tracking-tight sm:text-base">BHDS 1</span>
            <span
              id={desc1Id}
              className={cn(
                "w-full max-w-none px-0.5 text-[10px] leading-tight sm:px-1 sm:text-xs",
                !isBhds2
                  ? "text-(--bhds-color-text-inverse) opacity-90"
                  : "text-(--bhds-color-text-secondary)"
              )}
            >
              Where we are now
            </span>
          </button>
        </div>
        <div data-theme="bhds2" className="min-w-0">
          <button
            type="button"
            aria-pressed={isBhds2}
            aria-describedby={desc2Id}
            onClick={() => setTheme("bhds2")}
            className={cn(segmentBase, segmentSize, isBhds2 ? activeStyles : inactiveStyles)}
          >
            <span className="text-xs font-semibold tracking-tight sm:text-base">BHDS 2</span>
            <span
              id={desc2Id}
              className={cn(
                "w-full max-w-none px-0.5 text-[10px] leading-tight sm:px-1 sm:text-xs",
                isBhds2
                  ? "text-(--bhds-color-text-inverse) opacity-90"
                  : "text-(--bhds-color-text-secondary)"
              )}
            >
              Where we&apos;re heading
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
