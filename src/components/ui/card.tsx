"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useTheme, type BhdsTheme } from "@/lib/useTheme";

const cardVariants = cva(
  [
    "group/card flex flex-col overflow-hidden",
    "gap-[var(--bhds-space-4)]",
    "py-[var(--bhds-space-4)]",
    "[color:var(--bhds-color-text-primary)]",
    "[font-size:var(--bhds-font-size-sm)]",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      theme: {
        bhds1: ["rounded-[var(--bhds-radius-card)]"].join(" "),
        bhds2: ["rounded-[var(--bhds-radius-card)]"].join(" "),
      },
      surface: {
        filled: [
          "bg-[var(--bhds-color-bg-surface)]",
          "border border-transparent",
        ].join(" "),
        outline: [
          "bg-transparent",
          "border border-[var(--bhds-color-border-strong)]",
        ].join(" "),
      },
    },
    compoundVariants: [
      // Filled cards carry brand shadows. Outline / service-tile cards stay flat.
      {
        theme: "bhds1",
        surface: "filled",
        class: "[box-shadow:var(--bhds-shadow-sm)]",
      },
      {
        theme: "bhds2",
        surface: "filled",
        class: "[box-shadow:var(--bhds-shadow-md)]",
      },
      // BHDS 2 service tile: more generous internal padding ramp.
      {
        theme: "bhds2",
        surface: "outline",
        class: "gap-[var(--bhds-space-5)] py-[var(--bhds-space-6)]",
      },
    ],
    defaultVariants: {
      theme: "bhds1",
      surface: "filled",
    },
  }
);

type CvaProps = VariantProps<typeof cardVariants>;

export type CardProps = React.ComponentProps<"div"> & {
  surface?: CvaProps["surface"];
  themeOverride?: BhdsTheme;
};

function Card({ className, surface, themeOverride, ...props }: CardProps) {
  const { theme: contextTheme } = useTheme();
  const theme: BhdsTheme = themeOverride ?? contextTheme;
  return (
    <div
      data-slot="card"
      data-theme={theme}
      data-surface={surface ?? "filled"}
      className={cn(cardVariants({ theme, surface }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min items-start gap-[var(--bhds-space-1)] px-[var(--bhds-space-4)]",
        "group-data-[surface=outline]/card:group-data-[theme=bhds2]/card:px-[var(--bhds-space-6)]",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "[font-size:var(--bhds-font-size-lg)]",
        "[line-height:var(--bhds-line-height-snug)]",
        "[color:var(--bhds-color-text-primary)]",
        // BHDS 1 titles: medium. BHDS 2 titles: semibold.
        "group-data-[theme=bhds1]/card:[font-weight:var(--bhds-font-weight-medium)]",
        "group-data-[theme=bhds2]/card:[font-weight:var(--bhds-font-weight-semibold)]",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "[font-size:var(--bhds-font-size-sm)]",
        "[color:var(--bhds-color-text-secondary)]",
        "[line-height:var(--bhds-line-height-normal)]",
        className
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-[var(--bhds-space-4)]",
        "group-data-[surface=outline]/card:group-data-[theme=bhds2]/card:px-[var(--bhds-space-6)]",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center",
        "px-[var(--bhds-space-4)]",
        "pt-[var(--bhds-space-4)]",
        "border-t border-[var(--bhds-color-border-default)]",
        "group-data-[surface=outline]/card:border-t-0 group-data-[surface=outline]/card:pt-0",
        "group-data-[surface=outline]/card:group-data-[theme=bhds2]/card:px-[var(--bhds-space-6)]",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  cardVariants,
};
