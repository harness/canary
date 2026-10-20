---
title: Accessibility Rules
description: WCAG 2.2 compliance rules for interactive controls, focus indicators, and status meaning
---

Global accessibility rules sourced from WCAG 2.2 and WAI-ARIA Authoring Practices Guide.

## Icon-only buttons need an accessible name

**Rule:** If a button contains only an icon (no text), it must have a programmatically-determinable accessible name. Don't rely on `aria-label` alone — `aria-labelledby`, an associated `<label>`, or `title` also work. The button element itself must have the name.

**Why:** WCAG 2.2 SC 4.1.2 (Name, Role, Value) + SC 1.1.1 (Non-text Content)  
**Also see:** Visual Primitives rule on decorative-vs-interactive graphics

---

## Decorative graphics must be hidden from screen readers

**Rule:** A purely decorative SVG/icon/logo/illustration must be invisible to assistive technology — use `aria-hidden="true"`, empty `alt`, or `role="presentation"`. Just leaving it unlabeled isn't enough; browsers may still expose it as an unnamed image.

**Why:** WCAG 2.2 SC 1.1.1 (Non-text Content)  
**Known gap:** IconV2, LogoV2, LogoSymbol, Illustration components don't enforce this by default — callers must add `aria-hidden` if the graphic is decorative.

---

## Tooltips provide descriptions, not accessible names

**Rule:** A tooltip only supplies an accessible *description* (via `aria-describedby`), never an accessible *name* (via `aria-labelledby`). A tooltip alone cannot give a control its required accessible name.

**Why:** WCAG 2.2 + WAI-ARIA Tooltip Pattern  
**Known gap:** IconWithTooltip renders a `<button>` with no `aria-label` and no visible text — the button has no accessible name. Add an `aria-label` prop to the button itself.

---

## Disabled elements are exempt from contrast requirements

**Rule:** Disabled/inactive controls don't need to meet the 3:1 contrast ratio. Using `opacity: 0.6` on a disabled element is WCAG-compliant by exemption.

**Why:** WCAG 2.2 SC 1.4.11 (Non-text Contrast)

---

## Focus indicators must be visible

**Rule:** Keyboard focus must have a visible indicator. Harness uses a defined focus ring token (`border.brand` + `borderWidth.2`). Don't build custom outlines — use the system token so focus stays consistent.

**Why:** WCAG 2.2 SC 2.4.7 (Focus Visible)  
**Note:** The focus ring's contrast ratio (3:1 against adjacent background) hasn't been independently verified — treat as an open verification item.

---

## Icon-only buttons need a 24×24 CSS px minimum hit area

**Rule:** Pointer targets (buttons, links, etc.) must be at least 24×24 CSS pixels. An accessible name alone doesn't satisfy this — it's a separate requirement. An icon-only button needs both the accessible name AND the minimum size.

**Why:** WCAG 2.2 SC 2.5.8 (Target Size)  
**Known gap:** IconWithTooltip's default button has no padding and the default icon is 18px — the hit area may be too small. Add padding or set a minimum size.

---

## Status meaning can't rely on color alone

**Rule:** Color must never be the only way to communicate status. Pair it with text, an icon, or a visual pattern (e.g., color + icon for "error", not just red).

**Why:** WCAG 2.2 SC 1.4.1 (Use of Color)  
**Example:** Don't use a red dot alone for an error state — add a label or icon as well.

---

## Cross-references

- **Visual Primitives** — Guidelines for icons, logos, illustrations (sizing, fallback behavior, accessibility)
- **Color System** — Semantic token usage, status colors
- **Interaction States** — Disabled, focus, hover/selected states
