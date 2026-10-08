---
name: logo-symbol
description: Use when adding or reviewing a monochrome brand mark in Canary (LogoSymbol) — its currentColor-based theming, sizing, and missing-symbol fallback behavior. This is the sibling of LogoV2 (see the `logos` skill) for full-color brand marks. Triggers on logo-in-a-toolbar, logo-on-a-colored-surface, or "logo should match text color" decisions.
domain: logos
prefix: LOG
version: 0.1.0
rules:
  - id: LOG-003
    title: LogoSymbol recolors via currentColor, unlike LogoV2
    applies_to: []
    owner_artifact: code
    tier: null
    sources:
      - {type: code, ref: packages/ui/src/components/logo-v2/symbol.tsx, verified: 2026-09-22}
      - {type: docs, ref: apps/portal/src/content/docs/components/visual/logo.mdx, verified: 2026-09-22}
    conflicts: []
---

# Logos (LogoSymbol)

`LogoSymbol` — the monochrome sibling of `LogoV2` (see the `logos` skill). Sourced from the docs site (`components/visual/logo.mdx`) and `symbol.tsx`.

## LOG-003 — LogoSymbol recolors via `currentColor`, unlike LogoV2

`LogoSymbol` is a monochrome mark drawn with `currentColor`, so it inherits its parent's color — set it with a text-color utility (`text-cn-1`/`text-cn-2`/…), not a `color` prop (it has none). Use `LogoSymbol` when a mark should blend with the UI (inside buttons, mono toolbars, on colored surfaces); use `LogoV2` when the official brand appearance matters. Don't override its color with a `fill`/`color` CSS property — it resolves through `currentColor`, so the parent's text-color class is the lever.

## Sizing and fallback — identical to LogoV2

Same four sizes (`xs`, `sm`, `md`, `lg`, default `lg`), same `skipSize` escape hatch, same `name`/`fallback` discriminated-union typing, and the same fallback behavior: a `fallback` name renders with a `console.warn`; no fallback renders `null` + `console.warn`. Shares the brand name set with `LogoV2` — see the `logos` skill for the dynamic/external-name caution.

## Accessibility

Decorative SVG, no accessible name, no `alt`/`aria-label` — same as `LogoV2`/`IconV2`. Convey the brand through adjacent text, or a name on the parent control when the symbol stands alone. See `accessibility` ACC-001 (what an accessible name requires) and ACC-002 (no default `aria-hidden`/`role`).
