"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useTheme, type BhdsTheme } from "@/lib/useTheme";

export type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "className"> & {
  className?: string;
  themeOverride?: BhdsTheme;
};

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { className, themeOverride, ...props },
  ref
) {
  const { theme: contextTheme } = useTheme();
  const theme: BhdsTheme = themeOverride ?? contextTheme;

  return (
    <input
      ref={ref}
      type="radio"
      data-slot="radio"
      data-theme={theme}
      className={cn(
        "size-4 appearance-none rounded-full border border-neutral-400 bg-(--bhds-color-bg-surface)",
        "checked:border-transparent checked:bg-(--bhds-color-brand-accent)",
        "checked:bg-[radial-gradient(circle,white_0_36%,transparent_37%)] checked:bg-center checked:bg-no-repeat",
        "outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--bhds-focus-ring-color)",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

