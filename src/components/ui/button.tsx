"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useTheme, type BhdsTheme } from "@/lib/useTheme";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none",
    "[font-family:var(--bhds-font-family-sans)]",
    "outline-none",
    "transition-[box-shadow,background-color,color,border-color] duration-200",
    "[transition-timing-function:var(--bhds-motion-ease-soft)]",
    "motion-reduce:transition-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-2 focus-visible:outline-offset-2",
    "focus-visible:outline-[var(--bhds-focus-ring-color)]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      theme: {
        bhds1: "rounded-[var(--bhds-radius-button)] font-medium",
        bhds2: "rounded-[var(--bhds-radius-button)] font-semibold tracking-wide",
      },
      intent: {
        primary: [
          "bg-[var(--bhds-color-brand-primary)]",
          "text-[var(--bhds-color-brand-accent)]",
          "hover:bg-[var(--bhds-color-brand-primary-hover)]",
          "active:bg-[var(--bhds-color-brand-primary-active)]",
        ].join(" "),
        secondary: [
          "bg-transparent",
          "text-[var(--bhds-color-brand-accent)]",
          "border",
        ].join(" "),
      },
      size: {
        md: [
          "h-[var(--bhds-space-10)]",
          "px-[var(--bhds-space-4)]",
          "text-[length:var(--bhds-font-size-sm)]",
          "gap-[var(--bhds-space-2)]",
        ].join(" "),
        lg: [
          "h-[var(--bhds-space-12)]",
          "px-[var(--bhds-space-6)]",
          "text-[length:var(--bhds-font-size-md)]",
          "gap-[var(--bhds-space-2)]",
        ].join(" "),
      },
    },
    compoundVariants: [
      {
        theme: "bhds1",
        intent: "secondary",
        class:
          "border-[var(--bhds-color-border-strong)] shadow-[var(--bhds-shadow-sm)] hover:bg-[var(--bhds-color-bg-muted)]",
      },
      {
        theme: "bhds2",
        intent: "secondary",
        class:
          "border-[var(--bhds-color-brand-accent)] hover:bg-[var(--bhds-color-secondary-button-hover-bg)]",
      },
      {
        intent: "primary",
        class: "shadow-[var(--bhds-shadow-sm)] hover:shadow-[var(--bhds-shadow-md)]",
      },
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
