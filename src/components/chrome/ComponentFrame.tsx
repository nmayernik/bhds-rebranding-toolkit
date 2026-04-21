"use client";

import { cn } from "@/lib/utils";

export type ComponentFrameProps = {
  name: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export function ComponentFrame({ name, children, className, contentClassName }: ComponentFrameProps) {
  return (
    <section
      aria-label={name}
      data-slot="component-frame"
      className={cn(
        "overflow-hidden rounded-[16px] border border-neutral-200/80 bg-(--bhds-color-gray-25) shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-neutral-200/70 px-4 py-2.5">
        <span className="font-mono text-xs font-semibold uppercase tracking-wide text-neutral-600">
          {name}
        </span>
      </div>
      <div className={cn("min-w-0", contentClassName)}>{children}</div>
    </section>
  );
}

