---
title: Color System Rules
description: Semantic color tokens, color sets, and light/dark theme mapping
---

Global color token rules sourced from the Harness design-token architecture (LCH primitives + semantic aliases).

## LCH is the source of truth; hex is a fallback only

**Rule:** All colors are authored in LCH (Lightness, Chroma, Hue), not hex. Hex exists only as a fallback for tooling/exports. Always derive new colors in LCH or reuse an existing token — never author hex as canonical.

**Why:** LCH separates perceptual lightness from hue, making color changes predictable and theme-safe.

---

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

## Interactive-state overlays use LCH alpha modifiers

**Rule:** Hover and selected states use alpha modifiers (e.g., `gray.850` @ 20% opacity), not flat standalone colors. Use Token Studio's `$extensions` to define these in LCH, so they scale across themes (dimmer, high-contrast, etc.) consistently.

**Why:** Allows a single rule to drive all themes instead of maintaining separate flat colors per theme.

---

## Known gaps & verifications needed

**Contrast verification:** Color sets claim to be pre-verified for WCAG 4.5:1 (normal) / 3:1 (large), but this hasn't been independently spot-checked in this review. Treat as an open verification item.

**Hex-vs-LCH drift:** The contrast-checking tool reads the hex fallback, not the LCH values actually rendered. `colors_lch.json` and `colors_hex.json` are maintained in parallel by hand — they can drift, so a reported contrast number may not match what's rendered. See the token documentation for conversion details.

---

## Cross-references

- **Accessibility** — Contrast requirements, status-color usage rules
- **Interaction States** — Alpha modifiers for hover/selected
- **Visual Primitives** — Color roles for icons, logos
