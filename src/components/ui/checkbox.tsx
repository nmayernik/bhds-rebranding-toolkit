"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useTheme, type BhdsTheme } from "@/lib/useTheme";

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "className"> & {
  className?: string;
  themeOverride?: BhdsTheme;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, themeOverride, ...props },
  ref
) {
  const { theme: contextTheme } = useTheme();
  const theme: BhdsTheme = themeOverride ?? contextTheme;

  return (
    <input
      ref={ref}
      type="checkbox"
      data-slot="checkbox"
      data-theme={theme}
      className={cn(
        "size-4 rounded-(--bhds-radius-sm) border border-neutral-400 bg-(--bhds-color-bg-surface)",
        "accent-(--bhds-color-brand-accent)",
        "outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--bhds-focus-ring-color)",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

