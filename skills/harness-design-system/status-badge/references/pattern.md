# StatusBadge Pattern Guide

> Props, values and defaults are in [props.json](./props.json). This file is judgment only:
> when to use it, how to compose it, and known gaps.

## Contents

- [Overview](#overview): what StatusBadge is and when it is the right component
- [Decision Framework: StatusBadge vs Tag](#decision-framework-statusbadge-vs-tag): choose between StatusBadge and Tag
- [Theme vocabulary: everyday words → real values](#theme-vocabulary-everyday-words--real-values): map everyday words to theme values
- [Do's and Don'ts](#dos-and-donts): quick rules
- [Examples](#examples): correct and incorrect usage
- [Accessibility](#accessibility): text content, live announcements and the decorative icon
- [Known Gaps](#known-gaps): what StatusBadge cannot do yet

---

## Overview

StatusBadge displays _transient, system-driven state_ that changes on its own
(pending → active → closed). Reach for it when a value is **evaluative** — the colour
implies good, bad, or waiting — and is backed by a system process.

**Use when:**

- A system process drives the value (execution state, connectivity, job progress)
- The colour carries meaning (success / warning / failure / neutral)
- The value has a real lifecycle, not a fixed label

**Do not use when:**

- The value is a stable attribute (account tier, scope, marketing label) → use **Tag**
- You need a count → use **CounterBadge**
- You need completion percentage → use **Progress**

---

## Decision Framework: StatusBadge vs Tag

| Question                                                   | Answer | Component   |
| ---------------------------------------------------------- | ------ | ----------- |
| Does this value change automatically via a system process? | Yes    | StatusBadge |
| Does the colour choice imply good/bad/waiting?             | Yes    | StatusBadge |
| Does it describe what something _is_, not how it changes?  | Yes    | Tag         |
| Is it stable, with no lifecycle?                           | Yes    | Tag         |

### Ambiguous cases

- **Account tier** (Free/Pro/Enterprise) → **Tag** — a ranked category, not evaluative
- **Scope** (Public/Private/Internal) → **Tag** with icon — descriptive, not state
- **Marketing labels** ("Beta", "New") → **Tag** — informational, no lifecycle
- **Connectivity** (online/offline/reconnecting) → **StatusBadge** — system-driven,
  evaluative, a real lifecycle

---

## Theme vocabulary: everyday words → real values

People describing a status rarely use the prop value. Someone asking for "a red badge", "an
error state" or "mark it failed" all mean `theme="danger"` — the word `error` does not exist
anywhere in this system, as a prop value, a token, or a CSS class. Translate the request;
never pass the word you were given.

| If the request says…                                             | Use                                                 |
| ---------------------------------------------------------------- | --------------------------------------------------- |
| error, failed, failure, broken, critical, fatal, red             | `danger`                                            |
| passed, succeeded, healthy, complete, approved, green            | `success`                                           |
| warning, warn, caution, degraded, unstable, flaky, amber, yellow | `warning`                                           |
| neutral, inactive, idle, unknown, not started, n/a, draft, grey  | `muted`                                             |
| informational, note, notice, blue                                | `info`                                              |
| merged, purple                                                   | `merged` — merged-state indicators only (see below) |

**These six plus `risk` are the complete set.** If a request maps to nothing here, it has no
theme — say so rather than inventing one. In particular there is no `purple` theme: `merged`
_is_ the purple (`--cn-text-merged` resolves to `--cn-set-purple-secondary-text`), but it
carries "this was merged" semantics, so it is the wrong answer for a decorative purple. A
request for purple that is not about a merge usually wants **Tag**, whose themes are
decorative colour names and which also has a built-in dismiss action.

`risk` has no established vocabulary yet, so no everyday word maps to it.

`info`, `merged` and `risk` are for CI/CD and DevOps products (Pipelines, Code Repository,
AI Code Review and similar), not global UI; the rule below still applies.

---

## Do's and Don'ts

### ✅ Do

- **Always pass text as `children`.** Text carries all semantic meaning; colour and icon
  are reinforcement only
- **Pass `variant` explicitly.** `outline` is the preferred choice when the design doesn't
  call for something else. It is a design preference, not a component default. Use another
  variant only when the design calls for it. `pulse` is optional and belongs to `variant="status"` (dot plus label) only
- Wrap in `aria-live="polite"` when the status can change while on screen (connectivity,
  job progress)
- Use the shared icon vocabulary so a status reads the same across products:

  | Meaning         | Icon             |
  | --------------- | ---------------- |
  | Pass / Success  | `check-circle`   |
  | Fail            | `xmark-circle`   |
  | Pending         | `timer`          |
  | Queued / Paused | `pause`          |
  | Rejected        | `prohibition`    |
  | Expired / Error | `warning-circle` |
  | Merged          | `git-merge`      |

- Render **one** badge per object — if several statuses apply, show the most urgent

### ❌ Don't

- **Don't use it for stable attributes** — that's Tag's job (SBD-001)
- **Don't rely on colour or icon alone** — text is mandatory; colour-only fails colourblind
  users and greyscale rendering
- **Don't restrict Pass/Fail/Pending to arbitrary themes** — use `success`, `warning`,
  `danger`, `muted`. Use `info`, `merged` and `risk` only in CI/CD and DevOps products, such
  as a "Merged" pull-request badge
- **Don't stack multiple badges** on one object
- **Don't combine `icon` with `variant="status"`** — the indicator dot already occupies
  that slot _(the type also rejects this)_
- **Don't pass `pulse` on any variant except `status`** _(the type also rejects this)_

---

## Examples

### ✅ Correct

```tsx
// Live execution status with a pulsing indicator
<StatusBadge variant="status" theme="success" pulse>
  Running
</StatusBadge>

// Static badge with a reinforcing icon
<StatusBadge variant="outline" theme="warning" icon="warning-circle">
  Attention needed
</StatusBadge>

// Changes while visible, so it is announced
<div aria-live="polite">
  <StatusBadge variant="status" theme={connected ? 'success' : 'danger'} pulse={!connected}>
    {connected ? 'Connected' : 'Disconnected'}
  </StatusBadge>
</div>

// No strong reason to pick a variant — outline is the preferred choice
<StatusBadge variant="outline" theme="muted">
  Draft
</StatusBadge>
```

### ❌ Incorrect

```tsx
// ❌ Don't: no text — colour and pulse carry the whole meaning
<StatusBadge variant="status" theme="success" pulse />

// ❌ Don't: a stable attribute belongs in Tag
<StatusBadge variant="outline" theme="info">Enterprise</StatusBadge>

// ❌ Don't: two statuses in one badge
<StatusBadge variant="outline" theme="warning">Warning & Pending</StatusBadge>

// ❌ Don't: icon on the status variant (rejected by the type)
<StatusBadge variant="status" icon="check-circle">Success</StatusBadge>

// ❌ Don't: make it interactive (onClick is blocked by the type)
<StatusBadge variant="outline" onClick={() => {}}>Status</StatusBadge>
```

---

## Accessibility

What a consumer of this component must do:

- **Provide text content.** The badge announces its children; colour alone is not a signal
- **Wrap in `aria-live="polite"`** when the value can change while visible — the component
  does not do this for you (SBD-008)
- **Treat the icon as decorative.** It is rendered `aria-hidden`; never let it carry meaning
  the text doesn't also carry

---

## Known Gaps

- [ ] **SBD-008:** No built-in `aria-live`; consumers must wrap when status changes on screen
- [ ] **SBD-012:** Icon DOM order has no RTL handling — unconfirmed whether this is a real
      bug in practice
- [ ] **SBD-013:** `pulse` has no `prefers-reduced-motion` guard — confirm whether Tailwind
      handles this globally before adding one
