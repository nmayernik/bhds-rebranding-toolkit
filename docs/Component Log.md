# Component Log

One entry per component. Each entry covers both `bhds1` and `bhds2` variants. Order by build sequence, newest at the bottom.

---

## Entry Template

### `<ComponentName>`

**Date:** YYYY-MM-DD
**Source:** `src/components/...`
**Compare render:** `/compare` section ID or page

**Brand intent**
- BHDS 1:
- BHDS 2:

**Structural differences between variants**
- Radius:
- Padding ramp:
- Border / fill treatment:
- Typography (family, weight, size, case):
- Shadow / elevation:
- Motion (if any):
- Other:

**Tokens consumed**
- BHDS 1: `--bhds-...`, ...
- BHDS 2: `--bhds-...`, ...

**Missing tokens added with sentinel values**
- (list the new `--bhds-*` names; empty if none)

**Relationship between BHDS 1 and BHDS 2**
- Same API? Y/N, note any prop differences.
- Behavioral differences (hover, focus, active, disabled):
- Responsive differences:

**Gotchas**
- (edge cases, ARIA notes, Safari quirks, SSR warnings, etc.)

**a11y review status**
- Reviewed on: YYYY-MM-DD by a11y-reviewer
- Open issues:

---

### `Button`

**Date:** 2026-04-17
**Source:** `src/components/ui/button.tsx`
**Compare render:** `/compare` > "Button" section

**Brand intent**
- BHDS 1: rect, medium weight, tight tracking, conservative padding. Utility, confident, no flourish.
- BHDS 2: pill, semibold, wider tracking, roomier horizontal padding. Warmer, more inviting, closer to consumer/marketing tone.

**Structural differences between variants**
- Radius: both consume `--bhds-radius-button`, but the TOKEN VALUE differs per theme (bhds1: 4px rect, bhds2: 9999px pill). Structural swap happens through the token, not the class set, which keeps the cva simpler.
- Padding ramp: BHDS 1 uses `space-4` (md) / `space-6` (lg). BHDS 2 compoundVariants bump to `space-5` / `space-8` for more breathing room.
- Font weight: bhds1 = `--bhds-font-weight-medium`, bhds2 = `--bhds-font-weight-semibold`.
- Letter spacing: bhds2 adds `tracking-wide`. bhds1 default tracking.
- Color / fill / hover / active: same token NAMES per intent; token VALUES differ by theme scope.

**Tokens consumed**
- Shared: `--bhds-radius-button`, `--bhds-color-brand-primary`, `--bhds-color-brand-primary-hover`, `--bhds-color-brand-primary-active`, `--bhds-color-text-inverse`, `--bhds-color-bg-muted`, `--bhds-color-focus-ring-color`, `--bhds-font-size-sm`, `--bhds-font-size-md`, `--bhds-space-2`, `--bhds-space-4`, `--bhds-space-5`, `--bhds-space-6`, `--bhds-space-8`, `--bhds-space-10`, `--bhds-space-12`.
- BHDS 1 additionally: `--bhds-font-weight-medium`.
- BHDS 2 additionally: `--bhds-font-weight-semibold`.

**Missing tokens added with sentinel values**
- None. All needed tokens already existed in `bhds1.css` / `bhds2.css`.

**Relationship between BHDS 1 and BHDS 2**
- Same API: `intent`, `size`, `themeOverride`, standard Base UI Button props.
- Structural differences baked into `cva` `theme` variant + `compoundVariants`.
- Context by default, `themeOverride` for `/compare` where both must render simultaneously.
- `data-theme={theme}` is set on the button element itself, so `var(--bhds-*)` lookups resolve inside the correct token scope when `themeOverride` is used (important on `/compare` where `<html>` is one theme and the button is the other).

**Gotchas**
- Converted shadcn's `button.tsx` from RSC to a client component because `useTheme()` is client-only. `next-themes` returns `undefined` before hydration; the `useTheme` wrapper normalizes that to `bhds1`, so SSR always paints BHDS 1 first. For `themeOverride` this is a non-issue.
- API shift from shadcn's `variant: default|outline|ghost|destructive|link|secondary` to `intent: primary|secondary`. There are no existing consumers in the repo. If we reintroduce tertiary/ghost/destructive later, add them as intent values (not theme).
- Focus ring width and offset are hardcoded to `outline-2` / `outline-offset-2` because Tailwind's ring/outline utilities don't compose cleanly with CSS-var widths. The token `--bhds-focus-ring-width` (currently `2px`) documents intent; component is numerically aligned. Color comes from `--bhds-color-focus-ring-color` via `[outline-color:var(...)]`.
- `[font-weight:var(...)]` and `[font-size:var(...)]` use the property-value escape hatch rather than `font-[...]` / `text-[...]` shorthands to avoid Tailwind's font-family vs font-weight and color vs size ambiguity when the value is a CSS var.

**a11y review status**
- Not yet reviewed. Run the a11y-reviewer agent (or ask the main thread) to check contrast at current sentinel values (all `#ff00ff` which will fail by design), keyboard reachability, focus visibility on both themes, touch target size for `md` (currently 40px, under 44pt WCAG target). Revisit contrast once real tokens are pasted in.

---
