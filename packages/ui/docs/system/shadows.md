---
title: Shadow & Elevation Rules
description: The 0–6 elevation scale, which layer gets which shadow, and theme behaviour
---

Global rules for shadows and elevation. Shadow communicates **layer**, not decoration.

## Elevation is a 0–6 scale; pick by layer, not by taste

**Rule:** Use the `shadow-cn-*` tokens. Each step corresponds to a UI layer — choose by what the element *is*, not by how prominent you want it to look:

| Token | Layer |
|---|---|
| `shadow-cn-none` (0) | Flat — no elevation |
| `shadow-cn-1` | Resting controls: buttons at rest, form inputs, tooltips |
| `shadow-cn-2` | Default surfaces: cards, resting dropdowns and popovers |
| `shadow-cn-3` | Raised/interactive: hover-elevated cards, toasts |
| `shadow-cn-4` | Floating layers: popovers, dropdown menus, sheets |
| `shadow-cn-5` | Modals and large overlays |
| `shadow-cn-6` | Maximum emphasis — rarely justified |

There is also `inner-canvas`, an inset shadow for recessed canvas areas, not part of the elevation ramp.

**Why:** Elevation is a shared spatial language. If a dropdown uses a heavier shadow than the modal above it, the stacking reads as wrong even when the z-index is right.

---

## Never write custom box-shadow

**Rule:** No raw `box-shadow` in component code or CSS — not even "just once". If no step fits, the right fix is a new token, not a local value.

**Why:** Shadow colour and opacity are theme-dependent (below). A hand-written shadow is correct in exactly one theme and wrong in the other.

---

## Shadow colour changes between light and dark; geometry does not

**Rule:** Light and dark themes share identical shadow geometry (offset, blur, spread) but differ sharply in colour: light shadows are grey at **8–20% alpha**, dark shadows are pure black at **50–60% alpha**. This is handled inside the token — you get it for free by using `shadow-cn-*`.

**Rule:** Don't compensate for dark mode by swapping to a heavier shadow step in dark theme. The token already accounts for it; changing steps changes the layer meaning.

**Why:** Shadows need far more opacity to read against a dark surface. Encoding that in the token keeps component code theme-agnostic.

---

## Pair elevation with radius from the shared scale

**Rule:** Elevated surfaces use border-radius from the `rounded-cn-*` scale (`cn-1` 2px, `cn-2` 4px, `cn-3` 6px, `cn-4` 8px, `cn-5` 12px, `cn-6` 16px, `cn-7` 24px, plus `cn-full`), not arbitrary values. Where a component defines its own radius token (`--cn-card-md-radius`, `--cn-popover-radius`, `--cn-dropdown-radius`), use that — it resolves to the scale while allowing per-component tuning.

---

## Shadow is not a substitute for a border or a focus ring

**Rule:** Don't use shadow to indicate focus, validation state, or selection. Focus uses the focus-ring token; state uses border and colour tokens. The `shadow-cn-ring-*` tokens that exist are state rings, not elevation — don't mix them into the elevation ramp.

**Why:** Shadows are invisible in high-contrast and forced-colors modes, so state carried only by shadow disappears.

---

## Known gaps & verifications needed

- **Step 6 is effectively unused:** No current component uses `shadow-cn-6`. Treat its use as requiring justification.
- **Hover elevation isn't systematized:** Elevating a card on hover (2 → 3) is a convention, not an enforced rule; components vary.

---

## Cross-references

- **Color System** — Theme resolution, alpha modifiers
- **Interaction States** — Focus ring, hover and selected treatment
- **Accessibility** — Forced-colors and high-contrast behaviour
