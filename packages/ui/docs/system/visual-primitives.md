---
title: Visual Primitives — Design Decisions
description: Global rules for when and how to use icons, logos, and illustrations
---

Three global design decisions for visual primitives (icons, logos, illustrations).

---

## Use LogoV2 for official brand; use LogoSymbol for UI integration

**Rule:** Use full-color `LogoV2` when you need official brand appearance (splash screens, marketing, official headers, brand-forward contexts). Use monochrome `LogoSymbol` when a mark needs to blend with the UI (inside buttons, toolbars, on colored surfaces where the mark should inherit the surrounding text color).

**Why:** Protects brand identity while allowing flexible UI integration.

---

## Icon colors are limited to global status colors

**Rule:** In global/shared UI, use only `inherit`, `danger`, `warning`, `success`. These map
to global semantic tokens.

**Product-specific colors:** Individual products (Pipelines, Code Repository, AI Code
Review) may use `info`, `risk`, `merged` — these are NOT global rules and belong in
product-specific guidance (domain rules). Don't assume they're available in all Harness
contexts. `merged` is the purple used for merged-state indicators.

**Why:** Keeps the global component lean; product-specific enums belong in domain-specific
rules.

**What the component actually accepts** (`src/components/icon-v2/icon-v2.tsx`, the
authoritative list — the rule above is governance, not a technical limit):
`inherit`, `danger`, `warning`, `success`, `info`, `neutral`, `merged`, `risk`.
`neutral` renders via the `text-cn-disabled` class.

**Disabled icons use `neutral`.** It applies `text-cn-disabled`, the shared disabled text
color. There is no `color="disabled"` on `IconV2`, even though `Text` spells the identical
color `disabled` — the two components disagree on the name for one token. Known
inconsistency, deliberately left alone for now; reach for `neutral` on icons and `disabled`
on text.

Because of that, `tag.tsx` greys a disabled icon by passing `className` rather than the
`color` prop. Follow the existing pattern in a component rather than assuming
`color="disabled"` exists.

---

## Decorative visual primitives must be hidden from assistive tech

**Rule:** Icons, logos, and illustrations are typically decorative SVGs. They must be invisible to screen readers — use `aria-hidden="true"` or `role="presentation"`. Convey meaning through adjacent text (labels, headings, descriptions), not the artwork alone.

**See also:** Accessibility rules for icon-only interactive controls (which need both an accessible name AND the decorative graphics hidden).

---

## Cross-references

- **Accessibility** — Rules for icon-only buttons, accessible names, decorative-vs-interactive graphics
- **Color System** — Semantic color tokens
- For component-specific details (sizing, API, fallback behavior, naming patterns), see the component documentation (icon.mdx, logo.mdx, illustration.mdx)
