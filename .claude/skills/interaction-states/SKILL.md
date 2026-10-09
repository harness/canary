---
name: interaction-states
description: Use when implementing or reviewing disabled, focus, or hover/selected states in Canary. Covers the shared disabled-opacity token, the WCAG-oriented focus-ring token, and hover/selected overlay construction. Triggers on disabled styling, focus-visible outlines, or hover/selected background treatments.
domain: interaction-states
prefix: STA
version: 0.1.0
rules:
  - id: STA-001
    title: Disabled elements use one shared opacity token, not per-component values
    applies_to: []
    owner_artifact: code
    tier: 1
    sources:
      - {type: code, ref: packages/core-design-system/design-tokens/mode/light/default.json, verified: 2026-09-21}
    conflicts: []
  - id: STA-002
    title: Focus rings are a defined token, explicitly built for WCAG compliance
    applies_to: []
    owner_artifact: code
    tier: 1
    sources:
      - {type: code, ref: packages/core-design-system/design-tokens/mode/light/default.json, verified: 2026-09-21}
    conflicts: []
  - id: STA-003
    title: Hover/selected states are alpha overlays on existing tokens, not flat standalone colors
    applies_to: []
    owner_artifact: code
    tier: null
    sources:
      - {type: docs, ref: apps/portal/src/content/docs/design-system/color-system.mdx, verified: 2026-09-21}
    conflicts: []
---

# Interaction States

Disabled, focus, and hover/selected states. Sourced from design tokens (`default.json`) and the Color System doc.

## STA-001 — Disabled elements use one shared opacity token

Disabled interactive elements use a single token: `opacity.60` ("visual distinction for unavailable states"). Don't hand-author a per-component disabled opacity — use the shared token so disabled treatment stays consistent system-wide.

## STA-002 — Focus rings are a defined token, built for WCAG

Focus ring = `border.brand` + `borderWidth.2` + solid, as one composed token ("accessible keyboard navigation indicator meeting WCAG requirements"). Don't build a custom outline (e.g. `outline: 2px solid blue`) — use the token so focus stays consistent and conformant. Note: the "meets WCAG" claim is unverified for contrast (SC 1.4.11, ≥3:1) — see `accessibility` ACC-004.

## STA-003 — Hover/selected states are alpha overlays, not flat colors

`bg-cn-hover`/`bg-cn-selected` apply an alpha modifier (e.g. `gray.850` @ 0.2) to an existing token via Token Studio's `$extensions`, in LCH — not separately-authored flat colors. The same mechanism (`alpha`/`lighten`/`darken`/`mix`) drives the dimmer/high-contrast themes. Express new hover/selected states as modifiers on an existing token, not flat values.
