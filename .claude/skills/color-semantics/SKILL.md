---
name: color-semantics
description: Use when choosing or reviewing colors in Canary — semantic tokens, color sets (primary/secondary/outline), status colors (success/danger/warning/brand/merged), and light/dark theme mapping. Triggers on raw hex usage, color prop choices, or status/badge/alert coloring.
domain: color-semantics
prefix: ICN
version: 0.3.0
rules:
  - id: ICN-001
    title: LCH is the source of truth, hex is a fallback only
    applies_to: []
    owner_artifact: code
    tier: 1
    sources:
      - {type: docs, ref: apps/portal/src/content/docs/design-system/color-system.mdx, verified: 2026-09-21}
    conflicts: []
  - id: ICN-002
    title: Never use a core primitive directly; use a semantic token
    applies_to: []
    owner_artifact: guidelines
    tier: 1
    sources:
      - {type: docs, ref: apps/portal/src/content/docs/design-system/color-system.mdx, verified: 2026-09-21}
    conflicts: []
  - id: ICN-003
    title: "Background, text, and border each have their own numbered hierarchy — don't cross them"
    applies_to: []
    owner_artifact: code
    tier: null
    sources:
      - {type: docs, ref: apps/portal/src/content/docs/design-system/color-system.mdx, verified: 2026-09-21}
    conflicts: []
  - id: ICN-004
    title: "Status colors: success, danger, warning (confirmed values), no \"informational\" category at this level"
    applies_to: []
    owner_artifact: code
    tier: null
    sources:
      - {type: docs, ref: apps/portal/src/content/docs/design-system/color-system.mdx, verified: 2026-09-21}
      - {type: code, ref: packages/core-design-system/design-tokens/mode/light/default.json, verified: 2026-09-21}
      - {type: code, ref: packages/ui/src/components/button.tsx, verified: 2026-09-21}
    conflicts: []
  - id: ICN-005
    title: "Color sets: pick background and text from the same set AND the same level"
    applies_to: []
    owner_artifact: guidelines
    tier: 3
    sources:
      - {type: docs, ref: apps/portal/src/content/docs/design-system/color-system.mdx, verified: 2026-09-21}
    conflicts: []
  - id: ICN-006
    title: Some color sets switch color family between light and dark, not just shade
    applies_to: []
    owner_artifact: code
    tier: null
    sources:
      - {type: docs, ref: apps/portal/src/content/docs/design-system/color-system.mdx, verified: 2026-09-21}
    conflicts: []
  - id: ICN-007
    title: "Component-specific colors live in a separate comp.* namespace, not set.*"
    applies_to: []
    owner_artifact: guidelines
    tier: null
    sources:
      - {type: docs, ref: apps/portal/src/content/docs/design-system/color-system.mdx, verified: 2026-09-21}
    conflicts: []
  - id: ICN-008
    title: Interactive-state overlays use LCH alpha modifiers, not separate flat colors
    applies_to: []
    owner_artifact: code
    tier: null
    sources:
      - {type: docs, ref: apps/portal/src/content/docs/design-system/color-system.mdx, verified: 2026-09-21}
    conflicts: []
  - id: ICN-009
    title: Color sets are claimed to be pre-verified for WCAG contrast; not independently spot-checked
    applies_to: []
    owner_artifact: docs
    tier: 2
    sources:
      - {type: docs, ref: apps/portal/src/content/docs/design-system/color-system.mdx, verified: 2026-09-22}
    conflicts: []
  - id: ICN-010
    title: Contrast verification reads the hex fallback, not the LCH values actually rendered in production — the two can drift
    applies_to: []
    owner_artifact: code
    tier: 2
    sources:
      - {type: code, ref: packages/core-design-system/design-tokens/core/colors_lch.json, verified: 2026-09-22}
      - {type: code, ref: packages/core-design-system/design-tokens/core/colors_hex.json, verified: 2026-09-22}
      - {type: code, ref: packages/ui/dist/styles.css, verified: 2026-09-22}
      - {type: code, ref: apps/portal/src/components/MainColorPalette.astro, verified: 2026-09-22}
    conflicts: []
---

# Color Semantics

Semantic color tokens and color sets. Sourced from the Color System doc (`color-system.mdx`) and direct token inspection.

## ICN-001 — LCH is the source of truth, hex is a fallback only

All colors are authored in LCH (Lightness, Chroma, Hue), not hex. Hex exists only as a Figma export fallback. Derive new colors in LCH or reuse a token — never author a hex value as canonical.

## ICN-002 — Never use a core primitive directly; use a semantic token

`gray.500`, `lime.700`, etc. are raw primitives with no assigned meaning. Reference semantic tokens (`bg.0..3`, `text.1..4`, `border.1..3`, or a color set), never a bare primitive. The semantic token resolves per theme (e.g. `border.2` = `gray.150` light / `gray.850` dark), so hardcoding a primitive breaks theme switching.

## ICN-003 — Background, text, and border each have their own numbered hierarchy — don't cross them

- `bg.0..3`: nav/sidebar → app background → cards/containers → popovers/tooltips (depth)
- `text.1..4`: headings/max-contrast → body → secondary/metadata → disabled (emphasis). `text.4`/`foreground-4` is slated to merge into `text.3` (target Oct '26) — prefer `text.3` for new work.
- `border.1..3`: focus/hover outlines → cards/fields/dividers → subtle separators (strength)

`text.2` and `border.2` are unrelated despite sharing a number.

## ICN-004 — Status colors: success, danger, warning only (no "informational")

At the semantic `text.*`/`border.*` level there are exactly three: `success` (lime light / forest dark), `danger` (red), `warning` (yellow, e.g. `border.warning` = `yellow.400`). No `info` token exists at this level; Button's `theme` prop confirms the same set (plus `default`). Note: `IconV2`'s `color` prop is a larger palette (adds `info`, `risk`, `merged`, `neutral`) — see the `icons` skill; don't assume the lists match.

## ICN-005 — Color sets: pick background and text from the same set AND the same level

Every semantic color has three levels — `primary` (saturated fill, high-contrast text), `secondary` (muted tint, colored text), `outline` (near-transparent, colored text/border). Background and text must share set and level, or contrast breaks.

```tsx
// Correct — same set, same level
<Badge className="bg-cn-success-secondary text-cn-success-secondary">Done</Badge>

// Wrong — mixed levels break contrast
<Badge className="bg-cn-success-secondary text-cn-success-primary">Done</Badge>
```

## ICN-006 — Some color sets switch color family between light and dark, not just shade

`set.success` uses `lime` in light but `forest` in dark — a different family, not a shade. Don't assume a token's color family is theme-invariant.

## ICN-007 — Component-specific colors live in a separate `comp.*` namespace, not `set.*`

Colors that don't fit the generic tokens (gradients, custom-alpha overlays, domain highlights like `comp.diff.add-content`) are namespaced under `comp.*` and reference `set.*`/`bg.*`/`gray.*` internally so they still theme-switch. Don't author a new component color outside this namespace.

## ICN-008 — Interactive-state overlays use LCH alpha modifiers, not flat colors

`bg-cn-hover`/`bg-cn-selected` are an alpha modifier applied to an existing token (e.g. `gray.850` @ 0.2) via Token Studio's `$extensions`, in LCH — not standalone flat colors. The same modifiers (`alpha`/`lighten`/`darken`/`mix`) drive the dimmer/high-contrast themes. Express new hover/selected states as modifiers, not flat values.

## ICN-009 — "Pre-verified for WCAG contrast" claim is not independently checked

The source doc states each set pair is WCAG-verified "so developers never need to manually check accessibility." That hasn't been spot-checked against SC 1.4.3 (AA: 4.5:1 normal / 3:1 large) in this pass — treat as an open verification item, not a guarantee.

## ICN-010 — Contrast tooling reads the hex fallback, not the LCH values rendered in production

The browser paints the raw LCH value (`dist/styles.css` ships `--cn-gray-500: lch(65% 6 272);`), but the docs-site contrast checker (`MainColorPalette.astro`) computes from the separate, hand-maintained `colors_hex.json`. `colors_lch.json` and `colors_hex.json` are kept in parallel by hand — `build.js` has no conversion step — so they can drift, and a reported contrast number may not match what's rendered. See [[lch-conversion-convention]].
