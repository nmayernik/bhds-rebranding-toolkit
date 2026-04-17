"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useTheme, type BhdsTheme } from "@/lib/useTheme";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none",
    "transition-colors outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    "focus-visible:[outline-color:var(--bhds-focus-ring-color)]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      theme: {
        bhds1: [
          "rounded-[var(--bhds-radius-button)]",
          "[font-weight:var(--bhds-font-weight-medium)]",
        ].join(" "),
        bhds2: [
          "rounded-[var(--bhds-radius-button)]",
          "[font-weight:var(--bhds-font-weight-semibold)]",
          "tracking-wide",
        ].join(" "),
      },
      intent: {
        primary: [
          "bg-[var(--bhds-color-brand-primary)]",
          "text-[var(--bhds-color-text-inverse)]",
          "hover:bg-[var(--bhds-color-brand-primary-hover)]",
          "active:bg-[var(--bhds-color-brand-primary-active)]",
        ].join(" "),
        secondary: [
          "bg-transparent",
          "text-[var(--bhds-color-brand-primary)]",
          "border border-[var(--bhds-color-brand-primary)]",
          "hover:bg-[var(--bhds-color-bg-muted)]",
        ].join(" "),
      },
      size: {
        md: [
          "h-[var(--bhds-space-10)]",
          "px-[var(--bhds-space-4)]",
          "[font-size:var(--bhds-font-size-sm)]",
          "gap-[var(--bhds-space-2)]",
        ].join(" "),
        lg: [
          "h-[var(--bhds-space-12)]",
          "px-[var(--bhds-space-6)]",
          "[font-size:var(--bhds-font-size-md)]",
          "gap-[var(--bhds-space-2)]",
        ].join(" "),
      },
    },
    // BHDS 2 has a more generous horizontal padding ramp than BHDS 1.
    compoundVariants: [
      { theme: "bhds2", size: "md", class: "px-[var(--bhds-space-5)]" },
      { theme: "bhds2", size: "lg", class: "px-[var(--bhds-space-8)]" },
    ],
    defaultVariants: {
      theme: "bhds1",
      intent: "primary",
      size: "md",
    },
  }
);

type CvaProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = Omit<ButtonPrimitive.Props, "className"> & {
  className?: string;
  intent?: CvaProps["intent"];
  size?: CvaProps["size"];
  themeOverride?: BhdsTheme;
};

function Button({
  className,
  intent,
  size,
  themeOverride,
  ...props
}: ButtonProps) {
  const { theme: contextTheme } = useTheme();
  const theme: BhdsTheme = themeOverride ?? contextTheme;
  return (
    <ButtonPrimitive
      data-slot="button"
      data-theme={theme}
      className={cn(buttonVariants({ theme, intent, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
