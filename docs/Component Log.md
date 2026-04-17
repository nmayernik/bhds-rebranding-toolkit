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
