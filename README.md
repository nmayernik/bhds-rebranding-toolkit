# BHDS Showcase

Password-protected site that presents BHDS 1 and BHDS 2 side by side for non-technical stakeholder review.

## Local dev

```bash
cp .env.example .env.local
# edit .env.local and set SHOWCASE_PASSWORD
npm run dev
```

Visit `http://localhost:3000`. You will be redirected to `/unlock` until you enter the password.

## Theming

- Global theme toggle switches `data-theme="bhds1"` ↔ `data-theme="bhds2"` on `<html>` via `next-themes`.
- Every component ships both variants baked in via `cva`. Consumers write `<Button>Click</Button>`.
- Components accept an optional `themeOverride` prop for the `/compare` page.
- Token values live in `src/styles/tokens/bhds1.css` and `bhds2.css`, scoped by `[data-theme="..."]`.

## Stack

- Next.js App Router + TypeScript
- Tailwind v4
- shadcn/ui (Radix primitives, extended with theme variants)
- `@base-ui/react` for headless primitives where needed
- `next-themes` for the global toggle, wrapped by `@/lib/useTheme`

## Layout

```
src/
  app/
    (showcase)/
      page.tsx            <- tour landing
      tokens/page.tsx
      components/page.tsx
      compare/page.tsx
    unlock/page.tsx
    api/unlock/route.ts
    layout.tsx
    globals.css
  components/
    ui/                   <- shadcn primitives, extended with theme variants
    chrome/               <- Header, Footer, ThemeToggle, Logo
    sections/             <- compositions (Value Prop, Big CTA, etc.)
  lib/
    useTheme.ts
  styles/
    tokens/{bhds1,bhds2}.css
    theme-provider.tsx
  middleware.ts
docs/
  Component Log.md
.claude/agents/
  component-builder.md
  a11y-reviewer.md
```

## Deploy

Set `SHOWCASE_PASSWORD` on Vercel for Production, Preview, and Development environments.

## Conventions

- Conventional Commits.
- Every component gets one entry in `docs/Component Log.md` covering both variants.
- Never use em dashes. Never use the word "delve".
