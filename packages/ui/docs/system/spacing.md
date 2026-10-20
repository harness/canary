---
title: Spacing Rules
description: The 4px-based spacing scale, t-shirt layout aliases, and padding/margin/gap usage
---

Global spacing rules. Everything derives from a **4px base unit**.

## Use the t-shirt layout aliases for component spacing

**Rule:** Padding, margin, and gap use the `cn-*` t-shirt aliases, not raw numeric spacing tokens and never raw pixels:

| Alias | Value | Alias | Value |
|---|---|---|---|
| `cn-4xs` | 2px | `cn-lg` | 20px |
| `cn-3xs` | 4px | `cn-xl` | 24px |
| `cn-2xs` | 6px | `cn-2xl` | 32px |
| `cn-xs` | 8px | `cn-3xl` | 40px |
| `cn-sm` | 12px | `cn-4xl` | 80px |
| `cn-md` | 16px | | |

```tsx
// ✓ Token aliases
<div className="flex gap-cn-sm p-cn-md" />

// ✗ Arbitrary pixels
<div className="flex gap-[13px] p-[17px]" />
```

**Why:** The alias layer is the stable contract. The underlying numeric scale (`spacing.0`–`spacing.96`, plus `-half` steps) is a complete 4px ramp with far more steps than any layout needs — picking from it directly reintroduces the inconsistency the scale was meant to remove.

**Note:** The full numeric scale exists for *token authoring* (defining a new component's internal metrics), not for application-level layout.

---

## Prefer gap over margin for spacing between siblings

**Rule:** Space sibling elements with flex/grid `gap-cn-*` on the parent, not margins on the children. Reach for margin only when spacing genuinely belongs to one element and can't be expressed by the container.

**Why:** Gap keeps spacing in one place, has no collapsing behaviour, and doesn't leave a stray leading/trailing margin when items are conditionally rendered.

---

## Use the Layout primitives rather than re-deriving flex containers

**Rule:** For common arrangements use `Layout.Horizontal`, `Layout.Vertical`, `Layout.Flex`, and `Layout.Grid`, whose `gap` / `gapX` / `gapY` props accept the same t-shirt sizes (`none` | `4xs`…`4xl`).

**Why:** The props are type-checked against the scale, so an off-scale value can't compile — stronger than a className that's only caught in review.

---

## Page and shell spacing come from dedicated tokens

**Rule:** Don't hand-pad page-level containers. The framing metrics are tokens:
- Page container padding — 16px both axes, applied via `.cn-page-content` / `.cn-page-content-pt`
- Shell outer padding (`--cn-shell-container`) — 8px
- Gap between shell panels (`--cn-shell-gap`) — 12px

**Why:** These must stay in lockstep with the app shell across products. A locally-chosen page padding produces visible seams where panels meet.

---

## Known gaps & verifications needed

- **Spacer uses margin, not height:** The `Spacer` component renders margin-top rather than a sized box, and takes raw numeric scale values rather than t-shirt sizes — it's inconsistent with the rest of this doc. Prefer `gap-cn-*` on the parent; treat `Spacer` as legacy.
- **Arbitrary values for sizing:** Components do still use arbitrary brackets for fixed widths/heights and absolute positioning (e.g. `w-[600px]`, `top-[61px]`). This rule governs padding/margin/gap, where adoption is consistent; sizing is not yet fully tokenized.
- **No responsive spacing:** There is no desktop-vs-mobile spacing variation in the token set. Tokens are authored for a desktop breakpoint set only.

---

## Cross-references

- **Typography** — Line-height shares the same 4px grid
