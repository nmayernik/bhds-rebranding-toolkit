"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useTheme, type BhdsTheme } from "@/lib/useTheme";

export type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
  className?: string;
  themeOverride?: BhdsTheme;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, themeOverride, ...props },
  ref
) {
  const { theme: contextTheme } = useTheme();
  const theme: BhdsTheme = themeOverride ?? contextTheme;
  const radiusClass = theme === "bhds1" ? "rounded-[8px]" : "rounded-[12px]";

  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      data-theme={theme}
      className={cn(
        "[font-family:var(--bhds-font-family-sans)]",
        "min-h-24 w-full min-w-0 resize-y px-3 py-2 text-(length:--bhds-font-size-sm)",
        radiusClass,
        "bg-(--bhds-color-bg-surface) text-(--bhds-color-text-primary)",
        "border border-neutral-400",
        "placeholder:text-(--bhds-color-text-secondary) placeholder:opacity-60",
        "outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--bhds-focus-ring-color)",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

