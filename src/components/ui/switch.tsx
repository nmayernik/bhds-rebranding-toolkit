"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useTheme, type BhdsTheme } from "@/lib/useTheme";

export type SwitchProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
  className?: string;
  themeOverride?: BhdsTheme;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
};

export function Switch({
  className,
  themeOverride,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  label = "Toggle",
  ...props
}: SwitchProps) {
  const { theme: contextTheme } = useTheme();
  const theme: BhdsTheme = themeOverride ?? contextTheme;
  const onBgClass = theme === "bhds2" ? "bg-(--bhds-color-brand-accent)" : "bg-(--bhds-color-text-link)";

  const [uncontrolled, setUncontrolled] = React.useState<boolean>(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isOn = isControlled ? Boolean(checked) : uncontrolled;

  const setChecked = (next: boolean) => {
    if (!isControlled) setUncontrolled(next);
    onCheckedChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={isOn}
      data-slot="switch"
      data-theme={theme}
      disabled={disabled}
      onClick={() => setChecked(!isOn)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full",
        isOn ? onBgClass : "bg-(--bhds-color-bg-muted)",
        isOn ? "justify-end" : "justify-start",
        "px-0.5",
        "outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--bhds-focus-ring-color)",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block size-5 rounded-full bg-(--bhds-color-bg-surface) shadow-sm"
        )}
      />
    </button>
  );
}

