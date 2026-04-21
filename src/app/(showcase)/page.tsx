"use client";

import { ComponentFrame } from "@/components/chrome/ComponentFrame";
import { BigCta } from "@/components/sections/BigCta";
import { ValuePropServiceGrid } from "@/components/sections/ValuePropServiceGrid";
import { cn } from "@/lib/utils";
import { useIsClient } from "@/lib/useIsClient";
import { useTheme } from "@/lib/useTheme";

export default function TourLandingPage() {
  const { theme } = useTheme();
  const isClient = useIsClient();
  const isBhds2 = isClient && theme === "bhds2";

  return (
    <main className="flex-1">
      <section
        data-theme={theme}
        data-slot="tour-hero"
        className="w-full max-w-none bg-(--bhds-color-bg-page) px-6 py-10"
      >
        <div className="mx-auto w-full max-w-[1024px]">
          <h1
            className={cn(
              "text-(length:--bhds-font-size-4xl) leading-(--bhds-line-height-tight) text-(--bhds-color-brand-accent)",
              isBhds2
                ? "[font-family:var(--bhds-font-family-serif)] font-bold"
                : "[font-family:var(--bhds-font-family-sans)] font-bold"
            )}
          >
            From BHDS 1 to BHDS 2
          </h1>
          <p
            className={cn(
              "mt-(--bhds-space-3) text-(length:--bhds-font-size-md) leading-(--bhds-line-height-relaxed) text-(--bhds-color-text-secondary)",
              "[font-family:var(--bhds-font-family-sans)]"
            )}
          >
            Your team&apos;s guide to the Bright Horizons design language evolution. Explore how
            tokens, type, color, and components change as we move from our current system to BHDS
            2&nbsp;&mdash; and use the{" "}
            <a className="underline text-(--bhds-color-text-link)" href="/compare">
              side-by-side comparison
            </a>{" "}
            to plan and communicate your team&apos;s transition.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-[min(80rem,calc(100%-1.5rem))] flex-col gap-6 px-3 py-6 sm:px-4 sm:py-8">
        <ComponentFrame name="ValuePropServiceGrid">
          <ValuePropServiceGrid />
        </ComponentFrame>
        <ComponentFrame name="BigCta">
          <BigCta />
        </ComponentFrame>
      </div>
    </main>
  );
}
