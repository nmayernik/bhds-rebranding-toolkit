"use client";

import { useId, type CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/sections/Section";
import { TextLockup } from "@/components/ui/text-lockup";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { useTheme, type BhdsTheme } from "@/lib/useTheme";

const defaultMarqueeRow1 = [
  "Childcare",
  "Backup Care",
  "Elder & Adult Care",
];

const defaultMarqueeRow2 = [
  "Support",
  "Education Support",
  "Camps + Enrichment",
  "Onsite Childcare",
];

function MarqueeTrack({
  items,
  durationSec,
  reverse,
  reduceMotion,
  pillClassName,
}: {
  items: string[];
  durationSec: number;
  /** Second row: scroll the other way (animation-direction: reverse). */
  reverse: boolean;
  reduceMotion: boolean;
  pillClassName: string;
}) {
  /* Four copies so total width usually exceeds the viewport; -25% = one copy width */
  const loop = reduceMotion ? items : [...items, ...items, ...items, ...items];

  if (reduceMotion) {
    return (
      <div className="flex flex-wrap justify-center gap-[var(--bhds-space-4)]">
        {items.map((label, i) => (
          <span key={`${label}-${i}`} className={pillClassName}>
            {label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full min-w-0 overflow-x-hidden">
      <div
        className="bhds-marquee-track flex w-max shrink-0 gap-[var(--bhds-space-4)] will-change-transform"
        style={
          {
            "--bhds-marquee-duration": `${durationSec}s`,
          } as CSSProperties
        }
        data-marquee-direction={reverse ? "reverse" : undefined}
      >
        {loop.map((label, i) => (
          <span key={`${label}-${i}`} className={pillClassName}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export type ValuePropServiceGridProps = {
  /** When set, renders above the headline (wireframe uses none). */
  eyebrow?: string;
  headline?: string;
  body?: string;
  ctaLabel?: string;
  marqueeRow1?: string[];
  marqueeRow2?: string[];
  /** Seconds for top row loop (left). */
  marqueeDurationRow1Sec?: number;
  /** Seconds for bottom row loop (right). */
  marqueeDurationRow2Sec?: number;
  themeOverride?: BhdsTheme;
};

export function ValuePropServiceGrid({
  eyebrow,
  headline = "Work-life value prop headline here.",
  body = "Brief product copy here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.",
  ctaLabel,
  marqueeRow1 = defaultMarqueeRow1,
  marqueeRow2 = defaultMarqueeRow2,
  marqueeDurationRow1Sec = 28,
  marqueeDurationRow2Sec = 32,
  themeOverride,
}: ValuePropServiceGridProps) {
  const { theme: contextTheme } = useTheme();
  const theme: BhdsTheme = themeOverride ?? contextTheme;
  const reduceMotion = usePrefersReducedMotion();
  const headingId = useId();

  const fontSans = "[font-family:var(--bhds-font-family-sans)]";
  const fontSerif = "[font-family:var(--bhds-font-family-serif)]";

  const headlineWeight = theme === "bhds2" ? "font-bold" : "font-semibold";
  const headlineFont = theme === "bhds1" ? fontSans : fontSerif;
  /** blue-800 (BHDS 1) / navy-700 (BHDS 2) from primitives */
  const headlineColor = theme === "bhds2" ? "#16488e" : "#1a475f";

  const pillClassName = cn(
    fontSans,
    "inline-flex shrink-0 items-center justify-center rounded-[var(--bhds-radius-card)]",
    "bg-[var(--bhds-color-bg-surface)]",
    "px-[var(--bhds-space-8)] py-[var(--bhds-space-4)]",
    "text-center text-[length:var(--bhds-font-size-md)] font-medium",
    "min-w-[10rem] md:min-w-[12rem]",
    theme === "bhds2"
      ? "border border-[var(--bhds-color-brand-accent)] text-[var(--bhds-color-brand-accent)]"
      : [
          "border border-[var(--bhds-color-gray-100)]",
          "text-[var(--bhds-color-brand-accent)]",
          "shadow-[var(--bhds-shadow-sm)]",
        ].join(" ")
  );

  const allLabels = [...marqueeRow1, ...marqueeRow2];
  const summary = allLabels.join(", ");

  return (
    <Section
      data-theme={theme}
      data-slot="value-prop-service-grid"
      aria-labelledby={headingId}
      className={cn(
        "flex flex-col gap-[var(--bhds-space-12)] overflow-x-hidden px-[var(--bhds-space-6)] py-[var(--bhds-space-16)] md:px-[var(--bhds-space-12)]",
        theme === "bhds1"
          ? "[background:var(--bhds-gradient-value-prop-section)]"
          : "bg-[var(--bhds-color-bg-page)]"
      )}
    >
      <p className="sr-only">Service areas: {summary}</p>

      <header className="mx-auto flex max-w-2xl flex-col items-center gap-[var(--bhds-space-4)] text-center">
        <TextLockup
          theme={theme}
          eyebrow={eyebrow}
          title={<span style={{ color: headlineColor }}>{headline}</span>}
          subtitle={body}
          titleId={headingId}
          titleClassName={`${headlineFont} text-(length:--bhds-font-size-4xl) leading-(--bhds-line-height-tight) ${headlineWeight}`}
          subtitleClassName={`${fontSans} text-(length:--bhds-font-size-lg) leading-(--bhds-line-height-relaxed) text-(--bhds-color-text-secondary)`}
          eyebrowClassName={fontSans}
          className="max-w-2xl"
        >
          {ctaLabel ? (
            <div className="mt-(--bhds-space-2) flex justify-center">
              <Button themeOverride={theme} intent="primary" size="md">
                {ctaLabel}
              </Button>
            </div>
          ) : null}
        </TextLockup>
      </header>

      {/* Full-bleed: cancel section horizontal padding so tracks span the full band width */}
      <div
        className="-mx-[var(--bhds-space-6)] flex min-w-0 w-[calc(100%+2*var(--bhds-space-6))] max-w-none flex-col gap-[var(--bhds-space-5)] md:-mx-[var(--bhds-space-12)] md:w-[calc(100%+2*var(--bhds-space-12))]"
        aria-hidden="true"
      >
        <MarqueeTrack
          items={marqueeRow1}
          durationSec={marqueeDurationRow1Sec}
          reverse={false}
          reduceMotion={reduceMotion}
          pillClassName={pillClassName}
        />
        <MarqueeTrack
          items={marqueeRow2}
          durationSec={marqueeDurationRow2Sec}
          reverse
          reduceMotion={reduceMotion}
          pillClassName={pillClassName}
        />
      </div>
    </Section>
  );
}
