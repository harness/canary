---
name: illustrations
description: Use when adding or reviewing an Illustration in Canary — sizing (raw pixels, not an enum), and light/dark theme handling (explicit light asset vs. automatic CSS invert). Triggers on empty-state graphics, illustration name lookups, or theme-dependent visuals.
domain: illustrations
prefix: ILL
version: 0.1.0
rules:
  - id: ILL-001
    title: Sizing is a raw pixel number, not an enum (unlike Icon/Logo)
    applies_to: []
    owner_artifact: code
    tier: null
    sources:
      - {type: code, ref: packages/ui/src/components/illustration/illustration.tsx, verified: 2026-09-21}
    conflicts: []
  - id: ILL-002
    title: Theme-dependent illustrations need an explicit -light asset, or they fall back to CSS invert
    applies_to: []
    owner_artifact: code
    tier: 3
    sources:
      - {type: code, ref: packages/ui/src/components/illustration/illustration.tsx, verified: 2026-09-21}
    conflicts: []
---

# Illustrations

Guidance for `Illustration`. Sourced from `illustration.tsx`.

## ILL-001 — Sizing is a raw pixel number, not an enum (unlike Icon/Logo)

`Illustration` takes `size?: number` (default `112`), or separate `width`/`height` overrides — not a `2xs`/`sm`/`lg` enum like `IconV2`/`LogoV2`. Don't assume the icon/logo size scale applies; it's arbitrary pixel dimensions.

## ILL-002 — Theme-dependent illustrations need an explicit `-light` asset, or they fall back to CSS invert

When `themeDependent` is true and the theme is light, the component looks for a `${name}-light` entry in `IllustrationsNameMap`. If one exists it's used directly. If not, it applies a CSS `invert` to the dark asset — a geometric approximation, not a real light illustration. If the dark asset doesn't invert cleanly (e.g. a red error accent that would become cyan), author a real `-light` variant; the fallback produces a wrong-looking result silently, not an error.

## Accessibility

`Illustration` is a decorative SVG with no accessible name and no `alt`/`aria-label` — convey empty/error-state meaning through an adjacent heading and description, not the artwork alone. Like the other visual primitives, its rendered SVG has no default `aria-hidden`/`role` (see `accessibility` ACC-002).
