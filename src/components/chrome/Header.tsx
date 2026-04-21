"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/useTheme";

const navItems = [
  { href: "/", label: "Tour" },
  { href: "/compare", label: "Compare" },
];

export function Header() {
  const pathname = usePathname();
  const { theme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navItemBase =
    "inline-flex items-center align-middle rounded-full px-5 py-2.5 text-base font-medium [font-family:var(--bhds-font-family-sans)] transition-[box-shadow,background-color,color] duration-200 [transition-timing-function:var(--bhds-motion-ease-soft)] motion-reduce:transition-none";
  const navItemActive =
    "bg-(--bhds-color-text-primary) text-(--bhds-color-text-inverse) shadow-[var(--bhds-shadow-sm)]";
  const navItemInactive = "text-(--bhds-color-text-secondary) hover:text-(--bhds-color-text-primary)";

  return (
    <header className="pointer-events-none sticky top-0 z-40 bhds-page-intro bhds-page-intro-delay-1">
      <div className="mx-auto mt-3 flex w-full max-w-[2000px] items-center justify-between gap-3 px-3 sm:gap-4 sm:px-4">
        <div className="pointer-events-auto flex min-w-0 items-center rounded-full border border-neutral-200/80 bg-white/90 px-4 py-3 shadow-lg shadow-neutral-900/10 backdrop-blur-md sm:px-5">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 truncate font-semibold text-(--bhds-color-text-primary) [font-family:var(--bhds-font-family-sans)]"
          >
            <Logo variant="icon" tone="blue" className="h-5 w-auto shrink-0" aria-hidden />
            <span
              className={cn(
                "truncate",
                theme === "bhds2"
                  ? "[font-family:var(--bhds-font-family-serif)]"
                  : "[font-family:var(--bhds-font-family-sans)]"
              )}
            >
              BHDS Rebranding Toolkit
            </span>
          </Link>
        </div>

        <nav
          aria-label="Primary navigation"
          className="pointer-events-auto flex h-[50px] flex-row items-center rounded-full border border-neutral-200/80 bg-white/90 p-1 shadow-lg shadow-neutral-900/10 backdrop-blur-md"
        >
          <ul className="flex items-center gap-1 sm:gap-1.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    navItemBase,
                    isActive(item.href) ? navItemActive : navItemInactive
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
