# Text Pattern Guide

> Props, values and defaults are in [props.json](./props.json). This file is judgment only:
> when to use it, how to compose it, and known gaps.
>
> **Draft.** Derived from code, docs and usage counts, not designer intent. `TODO(review)` marks
> a call a designer must confirm before this ships.

## Contents

- [Overview](#overview): what Text is and when it is the right component
- [Decision Framework: which Text?](#decision-framework): choose between Text and its neighbours
- [Choosing a variant](#choosing-a-variant): the three families and which to reach for
- [Choosing a color](#choosing-a-color): the foreground hierarchy and status colors
- [Truncating text](#truncating-text): `truncate`, `lineClamp` and keeping text recoverable
- [Do's and Don'ts](#dos-and-donts): quick rules
- [Examples](#examples): correct and incorrect usage
- [Accessibility](#accessibility): headings, color and truncation
- [Known Gaps](#known-gaps): what Text cannot do yet

---

## Overview

Text gives copy its type style. You pick one named `variant` that bundles size, weight and
line-height, so type stays on the scale and colors follow the light and dark themes. It also
chooses a default HTML element and a default color for each variant.

**Use when:**

- Any visible copy: headings, body, captions and code snippets
- You need single-line or multi-line truncation (`truncate`, `lineClamp`) rather than CSS

**Do not use when:**

- The text is a form field's label or helper text → the `FormInput.*` parts, not Text styled to look like one
- The text must be activated or navigate → **Button** or **Link** `TODO(review)`: confirm Link is the right neighbour
- The value shows system state or a stable attribute → **StatusBadge** or **Tag**, not coloured Text

---

## Decision Framework

| Question                                                    | Answer | Component         |
| ----------------------------------------------------------- | ------ | ----------------- |
| Is it plain copy with no container of its own?              | Yes    | Text              |
| Does a system process drive the value and the colour means good, bad or waiting? | Yes | StatusBadge |
| Is it a stable attribute such as a category, scope or tier? | Yes    | Tag               |
| Does the person activate it?                                | Yes    | Button or Link    |

### Ambiguous cases

- **"Active" or "Failed" next to an item** → **StatusBadge** if a system sets it. `color="success"` on Text is only for a sentence that reports status.
- **"Beta" or "New"** → **Tag**. Do not colour Text to fake a label.
- **Link-looking text** → **Link** or **Button** `TODO(review)`
- **A field label** → the form component's label, not Text

---

## Choosing a variant

Pick the variant by role, not by how big you want it. The set has three families.

- **Body** (`body-normal`, `body-strong`, `body-single-line-*`, `body-code*`): paragraphs, descriptions and cell content. `body-normal` is the default.
- **Caption** (`caption-normal`, `caption-strong`, `caption-single-line-normal`): metadata, timestamps and secondary information. These are the most used variants in the product.
- **Heading** (`heading-hero` down to `heading-small`): titles, in descending order of the scale. `heading-subsection` is the one the product uses most. `TODO(review)`: which level is the page title, a card title and a panel title?

Use a `-single-line-` variant for text that must not wrap (table cells, labels, chips) instead of adding `nowrap`.

Use a `-code` variant for code, IDs, hashes and logs; these render in the monospace family.

Four variants have no usage in the product: `heading-default`, `body-code-strong`, `caption-code` and
`caption-code-strong`. `TODO(review)`: keep, document or deprecate.

---

## Choosing a color

Color expresses emphasis, in the order `foreground-1` (strongest) to `foreground-4` (weakest). The default is
`foreground-2`, except heading variants, which default to `foreground-1`.

- `foreground-3` is the usual choice for secondary text, metadata and timestamps.
- `foreground-4` is for the lowest-emphasis supporting text.
- `disabled` is for disabled controls only.
- `success`, `warning` and `danger` are for text that reports status. They are never for emphasis or branding.
- `inherit` takes the color from a parent. `TODO(review)`: when is this appropriate?
- `merged` and `brand` have no guidance. `TODO(review)`

---

## Truncating text

Use `truncate` for one line and `lineClamp` (`1` to `6`) for several. If both are set, `lineClamp` wins. Both set
a native `title` with the full text unless you pass your own.

A `title` is not reachable by keyboard or touch. Truncated text must stay recoverable, so pair it
with a tooltip or expose the full text another way. Never truncate the only copy of information a
person needs.

---

## Do's and Don'ts

### ✅ Do

- Pick a named `variant` for every piece of copy
- Pass `as="h1"` to `as="h6"` when the text is a real heading
- Use the `color` prop for color, from the foreground hierarchy
- Use `truncate` or `lineClamp` for truncation, and make the full text recoverable
- Reserve `success`, `warning` and `danger` for text that reports status

### ❌ Don't

- Build type from `text-*`, `font-*` and `leading-*` classes
- Use a raw element (`<h2>`, `<p>`) with hand-written type instead of Text
- Use a palette color or `className` to restyle Text
- Add `nowrap` to a wrapping variant; use a `-single-line-` variant
- Use colored Text as a stand-in for a Tag or StatusBadge

---

## Examples

### ✅ Correct

A page title, with a real heading element:

```tsx
<Text as="h1" variant="heading-section">
  Pipelines
</Text>
```

Secondary metadata:

```tsx
<Text variant="caption-normal" color="foreground-3">
  Updated 3 minutes ago
</Text>
```

A table cell that must not wrap, with recoverable text:

```tsx
<Text variant="body-single-line-normal" truncate>
  {name}
</Text>
```

A sentence that reports status:

```tsx
<Text variant="body-normal" color="danger">
  The deployment failed. Check the logs and retry.
</Text>
```

### ❌ Incorrect

Hand-composed type on a raw element. Use `Text` with a `variant`:

```tsx
<h2 className="text-[20px] font-semibold leading-7">{title}</h2>
```

Status color used as a label. Use **Tag**:

```tsx
<Text color="danger">Beta</Text>
```

Palette color and `className` restyle. Use the `color` prop:

```tsx
<Text className="text-red-500">Failed</Text>
```

---

## Accessibility

`TODO(review)`: **Heading semantics are unresolved.** The typography foundation says heading variants
render as plain `<p>` and you must pass `as` for a real heading. The component, however, adds
`role="heading"` to any heading variant when `as` is not passed, with no `aria-level`, which is level 2 by
default. Until this is settled, always pass `as="h1"` to `as="h6"` for a real heading so the outline is correct.

- Never carry meaning by color alone. `success`, `warning` and `danger` text needs words or an icon that say the same thing.
- `foreground-3` and `foreground-4` are lower emphasis. `TODO(review)`: confirm they meet 4.5:1 on every surface before using them for required information.
- Do not fix text heights. Text must resize with the user's settings.
- A native `title` on truncated text does not help keyboard or touch users. Add a tooltip or another route to the full text.

---

## Known Gaps

- There is no mobile type scale. A variant renders at the same size at every viewport width.
- Deprecated font-weight tokens (300, 500, 700) still resolve, so using them fails silently. Lint does not catch it.
- There is no `caption-single-line-strong` variant.
- The `color` default depends on the variant. `props.json` states `foreground-2`, which is only the default for non-heading variants.
- A variant that has been removed falls back silently to `body-normal`.
- `TODO(review)`: **Upstream docs to fix, not this guide.** `foundations/typography.md` omits `body-code-strong` and `caption-code-strong`, which exist in the component.
