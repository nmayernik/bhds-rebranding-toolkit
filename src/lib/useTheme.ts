"use client";

import { useTheme as useNextTheme } from "next-themes";

export type BhdsTheme = "bhds1" | "bhds2";

export function useTheme(): {
  theme: BhdsTheme;
  setTheme: (theme: BhdsTheme) => void;
  resolvedTheme: BhdsTheme;
} {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const normalized: BhdsTheme = theme === "bhds2" ? "bhds2" : "bhds1";
  const resolved: BhdsTheme = resolvedTheme === "bhds2" ? "bhds2" : "bhds1";
  return {
    theme: normalized,
    resolvedTheme: resolved,
    setTheme: (t) => setTheme(t),
  };
}
