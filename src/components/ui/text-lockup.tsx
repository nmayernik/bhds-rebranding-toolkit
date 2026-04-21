"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { BhdsTheme } from "@/lib/useTheme";

export type TextLockupProps = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  theme?: BhdsTheme;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  titleId?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  eyebrowClassName?: string;
  className?: string;
  children?: React.ReactNode;
};

export function TextLockup({
  eyebrow,
  title,
  subtitle,
  theme,
  as = "h2",
  align = "center",
  titleId,
  titleClassName,
  subtitleClassName,
  eyebrowClassName,
  className,
  children,
}: TextLockupProps) {
  const TitleTag = as;

  return (
    <div
      data-slot="text-lockup"
      className={cn(
        "mx-auto flex max-w-3xl flex-col gap-[var(--bhds-space-4)]",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "[font-family:var(--bhds-font-family-sans)] text-(length:--bhds-font-size-sm) uppercase tracking-wider font-semibold",
            theme === "bhds2"
              ? "text-(--bhds-color-brand-accent)"
              : "text-(--bhds-color-brand-primary)",
            eyebrowClassName
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <TitleTag className={cn(titleClassName)} id={titleId}>
        {title}
      </TitleTag>

      {subtitle ? <p className={cn(subtitleClassName)}>{subtitle}</p> : null}
      {children}
    </div>
  );
}

