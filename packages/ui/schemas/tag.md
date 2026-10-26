# Tag Pattern Guide

**Manifest ID:** `canary.tag`
**Status:** stable
**Last Updated:** 2026-10-26

> **This file is hand-written judgment only.**
>
> Prop names, enum values, defaults, and tokens live in
> [`tag.manifest.json`](./tag.manifest.json) and are published to
> [`tag.openapi.json`](./tag.openapi.json), which is **generated**.
> Don't copy them here.

---

## Overview

Tag labels a **stable attribute** — what something _is_, not what state it is in. The colour
is decorative: it groups and distinguishes, it does not evaluate. `theme="purple"` means
"this category is purple", not "this is good" or "this is broken".

**Use when:**

- The value is a category, scope, tier, environment, language, or marketing label
- The value is fixed for the life of the object, or changes only when a person edits it
- You want a key/value pair rendered as one unit (`label` + `value`)
- You need a removable chip — a filter, a selected item, a token in an input

**Do not use when:**

- A system process drives the value, or the colour implies good/bad/waiting → **StatusBadge**
- You need a count → **CounterBadge**
- The thing must be clickable and keyboard-operable → **Button**. See TAG-001; this is not
  a styling preference, it is a hard limit of the component

---

## Decision Framework: Tag vs StatusBadge

StatusBadge's guide and this one are two halves of one decision. The short version:

| Question                                                  | Answer | Component          |
| --------------------------------------------------------- | ------ | ------------------ |
| Does the value change automatically via a system process? | Yes    | StatusBadge        |
| Does the colour choice imply good / bad / waiting?        | Yes    | StatusBadge        |
| Does it describe what something _is_, with no lifecycle?  | Yes    | Tag                |
| Does the user need to remove it?                          | Yes    | Tag (`actionIcon`) |

### Ambiguous cases

- **Account tier** (Free/Pro/Enterprise) → **Tag** — a ranked category, not evaluative
- **Scope** (Public/Private/Internal) → **Tag** with `icon` — descriptive, not state
- **Marketing labels** ("Beta", "New") → **Tag** — informational, no lifecycle
- **Decorative purple** → **Tag** — StatusBadge's purple is `merged` and carries
  merged-state meaning; Tag's `purple` carries none
- **Connectivity** (online/offline) → **StatusBadge** — system-driven and evaluative

---

## Theme vocabulary: decorative names, three semantic traps

Tag's themes are **colour names**, so a request for "a blue tag" translates directly. There
is no vocabulary table to learn — with three exceptions, where a decorative colour name is
wired to a semantic colour set:

| Prop value | Resolves to the colour set | Why it matters                                       |
| ---------- | -------------------------- | ---------------------------------------------------- |
| `green`    | `success`                  | A green tag is visually identical to a success state |
| `red`      | `danger`                   | A red tag is visually identical to a failure state   |
| `yellow`   | `warning`                  | A yellow tag is visually identical to a warning      |

**Pass the colour name, never the semantic name.** `theme="success"`, `theme="danger"`,
`theme="error"` and `theme="warning"` are not valid Tag values and will not compile.

**And think before reaching for those three at all.** They read as status to every user who
has seen a StatusBadge elsewhere in the product, so a `green` tag on a stable attribute
tells people something is passing when nothing is. If the attribute genuinely has no
evaluative meaning, prefer `mint`, `forest-green`, `brown` or `orange` and leave the three
status colours to status.

`forest-green` and `lime` exist in code but not in the Figma component (TAG-005). They are
valid to use; a designer just cannot specify them yet.

---

## The split tag: `label` + `value`

Passing **both** `label` and `value` silently changes what Tag renders. It stops being one
element and becomes an internal two-tag composite — `label` on the left, `value` on the
right, joined on a shared square edge.

This is the right way to render a key/value pair, and it is the single biggest source of
surprise in this component, because the mode switch changes which props are honoured:

| Prop                                           | Single tag                 | Split tag                                         |
| ---------------------------------------------- | -------------------------- | ------------------------------------------------- |
| `icon`                                         | before the text            | left half only                                    |
| `actionIcon` / `onActionClick`                 | after the text             | right half only                                   |
| `enableHover`                                  | honoured                   | **overwritten** with `Boolean(onClick)` (TAG-004) |
| `title`                                        | native tooltip on the text | **dropped** (TAG-003)                             |
| `iconProps`                                    | passed to IconV2           | **dropped** (TAG-003)                             |
| `id`, `data-*`, `aria-*`, other DOM attributes | forwarded to the root      | **dropped** (TAG-003)                             |
| `onClick`                                      | forwarded to the root      | attached to **both** halves                       |
| `className`                                    | the tag root               | the split wrapper                                 |
| `labelClassName` / `valueClassName`            | no effect                  | the left / right half                             |

If you need any of the dropped props on a key/value pair, compose two Tags yourself rather
than fighting the split path.

---

## Do's and Don'ts

### ✅ Do

- **Always pass `value`.** It is the only required prop, and it carries the meaning —
  colour and icon are reinforcement only
- **Use `label` + `value` for key/value pairs**, not two adjacent Tags with manual spacing
- **Keep tag text short.** The root has a max-width and truncates; the native `title`
  fallback (`title || value || label`) is what makes truncated text recoverable, so do not
  pass an empty `title` to suppress it
- **Use `actionIcon` + `onActionClick` for dismissal.** The handler already calls
  `stopPropagation()` and `preventDefault()`, so a dismiss click will not also fire the
  tag's `onClick`
- **Reach for `Button` the moment the tag must be activated by keyboard** (TAG-001)

### ❌ Don't

- **Don't use it for system-driven state** — that's StatusBadge's job
- **Don't pass a semantic colour name.** `success`, `danger`, `warning` and `error` are not
  Tag themes; the values are `green`, `red` and `yellow` (and prefer a non-status colour)
- **Don't make a Tag the only way to perform an action.** `onClick` on a Tag produces a
  `div` with no `role` and no `tabIndex`, unreachable by keyboard and unannounced by a
  screen reader. The type omits both attributes, so you cannot patch it from the call site
- **Don't rely on `disabled` to prevent interaction.** It is visual state only — it sets no
  `aria-disabled` and does not stop `onClick` (TAG-007). Stop passing the handler instead
- **Don't pass children.** They are accepted by the inherited DOM attribute type and never
  rendered (TAG-006); the text comes from `value` / `label`
- **Don't stack tags without a wrapper that handles wrapping.** Tag is `inline-flex` with
  `w-fit`; a row of them needs its own flex container with a gap

---

## Examples

### ✅ Correct

```tsx
// A stable attribute, decorative colour
<Tag variant="outline" theme="blue" value="Production" />

// A key/value pair as one unit
<Tag variant="secondary" theme="purple" size="sm" label="env" value="staging" />

// A removable filter chip
<Tag theme="gray" value="react" actionIcon="xmark" onActionClick={() => remove('react')} />

// Reinforcing icon, pill shape
<Tag variant="outline" theme="mint" icon="sparks" value="Beta" rounded />

// A clickable key/value pair — hover comes from onClick, not enableHover
<Tag theme="indigo" label="repo" value="canary" onClick={openRepo} />
```

### ❌ Incorrect

```tsx
// ❌ Don't: 'error' is not a theme — nor is 'success', 'danger' or 'warning'
<Tag theme="error" value="Failed" />

// ❌ Don't: a status belongs in StatusBadge; a green tag just looks like one
<Tag theme="green" value="Succeeded" />

// ❌ Don't: the only affordance for an action, with no keyboard path (TAG-001)
<Tag value="Delete" onClick={remove} />

// ❌ Don't: enableHover is overwritten in split mode (TAG-004)
<Tag label="env" value="prod" enableHover />

// ❌ Don't: title is dropped in split mode (TAG-003)
<Tag label="env" value="prod" title="Environment" />

// ❌ Don't: children are never rendered (TAG-006)
<Tag theme="blue" value="x">Label as children</Tag>
```

---

## Accessibility

What a consumer of this component must do:

- **Put the meaning in `value`** (and `label`). The tag is a plain `div` announced as text;
  colour is not a signal, and the icon carries no name
- **Do not build an interactive control out of it.** `role` and `tabIndex` are omitted from
  the prop type. A Tag with `onClick` is a mouse-only affordance — provide the same action
  through a real control as well, or use `Button` instead (TAG-001)
- **Know that the dismiss button is unnamed.** It is a focusable `<button>` with an
  unlabelled icon and tooltips suppressed, so assistive technology announces nothing useful
  (TAG-002). Until that is fixed, do not make dismissal the only way to remove the item
- **Announce list changes yourself.** Removing a tag from a filter row changes content
  elsewhere; wrap the affected region in `aria-live="polite"` if the change is not obvious

---

## Known Gaps

- [ ] **TAG-001:** A clickable Tag is not keyboard-operable, and `role` / `tabIndex` are
      omitted from the type so no consumer can fix it. Needs either an interactive variant
      or an explicit "use Button" rule in the API
- [ ] **TAG-002:** The action button has no accessible name — `iconOnly` with
      `ignoreIconOnlyTooltip` and an unlabelled icon, and Tag exposes no prop to label it
- [ ] **TAG-003:** Split mode forwards only `onClick`; `id`, `data-*`, `aria-*`, `title`
      and `iconProps` are silently discarded
- [ ] **TAG-004:** Split mode overwrites `enableHover` with `Boolean(onClick)`
- [ ] **TAG-005:** `forest-green` and `lime` have no Figma theme variant, so a design cannot
      specify them and Code Connect cannot produce them
- [ ] **TAG-006:** `children` is accepted by the type and never rendered
- [ ] **TAG-007:** `disabled` sets no `aria-disabled` and does not stop `onClick`

---

## How to Contribute

### Adding a variant, theme, or prop

1. Update [`tag.manifest.json`](./tag.manifest.json) — the single source of truth
2. Run `pnpm ds-check --write` to regenerate the OpenAPI spec
3. Update the examples and guidance in this file if the change affects _when_ to use it
4. Run `pnpm ds-check` and commit both files together

**Never hand-edit `tag.openapi.json`.** It is generated; the next regeneration discards your
change.

### Reporting issues

- Design drift → file in Jira (XD project)
- Accessibility gap → add to Known Gaps with a workaround
- Figma/code mismatch → check `tag.figma.ts` first; it records what Figma actually exposes

---

## References

- **Source:** `packages/ui/src/components/tag.tsx`
- **Styles:** `packages/ui/tailwind-utils-config/components/tag.ts`
- **Code Connect:** `packages/ui/src/components/tag.figma.ts`
- **Manifest (authored):** [`tag.manifest.json`](./tag.manifest.json)
- **OpenAPI spec (generated):** [`tag.openapi.json`](./tag.openapi.json)
- **Counterpart guide:** [`status-badge.md`](./status-badge.md)
- **System rules:** `docs/system/`

---

## Questions?

See [AGENTS.md](../AGENTS.md) for the discovery workflow, or ask @design-systems on Slack.
