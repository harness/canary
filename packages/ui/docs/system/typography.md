---
title: Typography Rules
description: Font families, the composite type scale, text color hierarchy, and truncation
---

Global typography rules. The system is **composite-first**: you pick a named variant, not individual font properties.

## Use composite typography variants, never individual font properties

**Rule:** Typography is applied as a single named variant that bundles font-size, weight, line-height, and letter-spacing together. Use the `font-*` utility (or the `Text` component's `variant` prop) — don't compose type from `text-*` + `font-semibold` + `leading-*` by hand.

The variants are three families:
- **Headings:** `heading-hero`, `heading-section`, `heading-default`, `heading-subsection`, `heading-base`, `heading-small`
- **Body:** `body-normal`, `body-strong`, `body-single-line-normal`, `body-single-line-strong`, `body-code`
- **Captions:** `caption-normal`, `caption-strong`, `caption-single-line-normal`, `caption-code`

**Why:** A variant guarantees a type-correct combination. Hand-composing produces off-scale pairings (e.g. a 14px size on a 36px line-height) that no token can catch.

**Note:** The `-single-line-` variants exist for text that must not wrap (table cells, labels, chips). Use them instead of applying `whitespace-nowrap` to a wrapping variant.

---

## Prefer the `Text` component over raw elements

**Rule:** Use `<Text>` for text content. It applies the variant, picks a sensible default HTML element per variant (headings → `<p>` unless you pass `as`, captions → `<span>`, code → `<pre>`/`<span>`), and applies the matching default color.

```tsx
// ✓ Variant + semantic element
<Text as="h2" variant="heading-subsection">{title}</Text>

// ✗ Hand-composed type
<h2 className="text-[20px] font-semibold leading-7">{title}</h2>
```

**Important:** The default element is *not* a heading tag. Document structure is your responsibility — pass `as="h1".."h6"` when the text is a real heading, or screen-reader users get no outline.

---

## Two font families, two weights

**Rule:** There are exactly two families — `fontFamily.default` (Inter, for all UI) and `fontFamily.mono` (JetBrains Mono, for code, IDs, hashes, and log output). Mono is reached through the `*-code` variants, not by applying a font-family directly.

**Rule:** New work uses two weights only: **400** (regular) and **600** (semibold). The `300`, `500`, and `700` weight tokens are **deprecated** — don't use them in new components.

**Why:** Inter is rendered with optical-size weights (400 → 400, 600 → 530); the deprecated steps sat between those and produced inconsistent rendering across platforms.

---

## Text color follows the semantic foreground hierarchy

**Rule:** Text color comes from the foreground hierarchy, via `Text`'s `color` prop or the `text-cn-*` utilities — never a raw color. The levels are emphasis, not decoration:

| Level | Use for |
|---|---|
| `foreground-1` | Headings, max-emphasis text |
| `foreground-2` | Body text (default) |
| `foreground-3` | Secondary text, metadata, timestamps |
| `foreground-4` | Lowest-emphasis supporting text |
| `disabled` | Disabled controls only |

Status colors (`success`, `warning`, `danger`) are for text that *conveys status* — not for emphasis or branding.

**Why:** See Color System — these resolve per theme, so a raw color breaks light/dark switching.

---

## Truncate with the component's props, not CSS

**Rule:** Use `Text`'s `truncate` (single line) or `lineClamp` (1–6 lines) props rather than hand-written `text-ellipsis` / `-webkit-line-clamp` CSS.

**Rule:** Truncated text must remain recoverable — pair truncation with a tooltip or an accessible full-text label. Never truncate the only copy of information the user needs.

---

## Known gaps & verifications needed

- **Responsive type:** The composite variants are currently defined for the desktop breakpoint only. There is no mobile type scale — a variant renders at the same size at every viewport width.
- **Deprecated weights still resolve:** The deprecated 300/500/700 tokens are still emitted, so using them fails silently rather than erroring. Lint doesn't catch it; review does.

---

## Cross-references

- **Color System** — Semantic foreground tokens, theme resolution
- **Accessibility** — Heading structure, contrast requirements, text resizing
- **Spacing** — Line-height sits on the same 4px grid as spacing
