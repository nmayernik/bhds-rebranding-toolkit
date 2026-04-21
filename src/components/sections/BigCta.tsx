"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/sections/Section";
import { TextLockup } from "@/components/ui/text-lockup";
import { useTheme, type BhdsTheme } from "@/lib/useTheme";

export type BigCtaProps = {
  /** Optional line above the headline (hidden by default — wireframe is headline + actions only). */
  eyebrow?: string;
  headline?: string;
  /** Optional supporting line under the headline. */
  body?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  themeOverride?: BhdsTheme;
};

export function BigCta({
  eyebrow,
  headline = "Big CTA headline here",
  body,
  primaryLabel = "To Work-Life Solutions page",
  secondaryLabel = "To Early Childhood Ed page",
  themeOverride,
}: BigCtaProps) {
  const { theme: contextTheme } = useTheme();
  const theme: BhdsTheme = themeOverride ?? contextTheme;

  const goldBanner = theme === "bhds2" ? "w-full" : "";

  // BHDS 2: gold banner, navy copy and actions. BHDS 1: Mulish bold headline; semibold buttons; secondary on white.
  const palette =
    theme === "bhds2"
      ? {
          bg: "#ffcb00",
          fg: "#16488e",
          primaryBtnBg: "#16488e",
          primaryBtnFg: "#ffffff",
          primaryBtnHover: "#1b5ab1",
          secondaryBorder: "#16488e",
          secondaryFg: "#16488e",
          secondaryHoverMix: "#16488e",
        }
      : null;

  const headlineClass = cn(
    "mx-auto max-w-3xl leading-[var(--bhds-line-height-tight)]",
    theme === "bhds2"
      ? "[font-family:var(--bhds-font-family-serif)] text-[36px] font-bold"
      : "[font-family:var(--bhds-font-family-sans)] text-[length:var(--bhds-font-size-4xl)] font-bold text-white"
  );

  const actions = (
    <div className="flex flex-wrap items-center justify-center gap-[var(--bhds-space-3)]">
      <Button
        themeOverride={theme}
        intent="primary"
        size="lg"
        className={cn(
          !palette && "font-semibold",
          palette &&
            "[&]:bg-[var(--cta-primary-bg)] [&]:text-[var(--cta-primary-fg)] hover:[&]:bg-[var(--cta-primary-hover)] active:[&]:bg-[var(--cta-primary-hover)]"
        )}
        style={
          palette
            ? ({
                "--cta-primary-bg": palette.primaryBtnBg,
                "--cta-primary-fg": palette.primaryBtnFg,
                "--cta-primary-hover": palette.primaryBtnHover,
              } as React.CSSProperties)
            : undefined
        }
      >
        {primaryLabel}
      </Button>
      {secondaryLabel ? (
        <Button
          themeOverride={theme}
          intent="secondary"
          size="lg"
          className={cn(
            !palette &&
              "font-semibold !bg-[var(--bhds-color-bg-surface)] hover:!bg-[var(--bhds-color-bg-muted)]",
            palette &&
              "[&]:border-[var(--cta-secondary-border)] [&]:text-[var(--cta-secondary-fg)] hover:[&]:bg-[color-mix(in_oklab,var(--cta-secondary-mix)_10%,transparent)]"
          )}
          style={
            palette
              ? ({
                  "--cta-secondary-border": palette.secondaryBorder,
                  "--cta-secondary-fg": palette.secondaryFg,
                  "--cta-secondary-mix": palette.secondaryHoverMix,
                } as React.CSSProperties)
              : undefined
          }
        >
          {secondaryLabel}
        </Button>
      ) : null}
    </div>
  );

  const core = (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-[var(--bhds-space-6)] px-[var(--bhds-space-6)] py-[var(--bhds-space-10)] text-center md:px-[var(--bhds-space-12)]">
      <TextLockup
        theme={theme}
        eyebrow={eyebrow}
        title={<span style={palette ? { color: palette.fg } : undefined}>{headline}</span>}
        subtitle={
          body ? (
            <span style={palette ? { color: palette.fg, opacity: 0.95 } : undefined}>{body}</span>
          ) : undefined
        }
        titleClassName={headlineClass}
        subtitleClassName={cn(
          "[font-family:var(--bhds-font-family-sans)] text-(length:--bhds-font-size-lg) leading-(--bhds-line-height-relaxed)",
          palette ? undefined : "text-white/90"
        )}
        eyebrowClassName={cn(palette ? undefined : "text-white/85")}
        className="max-w-3xl"
      />
      {actions}
    </div>
  );

  return (
    <Section
      data-theme={theme}
      data-slot="big-cta"
      className={cn(
        "w-full py-0",
        theme === "bhds1" && "bg-[var(--bhds-color-blue-800)]"
      )}
    >
      {theme === "bhds2" ? (
        <div className={goldBanner} style={{ backgroundColor: palette!.bg }}>
          {core}
        </div>
      ) : (
        core
      )}
    </Section>
  );
}
