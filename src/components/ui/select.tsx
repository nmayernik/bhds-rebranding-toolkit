"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useTheme, type BhdsTheme } from "@/lib/useTheme";

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
  className?: string;
  themeOverride?: BhdsTheme;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, themeOverride, children, ...props },
  ref
) {
  const { theme: contextTheme } = useTheme();
  const theme: BhdsTheme = themeOverride ?? contextTheme;
  const radiusClass = theme === "bhds1" ? "rounded-[8px]" : "rounded-[12px]";

  return (
    <div className="relative w-full min-w-0">
      <select
        ref={ref}
        data-slot="select"
        data-theme={theme}
        className={cn(
          "[font-family:var(--bhds-font-family-sans)]",
          "h-10 w-full min-w-0 appearance-none pl-3 pr-10 text-(length:--bhds-font-size-sm)",
          radiusClass,
          "bg-(--bhds-color-bg-surface) text-(--bhds-color-text-primary)",
          "border border-neutral-400",
          "outline-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--bhds-focus-ring-color)",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-(--bhds-color-text-secondary)"
        fill="currentColor"
      >
        <path d="M5.5 7.5a1 1 0 0 1 1.4 0L10 10.6l3.1-3.1a1 1 0 1 1 1.4 1.4l-3.8 3.8a1 1 0 0 1-1.4 0L5.5 8.9a1 1 0 0 1 0-1.4Z" />
      </svg>
    </div>
  );
});

