---
name: logos
description: Use when adding or reviewing a full-color brand Logo in Canary (LogoV2) — sizing, the lack of a color/theme system, and missing-logo fallback behavior. For the monochrome sibling component, see the `logo-symbol` skill. Triggers on logo name lookups or logo sizing decisions.
domain: logos
prefix: LOG
version: 0.2.0
rules:
  - id: LOG-001
    title: LogoV2 has fixed brand colors and no theme-dependent asset system
    applies_to: []
    owner_artifact: code
    tier: null
    sources:
      - {type: code, ref: packages/ui/src/components/logo-v2/logo-v2.tsx, verified: 2026-09-22}
      - {type: code, ref: packages/ui/src/components/logo-v2/logo-name-map.ts, verified: 2026-09-22}
      - {type: docs, ref: apps/portal/src/content/docs/components/visual/logo.mdx, verified: 2026-09-22}
    conflicts: []
  - id: LOG-002
    title: "Don't recolor LogoV2 — reach for LogoSymbol instead"
    applies_to: []
    owner_artifact: guidelines
    tier: 3
    sources:
      - {type: docs, ref: apps/portal/src/content/docs/components/visual/logo.mdx, verified: 2026-09-22}
    conflicts: []
---

# Logos (LogoV2)

Full-color brand marks via `LogoV2`. For the monochrome sibling see the `logo-symbol` skill. Sourced from the docs site (`components/visual/logo.mdx`) and `logo-v2.tsx`/`logo-name-map.ts`.

## LOG-001 — LogoV2 has fixed brand colors and no theme-dependent asset system

Unlike `IconV2` (color enum) and `Illustration` (`themeDependent` + `-light` fallback), `LogoV2` has no `color` prop and no light/dark asset split — all 49 entries in `LogoNameMapV2` render a single fixed brand-colored asset regardless of theme ("its brand colors are intentional"). If a mark needs to follow text color or theme, use `LogoSymbol`, not a prop/className override on `LogoV2`.

## LOG-002 — Don't recolor LogoV2 — reach for LogoSymbol instead

Stated as a "Don't" in the docs Best Practices: don't recolor `LogoV2` or stretch it with mismatched dimensions (use `size`, or CSS with `skipSize`). When a mark needs to blend with the UI — buttons, mono toolbars, colored surfaces — reach for `LogoSymbol`, not a `className` override fighting the fixed brand asset.

## Sizing — default differs from Icon's

Four sizes: `xs`, `sm`, `md`, `lg`, default `lg` (`IconV2` defaults to `sm`). Like `IconV2`, use `skipSize` to control size via CSS instead of a custom className.

## Missing logo names fail the same way icons do

Same fallback pattern as `IconV2`: a `fallback` name renders with a `console.warn`; no fallback renders `null` + `console.warn`. No thrown error, no visible placeholder. Provide a `fallback` when the logo name comes from data you don't fully control.

## Accessibility

Decorative SVG, no accessible name, no `alt`/`aria-label`. Convey the brand through adjacent text, or a name on the parent control when a logo stands alone — keep a text label beside a connector/provider logo rather than relying on the mark. See `accessibility` ACC-001 and ACC-002.
