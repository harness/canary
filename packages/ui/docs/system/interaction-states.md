---
title: Interaction States
description: Rules for disabled, focus, and hover/selected states
---

Global rules for interactive-element states (disabled, focus, hover, selected).

## Disabled state: use the shared opacity token

**Rule:** All disabled/inactive elements use a single opacity token: `opacity.60`. Don't create per-component disabled opacity values — use the shared token so disabled treatment stays consistent system-wide.

**Why:** Ensures visual consistency; one token to update if the disabled appearance needs to change.

---

## Focus indicator: use the defined focus-ring token

**Rule:** Keyboard focus must use the system focus-ring token (`border.brand` + `borderWidth.2`). Don't build custom outlines (e.g., `outline: 2px solid blue`). The token ensures focus is visible and consistent.

**Why:** Ensures focus indicators remain discoverable and theme-aware.

**Note:** The focus ring's WCAG contrast compliance (3:1 against adjacent backgrounds) hasn't been independently verified — see Accessibility rules.

---

## Hover and selected states: use alpha overlays, not flat colors

**Rule:** Hover and selected backgrounds use alpha modifiers (e.g., `gray.850` @ 20% opacity via LCH) applied to existing tokens, not standalone flat colors. Use Token Studio's `$extensions` to define these modifiers.

**Why:** Allows one rule to drive all themes (light, dark, dimmer, high-contrast) without duplicating flat colors per theme.

**Example (conceptual):**
```
// ✓ Use an alpha modifier on an existing token
bg-cn-hover = bg.2 @ 20% alpha

// ✗ Don't create a flat color for each theme
bg-hover-light = #e0e0e0
bg-hover-dark = #3a3a3a
```

---

## Cross-references

- **Color System** — Alpha modifiers, semantic tokens
- **Accessibility** — Focus indicator visibility, disabled state contrast exemption
