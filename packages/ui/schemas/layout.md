# Layout Pattern Guide

**Manifest ID:** `canary.layout`
**Status:** stable
**Last Updated:** 2026-10-27

> **This file is hand-written judgment only.**
>
> Prop names, enum values, defaults, and tokens live in
> [`layout.manifest.json`](./layout.manifest.json) and are published to
> [`layout.openapi.json`](./layout.openapi.json), which is **generated**.
> Don't copy them here.

---

## Overview

Layout is the **only sanctioned way to put space between elements**. It is a namespace of four
wrappers — `Layout.Horizontal`, `Layout.Vertical`, `Layout.Flex`, `Layout.Grid` — each emitting
a plain `div` with display, alignment and a gap drawn from the layout token scale.

Its whole job is to keep spacing in the token system. A hand-written `flex gap-4` is a number
frozen into a class name: it cannot move when the scale moves, and nothing can audit it. A
`gap="md"` can and is.

**Use when:**

- Two or more elements need space between them
- You would otherwise reach for a raw flex or grid utility plus a hand-picked gap

**Do not use when:**

- A component already arranges its own children — `ButtonGroup`, `ButtonLayout`, `Table`,
  `Card` and the form primitives own their internal spacing, and wrapping their slots fights
  them
- A single element needs margin from its neighbour — put the gap on the shared parent, where it
  cannot drift
- You need positioning (`absolute`, `sticky`, `fixed`), overflow or a scroll container — those
  go in `className`; Layout emits none of them
- You are spacing text inside a paragraph or list — that is typography's job

---

## Decision Framework: which member?

| Question                                                         | Answer | Member             |
| ---------------------------------------------------------------- | ------ | ------------------ |
| Is it a row?                                                     | Yes    | `Layout.Horizontal` |
| Is it a column?                                                  | Yes    | `Layout.Vertical`   |
| Does it need `row-reverse` / `column-reverse`?                   | Yes    | `Layout.Flex`       |
| Do items need to line up in **both** directions?                 | Yes    | `Layout.Grid`       |

**Reach for `Horizontal` and `Vertical` first.** They cover nearly every case, they read as
what they are at the call site, and they are the only two that default to a sensible gap.

`Flex` is for the two reversed directions and nothing else. `Flex direction="row"` is just a
`Horizontal` that has quietly lost its gap (LYT-001).

`Grid` is for genuine two-dimensional alignment — a card gallery, a form whose labels line up
down a column. A single row or column in a `Grid` is a `Horizontal` or `Vertical` written the
hard way.

### Ambiguous cases

- **A row that must wrap** (tags, chips, filters) → `Horizontal` with `wrap="wrap"` **and**
  `gapY`. Without `gapY` the wrapped lines sit flush
- **A responsive card gallery** → `Grid` with
  `columns="repeat(auto-fit, minmax(16rem, 1fr))"`, not a wrapping `Horizontal`. The grid keeps
  the cards aligned; the flex row leaves a ragged last line
- **A toolbar with a left group and a right group** → one `Horizontal` with
  `justify="between"`, holding two nested `Horizontal`s. Not margins, and not a spacer div
- **A page section stack** → `Vertical` with a larger gap (`xl`, `2xl`). Section rhythm is still
  a gap, not a margin on each section

---

## The gap default trap

This is the single thing to remember about this component:

| Member              | Default gap        |
| ------------------- | ------------------ |
| `Layout.Horizontal` | `md`               |
| `Layout.Vertical`   | `md`               |
| `Layout.Flex`       | **none at all**    |
| `Layout.Grid`       | **none at all**    |

`Flex` and `Grid` render flush unless you pass a gap, and nothing warns you (LYT-001). Two
consequences:

- **Always pass `gap` explicitly on `Flex` and `Grid`.** Including `gap="none"` when you really
  do want flush — then the intent is visible to the next reader
- **Swapping `Horizontal` for `Flex` silently removes all spacing.** The diff looks like a
  direction change; it is also a spacing change

Pass **either** `gap` **or** the `gapX`/`gapY` pair, never both. The type permits both and the
outcome then depends on stylesheet order rather than anything visible at the call site
(LYT-002).

---

## Grid escape hatches

`columns`, `rows` and `flow` are applied as **inline styles**, because Tailwind cannot generate
a utility for a value only known at runtime. That has three effects worth knowing:

1. They beat any `className`, and a consumer cannot override them with a class
2. They sit **outside the token system** — `columns="320px 1fr"` is accepted with no warning
   (LYT-003)
3. `columns={3}` is the safe form: a number becomes that many equal columns

When you pass a string, keep every length in `rem` or `fr`. A `px` track is a raw value in a
system that otherwise has none.

---

## Do's and Don'ts

### ✅ Do

- **Reach for `Horizontal` / `Vertical` before `Flex`**
- **Pass `gap` explicitly on `Flex` and `Grid`**, every time
- **Pass `gapY` on any wrapping row**, or the wrapped lines touch
- **Pass `align="center"` on a row of mixed-height items** — a label beside a control, an icon
  beside text. The default stretch is rarely what a row wants
- **Nest Layouts rather than reaching for margins.** A toolbar of two groups is two
  `Horizontal`s inside a `justify="between"` `Horizontal`
- **Put positioning, sizing and overflow in `className`.** That is what it is for here

### ❌ Don't

- **Don't put a gap in `className`.** `className="gap-4"` is exactly the frozen number this
  component exists to remove, and it may or may not win against the gap classes
- **Don't put padding on a Layout.** Padding belongs to the thing being laid out — a Card's
  own inset, a page shell's gutter — not to the arrangement
- **Don't use `row-reverse` / `column-reverse` around anything interactive.** Reading order
  then disagrees with DOM order, which is what tab sequence and screen readers follow (LYT-006)
- **Don't expect `grow` to grow the children.** It sets `flex-grow` on the container itself
  (LYT-007). For children, put the grow on the child, or use a `Grid` with sized tracks
- **Don't wrap a component's own slots in a Layout** to re-space them. Fix the component, or
  use the one that already does what you need
- **Don't use a Layout as a landmark.** It emits no `nav`, `list` or `group` semantics — a
  navigation region or list needs the right element around it

---

## Examples

### ✅ Correct

```tsx
// A row of a label and a control — align, not the stretch default
<Layout.Horizontal gap="sm" align="center">
  <IconV2 name="info-circle" />
  <Text>Pipeline is running</Text>
</Layout.Horizontal>

// A form stack
<Layout.Vertical gap="lg">
  <FormField name="name" />
  <FormField name="description" />
</Layout.Vertical>

// A wrapping row — gapY is what keeps the wrapped lines apart
<Layout.Horizontal gapX="xs" gapY="xs" wrap="wrap">
  <Tag value="react" />
  <Tag value="vite" />
  <Tag value="tailwind" />
</Layout.Horizontal>

// A responsive gallery that stays aligned
<Layout.Grid columns="repeat(auto-fit, minmax(16rem, 1fr))" gap="lg">
  <Card />
  <Card />
  <Card />
</Layout.Grid>

// A header: two groups, pushed apart, nested
<Layout.Horizontal justify="between" align="center" gap="md">
  <Text>Pipelines</Text>
  <Layout.Horizontal gap="xs">
    <Button variant="outline">Import</Button>
    <Button>New pipeline</Button>
  </Layout.Horizontal>
</Layout.Horizontal>
```

### ❌ Incorrect

```tsx
// ❌ Don't: Flex has no gap default — these buttons touch (LYT-001)
<Layout.Flex direction="row">
  <Button>Save</Button>
  <Button>Cancel</Button>
</Layout.Flex>

// ❌ Don't: gap and gapX together, outcome decided by stylesheet order (LYT-002)
<Layout.Horizontal gap="md" gapX="sm">…</Layout.Horizontal>

// ❌ Don't: a frozen number, and it may lose to the gap classes anyway
<Layout.Horizontal className="gap-4">…</Layout.Horizontal>

// ❌ Don't: a raw px track, outside the token system (LYT-003)
<Layout.Grid columns="320px 1fr" gap="md">
  <Sidebar />
  <Main />
</Layout.Grid>

// ❌ Don't: reading order now disagrees with tab order (LYT-006)
<Layout.Horizontal direction="row-reverse" gap="sm">
  <Button>Back</Button>
  <Button>Next</Button>
</Layout.Horizontal>

// ❌ Don't: a row of tags with no wrap — it overflows instead of wrapping
<Layout.Horizontal gap="xs">
  <Tag value="react" />
  <Tag value="vite" />
  <Tag value="tailwind" />
</Layout.Horizontal>
```

---

## Accessibility

Layout is presentational and contributes no semantics. Two things are still on you:

- **Keep reading order and DOM order in agreement.** `row-reverse` and `column-reverse` break
  that, and tab sequence and screen readers follow the DOM (LYT-006)
- **Add the semantics yourself.** A Layout is not a `nav`, a `ul`, a `[role="toolbar"]` or a
  `[role="group"]`. If the arrangement means something — a navigation region, a list of items, a
  group of related controls — put the right element or role around it. A row of buttons that
  looks like a toolbar is announced as nothing at all

---

## Known Gaps

- [ ] **LYT-001:** Gap defaults are inconsistent across the namespace. `Horizontal` and
      `Vertical` default to `md`; `Flex` and `Grid` have no default and render flush. Swapping
      `Horizontal` for `Flex direction="row"` silently removes all spacing
- [ ] **LYT-002:** `gap` and `gapX`/`gapY` are not mutually exclusive in the type; passing both
      emits both class sets and the outcome depends on stylesheet order
- [ ] **LYT-003:** `columns`, `rows` and `flow` are inline styles, so they beat any `className`,
      cannot be overridden by a consumer, and sit outside the token system —
      `columns="320px 1fr"` is accepted with no warning
- [ ] **LYT-004:** No Figma component and no Code Connect file. Arrangement is expressed as
      auto-layout on a plain frame, so design and code cannot be checked against each other
- [ ] **LYT-005:** Layout emits no class of its own, so there is no `cn-layout` hook to target
      in a stylesheet or to find in the built CSS
- [ ] **LYT-006:** `row-reverse` and `column-reverse` decouple visual order from DOM order, and
      nothing in the API warns about it
- [ ] **LYT-007:** `grow` sets `flex-grow` on the container, not the children, and is routinely
      mistaken for the latter. There is no prop for growing children
- [ ] **LYT-008:** The JSDoc gap table in the source maps each size straight to a
      `--cn-spacing-*` value, skipping the `--cn-layout-*` alias the utilities actually
      reference. Correct today, stale the moment the alias layer is retargeted

---

## How to Contribute

### Adding a size, prop, or namespace member

1. Update [`layout.manifest.json`](./layout.manifest.json) — the single source of truth
2. Run `pnpm ds-check --write` to regenerate the OpenAPI spec
3. Update the guidance in this file if the change affects *when* to use it
4. Run `pnpm ds-check` and commit both files together

A new gap size needs a `--cn-layout-*` alias and a matching `gap-cn-*` utility, not just a CVA
entry — otherwise the class is emitted and resolves to nothing.

**Never hand-edit `layout.openapi.json`.** It is generated.

### Reporting issues

- Spacing drift → file in Jira (XD project)
- A gap you cannot express → check `docs/system/spacing.md` before adding a size; the scale is
  deliberately coarse

---

## References

- **Source:** `packages/ui/src/components/layout.tsx`
- **Spacing rules:** `docs/system/spacing.md` — the token scale and when to use which step
- **Manifest (authored):** [`layout.manifest.json`](./layout.manifest.json)
- **OpenAPI spec (generated):** [`layout.openapi.json`](./layout.openapi.json)
- **Code Connect:** none — there is no Figma Layout component (LYT-004)
- **System rules:** `docs/system/`

---

## Questions?

See [AGENTS.md](../AGENTS.md) for the discovery workflow, or ask @design-systems on Slack.
