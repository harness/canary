---
title: Color System Rules
description: Semantic color tokens, color sets, and light/dark theme mapping
---

Global color token rules sourced from the Harness design-token architecture (LCH primitives + semantic aliases).

## Use semantic tokens, never raw primitives

**Rule:** Don't use `gray.500`, `lime.700`, or other raw primitives directly. Always use a semantic token like `bg.0`, `text.1`, `border.2`, or a color set (`success-primary`, etc.). Semantic tokens resolve per theme (light/dark), so hardcoding a primitive breaks theme switching.

**Why:** Allows theme switching without editing component code.

---

## Background, text, and border hierarchies are separate

**Rule:** Three parallel numbering systems; don't cross them:

- **Background (`bg.0..3`):** nav/sidebar → app background → cards/containers → popovers/tooltips (visual depth)
- **Text (`text.1..4`):** headings (max contrast) → body text → secondary/metadata → disabled (emphasis)
- **Border (`border.1..3`):** focus/hover outlines → cards/fields/dividers → subtle separators (strength)

Note: `text.2` and `border.2` are unrelated despite sharing a number.

**Upcoming change (target Oct '26):** `text.4` / `foreground-4` is slated to merge into `text.3` / `foreground-3` and be deprecated. Prefer `text.3` for new work.

---

## Global status colors: success, danger, warning only

**Rule:** At the semantic level, there are exactly three: `success`, `danger`, `warning`. No "informational" or "info" token at this level. Button's `theme` prop confirms the same set (plus `default`).

**Note:** Individual components may have larger color enums for product-specific needs — see domain-specific rules.

---

## Color sets: match background and text to the same set AND level

**Rule:** Every semantic color has three levels — `primary` (saturated, high contrast), `secondary` (muted tint), `outline` (near-transparent). Background and text colors must use the same set and level, or contrast breaks.

**Example:**

```tsx
// ✓ Correct — same set, same level
<Badge className="bg-cn-success-secondary text-cn-success-secondary">Done</Badge>

// ✗ Wrong — mixed levels
<Badge className="bg-cn-success-secondary text-cn-success-primary">Done</Badge>
```

---

## Some color sets switch families between light and dark, not just shades

**Rule:** `set.success` uses `lime` in light theme but `forest` in dark — a different color family, not just a darker/lighter shade. Don't assume a token's color family is theme-invariant.

---

## Component-specific colors live in the `comp.*` namespace

**Rule:** Colors unique to a single component or use case (gradients, custom overlays, diff highlights) go in `comp.*`, not `set.*` or `bg.*`. They reference the generic tokens internally so they still respond to theme changes.

---

## Hover and selected states use alpha overlays, not flat colors

**Rule:** Hover and selected backgrounds use alpha modifiers (e.g., `gray.850` @ 20% opacity) applied to existing tokens, not flat standalone colors. Don't create a separate flat color per theme (for example `bg-hover-light` and `bg-hover-dark`).

**Why:** Allows a single rule to drive all themes instead of maintaining separate flat colors per theme.

---

## Cross-references

- **Accessibility** — Contrast requirements, status-color usage rules
- **Visual Primitives** — Color roles for icons, logos
