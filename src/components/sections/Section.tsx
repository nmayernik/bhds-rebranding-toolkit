"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type SectionProps = React.ComponentProps<"section"> & {
  background?: string;
  foreground?: string;
};

export function Section({ background, foreground, className, style, ...props }: SectionProps) {
  return (
    <section
      className={cn(className)}
      style={{
        ...(style ?? {}),
        ...(background ? { background } : null),
        ...(foreground ? { color: foreground } : null),
      }}
      {...props}
    />
  );
}

