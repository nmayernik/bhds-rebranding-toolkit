"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useTheme, type BhdsTheme } from "@/lib/useTheme";

type LogoVariant = "horizontal" | "stacked" | "icon";
type LogoTone = "blue" | "white";

type LogoAsset = {
  src: string;
  width: number;
  height: number;
};

// All marks are BHDS 2 assets. Color is applied via CSS mask +
// `currentColor`, so any theme can recolor them without shipping
// per-theme variants. The blue tone resolves to the active theme's
// brand-accent token (bhds1 = #1a475f / blue-800, bhds2 = #16488e).
const ASSETS: Record<LogoVariant, LogoAsset> = {
  horizontal: { src: "/Horizontal.svg", width: 188, height: 32 },
  stacked: { src: "/Stacked-white.svg", width: 121, height: 48 },
  icon: { src: "/Icon.svg", width: 56, height: 31 },
};

const logoVariants = cva(
  ["inline-block shrink-0 select-none"].join(" "),
  {
    variants: {
      variant: {
        horizontal: "h-8",
        stacked: "h-12",
        icon: "h-8",
      },
    },
    defaultVariants: {
      variant: "horizontal",
    },
  }
);

type CvaProps = VariantProps<typeof logoVariants>;

export type LogoProps = Omit<
  React.ComponentProps<"span">,
  "children" | "role" | "aria-label"
> & {
  variant?: CvaProps["variant"];
  tone?: LogoTone;
  themeOverride?: BhdsTheme;
  label?: string;
};

function Logo({
  variant = "horizontal",
  tone = "blue",
  themeOverride,
  className,
  style,
  label,
  ...props
}: LogoProps) {
  const { theme: contextTheme } = useTheme();
  const theme: BhdsTheme = themeOverride ?? contextTheme;
  const resolvedVariant: LogoVariant = variant ?? "horizontal";
  const asset = ASSETS[resolvedVariant];

  const color =
    tone === "white" ? "#ffffff" : "var(--bhds-color-brand-accent)";

  const maskUrl = `url(${asset.src})`;

  return (
    <span
      role="img"
      aria-label={label ?? "Bright Horizons"}
      data-slot="logo"
      data-theme={theme}
      data-variant={resolvedVariant}
      data-tone={tone}
      className={cn(logoVariants({ variant: resolvedVariant }), className)}
      style={{
        aspectRatio: `${asset.width} / ${asset.height}`,
        backgroundColor: color,
        WebkitMaskImage: maskUrl,
        maskImage: maskUrl,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        ...style,
      }}
      {...props}
    />
  );
}

export { Logo, logoVariants };
