"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useTheme, type BhdsTheme } from "@/lib/useTheme";

const cardVariants = cva(
  [
    "group/card flex flex-col overflow-hidden",
    "[font-family:var(--bhds-font-family-sans)]",
    "gap-[var(--bhds-space-4)]",
    "py-[var(--bhds-space-4)]",
    "text-[var(--bhds-color-text-primary)]",
    "text-[length:var(--bhds-font-size-sm)]",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-300",
    "[transition-timing-function:var(--bhds-motion-ease-soft)]",
    "motion-reduce:transition-none motion-reduce:transform-none",
    "will-change-transform",
    "hover:-translate-y-1 hover:rotate-[0.15deg] hover:scale-[1.01]",
    "active:translate-y-0 active:rotate-0 active:scale-100",
    "motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:hover:scale-100",
    "motion-reduce:active:translate-y-0 motion-reduce:active:rotate-0 motion-reduce:active:scale-100",
  ].join(" "),
  {
    variants: {
      theme: {
        bhds1: "rounded-[var(--bhds-radius-card)]",
        bhds2: "rounded-[var(--bhds-radius-card)]",
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
      {
        theme: "bhds1",
        surface: "filled",
        class: "shadow-[var(--bhds-shadow-sm)] hover:shadow-[var(--bhds-shadow-md)]",
      },
      {
        theme: "bhds2",
        surface: "filled",
        class: "shadow-[var(--bhds-shadow-md)] hover:shadow-[var(--bhds-shadow-lg)]",
      },
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
        "text-[length:var(--bhds-font-size-lg)] leading-[var(--bhds-line-height-snug)] text-[var(--bhds-color-text-primary)]",
        "group-data-[theme=bhds1]/card:font-medium",
        "group-data-[theme=bhds2]/card:font-semibold",
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
        "text-[length:var(--bhds-font-size-sm)] text-[var(--bhds-color-text-secondary)] leading-[var(--bhds-line-height-normal)]",
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
