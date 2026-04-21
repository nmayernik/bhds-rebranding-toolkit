"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useTheme, type BhdsTheme } from "@/lib/useTheme";

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> & {
  className?: string;
  themeOverride?: BhdsTheme;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, themeOverride, type = "text", ...props },
  ref
) {
  const { theme: contextTheme } = useTheme();
  const theme: BhdsTheme = themeOverride ?? contextTheme;
  const radiusClass = theme === "bhds1" ? "rounded-[8px]" : "rounded-[12px]";

  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      data-theme={theme}
      className={cn(
        "[font-family:var(--bhds-font-family-sans)]",
        "h-10 w-full min-w-0 px-3 text-(length:--bhds-font-size-sm)",
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

