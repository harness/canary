# Popover Pattern Guide

> Props, values and defaults are in [props.json](./props.json). This file is judgment only:
> when to use it, how to compose it, and known gaps.

## Contents

- [Overview](#overview): what Popover is and when it is the right component
- [Decision Framework: which Popover?](#decision-framework): choose between Popover and its neighbours
- [Do's and Don'ts](#dos-and-donts): quick rules
- [Examples](#examples): correct and incorrect usage
- [Accessibility](#accessibility)
- [Known Gaps](#known-gaps): what Popover cannot do yet

---

## Overview

<!-- SOURCE: intake §1 (purpose), §2 (use / do-not-use). One paragraph, then the two lists. -->
TODO(designer): what Popover is, in one or two sentences.

**Usage modes (mutually exclusive):** use either the shorthand `Popover` (pass `content`, children are the trigger) or the composed `Popover.Root` / `Popover.Trigger` / `Popover.Content`. Never use both: the shorthand already renders Root, Trigger and Content, so nesting them creates a second popover inside the first.

**Use when:**

- TODO(designer)

**Do not use when:**

- TODO(designer): condition → **OtherComponent**

---

## Decision Framework

<!-- SOURCE: intake §3 (neighbour components + the question that separates them). Table first, then ambiguous cases. -->

| Question | Answer | Component |
| -------- | ------ | --------- |
| TODO(designer) | Yes | Popover |

### Ambiguous cases

- TODO(designer): real-world case → **Component** — reason

<!-- Add component-specific sections here (e.g. a vocabulary table, a default trap). SOURCE: intake §4. Delete this comment if none. -->

---

## Do's and Don'ts

### ✅ Do

- TODO(designer)

### ❌ Don't

- TODO(designer)

---

## Examples

### ✅ Correct

<!-- Every prop and value used here is checked against props.json by the lint. Examples must obey rules.md. -->

```tsx
TODO(designer)
```

### ❌ Incorrect

<!-- Exempt from rules.md checks: these show what NOT to do. Say why under each. -->

```tsx
TODO(designer)
```

---

## Accessibility

<!-- SOURCE: intake §6. Cross-check against foundations/accessibility.md. -->
TODO(designer)

---

## Known Gaps

<!-- SOURCE: intake §7. Things the component cannot do yet and the sanctioned substitute. -->
- TODO(designer)
