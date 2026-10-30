# Button Pattern Guide

**Manifest ID:** `canary.button`
**Status:** stable
**Last Updated:** 2026-10-27

> **This file is hand-written judgment only.**
>
> Prop names, enum values, defaults, and tokens live in
> [`button.manifest.json`](./button.manifest.json) and are published to
> [`button.openapi.json`](./button.openapi.json), which is **generated**.
> Don't copy them here.

---

## Overview

Button is the library's **only** guaranteed-actionable control. It renders a real `<button>`,
so focus, tab order, `Enter`/`Space` activation and the `button` role all come for free. Every
other component that looks clickable — Tag, StatusBadge, a styled `div` — is a mouse-only
affordance. When something must be operable, it is a Button.

**Use when:**

- A person activates something: submit, save, cancel, delete, open a menu, run a pipeline
- The action is asynchronous and should show its own pending state — return a promise from
  `onClick` and the loading state is handled for you
- You need an icon-only affordance in a toolbar or table row

**Do not use when:**

- The target is a route or an external address → **Link**. `variant="link"` makes a Button
  _look_ like a link; it is still a `<button>`, so it cannot be middle-clicked, copied,
  opened in a new tab, or announced as a link
- The element only labels or describes → **Tag** / **StatusBadge**
- You need an on/off control → **Toggle** / **ToggleGroup**, which carry `aria-pressed`
- You are hand-rolling a split primary/dropdown pair or a row of related actions →
  **SplitButton**, **ButtonGroup**, **ButtonLayout**

---

## Decision Framework: which variant?

Variant is **emphasis**, not decoration. Pick it from the action's standing in the view, then
stop.

| Question                                                       | Answer | Variant       |
| -------------------------------------------------------------- | ------ | ------------- |
| Is this _the_ action the view exists for?                      | Yes    | `primary`     |
| Is it a real alternative sitting beside the primary?           | Yes    | `outline`     |
| Is it an alternative where `outline` genuinely cannot be used? | Yes    | `secondary`   |
| Is it a quiet action in a toolbar, table row, or card header?  | Yes    | `ghost`       |
| Is it initiated by or handing off to AI?                       | Yes    | `ai`          |
| Does it need to read as inline text inside a sentence?         | Yes    | `link`        |
| Do you need the behaviour with no chrome at all?               | Yes    | `transparent` |

**Bias order: `primary`, then `outline`, then `secondary`.** When picking a variant, reach for
`primary` first, `outline` second, and `secondary` last. It can look backwards, but it is the
design team's call, so don't swap `outline` for `secondary` on instinct. This is guidance, not
something the type or a check enforces.

**One `primary` per view or dialog.** Two primaries means neither is. If a view seems to need
two, one of them is a `secondary`.

### Ambiguous cases

- **Destructive confirm in a dialog** → `primary` with `theme="danger"`, not `secondary`. It
  is the action the dialog exists for; the theme carries the warning
- **"Cancel" beside a destructive confirm** → `outline`, so the safe choice is still clearly
  clickable rather than fading into the surface
- **A toolbar of equally-weighted icon actions** → all `ghost`. A `primary` in a toolbar
  reads as a trap
- **"Learn more" at the end of a paragraph** → neither. That is a **Link**
- **An AI action that is also destructive** → `ai`, and put the warning in the confirm step.
  `ai` takes no `theme` (BTN-003)

---

## Theme: semantic, and only on four variants

`theme` states what the action _means_ — success, danger, warning — and is not a palette.
Three traps:

| Trap                                    | What happens                                                                                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme` on `ai`, `link`, `transparent`  | **Hard rule for new code.** Button's type still accepts it (the theme is ignored); `StrictButtonProps` rejects it. These three are single-appearance by design and have no themes (BTN-003) |
| `theme="warning"`                       | Works in code and exists in Figma; Code Connect cannot map it yet (BTN-004)                                                                                                                 |
| `variant="primary"` + `theme="default"` | Resolves to the **brand** colour set, not gray. The default primary button is deliberately brand                                                                                            |

Reach for `danger` only when the action destroys or cannot be undone. A `danger` button on a
reversible action teaches people to ignore red.

---

## Icon-only buttons

An icon with no text has no accessible name unless you give it one. The type tries to force the
issue: writing the literal `iconOnly` makes `tooltipProps` required, unless you opt out with
`ignoreIconOnlyTooltip`. That guard has three holes, and all three are on you to close:

1. **A tooltip is not an accessible name** — Radix wires it as a description. The component
   now copies the tooltip's own text onto `aria-label` to close that gap, reading the text out
   of a string or simple ReactNode `content`; content with no text of its own still leaves the
   button nameless, and development builds log a warning for it (BTN-002)
2. **`tooltipProps={{}}` satisfies the type and renders nothing** (BTN-007)
3. **`size="2xs"` and `size="3xs"` drop any text child**, deliberately — they are for very tight
   spaces and composite components. Because they can never carry a visible label, give them a
   name with `aria-label` or `tooltipProps`. This is a suggestion, not a block: it still
   compiles without one, and development builds log a warning (BTN-001)

Pass exactly one `IconV2` child. In icon-only mode the children are filtered by display name and
only the first icon survives — a second icon, a count badge, or any text is discarded (BTN-008).

`ignoreIconOnlyTooltip` is for a button whose meaning is already unmistakable from immediately
adjacent text. It suppresses a type error, not the accessibility need.

---

## Async actions

`onClick` may return a promise. When it does, the button enters its loading state until the
promise settles — resolve _or_ reject — and is disabled throughout. So:

- **Don't hand-manage `loading` for an async handler.** Returning the promise is enough
- **Don't pass `loading` as a constant.** `loading` with no way out is a permanently dead
  button
- **Handle rejection inside the handler.** The component does not catch it; it only stops
  spinning
- Loading sets `data-loading` but **no `aria-busy` and no `aria-disabled`** (BTN-006). A screen
  reader user hears the control go unavailable with no signal that work is underway. If the
  wait is long enough to notice, announce it in a live region yourself

---

## Writing the label

These are content rules, from the Harness UX writing guidelines. None is checked by the type or
by `ds-check`.

- **One or two words, starting with an action verb.** "Start", "Continue", "Open", "Add",
  "Create". Or a verb plus the item it acts on: "Create pipeline", "Add stage"
- **A verb plus a brand or proper noun is allowed, sparingly.** "Sync Git"
- **Let the surrounding context carry the meaning.** A section header or page title already
  says what the button belongs to, so don't pad the label to repeat it
- **No terminal punctuation.** No period, exclamation point, question mark or colon
- **No articles.** "Create template", not "Create a template"
- **Sentence case.** Capitalize only the first word and proper nouns
- **Don't use ellipses** in a label
- **A primary button in a dialog or drawer names that surface's own action and matches its
  header.** Never a generic "Yes". A header reading "Discard changes?" gets a button reading
  "Discard"

---

## Do's and Don'ts

### ✅ Do

- **Label the action, not the mechanism.** "Save changes", "Run pipeline" — not "OK", "Submit"
- **Pass icons as children.** There is no `icon` prop; position is decided by child order
- **Pass `aria-label` on every icon-only button**, in addition to `tooltipProps`
- **Use `type="submit"` deliberately** for a form's submit control. Button defaults to
  `type="button"` precisely so an unrelated button in a form cannot submit it
- **Return the promise from async handlers** and let the component own the loading state
- **Keep `className` to layout** — width, margin, grid placement. Colour, radius, size and
  spacing all have props and tokens

### ❌ Don't

- **Don't use a Button to navigate.** `variant="link"` is a styled `<button>`; a route needs a
  real `Link`
- **Don't ship two `primary` buttons in one view**
- **Don't rely on `disabled` to explain unavailability.** A disabled button leaves the tab
  order, so a keyboard user may never find it to learn why. Put the reason in visible text, or
  keep the button enabled and explain on click
- **Don't put text in a `2xs`/`3xs` button** — it is dropped by design; name it instead (BTN-001)
- **Don't pass `theme` to `ai`, `link` or `transparent`** — they take none, and the theme
  is silently ignored. This one is a hard rule for new code (BTN-003)
- **Don't assume `asChild` keeps the button's behaviour.** The child owns the semantics, so
  `disabled` and `type` stop applying and a disabled `asChild` button is still clickable
  (BTN-009)
- **Don't override the focus ring.** It is the only way a keyboard user tracks position

---

## Examples

### ✅ Correct

```tsx
// The one expected action in the view
<Button onClick={save}>Save changes</Button>

// A real alternative beside it
<Button variant="outline" onClick={cancel}>Cancel</Button>

// Destructive, in the dialog that exists to confirm it
<Button theme="danger" onClick={remove}>Delete repository</Button>

// Async — loading is handled by the returned promise
<Button onClick={async () => await deploy()}>Deploy</Button>

// Icon-only: tooltip for sighted users, aria-label for everyone else
<Button iconOnly aria-label="Edit" tooltipProps={{ content: 'Edit' }} onClick={edit}>
  <IconV2 name="edit-pencil" />
</Button>

// Quiet toolbar action with a leading icon
<Button variant="ghost" size="xs" onClick={refresh}>
  <IconV2 name="refresh" />
  Refresh
</Button>

// A router link that should read as a button
<Button asChild>
  <Link to="/settings">Settings</Link>
</Button>
```

### ❌ Incorrect

```tsx
// ❌ Don't: the text is dropped and nothing names the button. It compiles, but warns in development (BTN-001)
<Button size="2xs">Save</Button>

// ❌ Don't: satisfies the type, renders no tooltip, names nothing (BTN-007, BTN-002)
<Button iconOnly tooltipProps={{}}>
  <IconV2 name="trash" />
</Button>

// ❌ Don't: link takes no theme. The theme is ignored, and `StrictButtonProps` rejects it (BTN-003)
<Button variant="link" theme="danger">Delete</Button>

// ❌ Don't: navigation is not an action — use Link
<Button variant="link" onClick={() => navigate('/settings')}>Settings</Button>

// ❌ Don't: a constant loading prop is a permanently dead button
<Button loading onClick={save}>Saving…</Button>

// ❌ Don't: opting out of the tooltip without providing any name at all (BTN-002)
<Button iconOnly ignoreIconOnlyTooltip>
  <IconV2 name="trash" />
</Button>

// ❌ Don't: colour and radius have props and tokens
<Button className="bg-red-500 rounded-full">Delete</Button>
```

---

## Accessibility

What a consumer of this component must do:

- **Give every icon-only button an `aria-label`.** The component sets none, and the source
  still carries the unimplemented note to add one (BTN-002)
- **Write the label as the action.** "Delete repository" beats "Delete" when three things on
  the page are deletable
- **Announce long async work yourself.** `loading` sets neither `aria-busy` nor
  `aria-disabled` (BTN-006)
- **Don't make `disabled` the explanation.** It removes the button from the tab order, so the
  reason must live in visible text
- **Remember `asChild` hands all of this to the child.** If the child is not a `<button>` or
  `<a>`, you own role, `tabIndex` and key handling (BTN-009)
- **Leave the focus ring alone.** It is `:focus-visible`-only, so it costs mouse users nothing

---

## Known Gaps

- [ ] **BTN-001:** a suggestion, not a block. `size="2xs"` / `"3xs"` force icon-only rendering
      and drop text children, so a micro button with no accessible name ships as an unlabelled
      square. The type does not stop it. Development builds log a warning when no `aria-label`,
      `aria-labelledby`, tooltip text or `ignoreIconOnlyTooltip` is present. Nothing enforces it
      in production or in CI
- [x] **BTN-002:** mostly closed. An icon-only button now derives its name from the tooltip's
      `title`, or `content` when there is no title, since Radix wires a Tooltip as a description
      rather than a name. Text is read from string and simple ReactNode `content`. Remaining:
      content with no text of its own gives nothing to copy, so such a button still needs an
      explicit `aria-label`; development builds log a warning when one is left nameless
- [ ] **BTN-003:** A design rule, not enforced by `Button`'s type. `ai`, `link` and `transparent` are
      single-appearance by design and carry no themes, but `<Button variant="link" theme="danger">`
      still compiles and the theme is ignored. A type that rejected it was withdrawn because it
      broke wrappers that spread a wide props object; it ships as the opt-in `StrictButtonProps`
      instead, with `ButtonThemedVariants` as the theme-capable set. `MoreActionsTooltip`,
      `Carousel`, `SidebarTrigger` and `SplitButton` forward a wide `variant` with a theme, which is accepted and ignored
- [ ] **BTN-004:** `theme="warning"` exists in Figma and in code, but `button.figma.ts` does not
      map it yet, so Code Connect cannot produce it. A Code Connect lag, not a design gap
- [ ] **BTN-005:** Figma models size, rounded and icon-only as twelve separate components rather
      than variant properties, and covers only `sm`, `md`, `xs`. One code API maps to twelve
      Code Connect files kept in step by hand
- [ ] **BTN-006:** `loading` sets `data-loading` and disables the button but no `aria-busy` and
      no `aria-disabled`
- [ ] **BTN-007:** `tooltipProps={{}}` satisfies the icon-only type requirement and renders no
      tooltip, because the wrap is gated on `isEmpty`
- [ ] **BTN-008:** In icon-only mode only the first `IconV2` child renders; everything else is
      discarded without warning
- [ ] **BTN-009:** `asChild` hands semantics to the child, so `disabled` and `type` stop having
      any effect — a disabled `asChild` button still receives clicks

---

## How to Contribute

### Adding a variant, theme, size, or prop

1. Update [`button.manifest.json`](./button.manifest.json) — the single source of truth
2. Run `pnpm ds-check --write` to regenerate the OpenAPI spec
3. Update the guidance in this file if the change affects _when_ to use it
4. Run `pnpm ds-check` and commit both files together

A new variant or theme also needs an entry in
`tailwind-utils-config/components/button.ts`, or it will have no styles — and a new `theme`
needs adding to the `variants` list there, or it will be inert on anything outside the four
themed variants (BTN-003).

**Never hand-edit `button.openapi.json`.** It is generated; the next regeneration discards your
change.

### Reporting issues

- Design drift → file in Jira (XD project)
- Accessibility gap → add to Known Gaps with a workaround
- Figma/code mismatch → check the twelve `button*.figma.ts` files first; they record what Figma
  actually exposes

---

## References

- **Source:** `packages/ui/src/components/button.tsx`
- **Styles:** `packages/ui/tailwind-utils-config/components/button.ts`
- **Code Connect:** `packages/ui/src/components/button*.figma.ts` (twelve files)
- **Manifest (authored):** [`button.manifest.json`](./button.manifest.json)
- **OpenAPI spec (generated):** [`button.openapi.json`](./button.openapi.json)
- **Related components:** `SplitButton`, `ButtonGroup`, `ButtonLayout`, `Link`, `Toggle`
- **System rules:** `docs/system/` — see `component-architecture.md`, which uses `ButtonProps`
  as the reference example for encoding invalid prop combinations in the type

---

## Questions?

See [AGENTS.md](../AGENTS.md) for the discovery workflow, or ask @design-systems on Slack.
