# Tabs Pattern Guide

> Props, values and defaults are in [props.json](./props.json). This file is judgment only:
> when to use it, how to compose it, and known gaps.

## Contents

- [Overview](#overview): what Tabs is and when it is the right component
- [Decision Framework: which Tabs?](#decision-framework): choose between Tabs and its neighbours
- [Do's and Don'ts](#dos-and-donts): quick rules
- [Examples](#examples): correct and incorrect usage
- [Accessibility](#accessibility)
- [Known Gaps](#known-gaps): what Tabs cannot do yet

---

## Overview

<!-- SOURCE: intake §1 (purpose), §2 (use / do-not-use). One paragraph, then the two lists. -->
TODO(designer): what Tabs is, in one or two sentences.

**Use when:**

- TODO(designer)

**Do not use when:**

- TODO(designer): condition → **OtherComponent**

---

## Decision Framework

<!-- SOURCE: intake §3 (neighbour components + the question that separates them). Table first, then ambiguous cases. -->

| Question | Answer | Component |
| -------- | ------ | --------- |
| Do the tabs switch a view inside the same page, with local state? | Yes | `Tabs.Root` |
| Does each tab represent a distinct route? | Yes | `Tabs.NavRoot`, router-aware |

### Ambiguous cases

- TODO(designer): real-world case → **Component** — reason

### Routes or in-page views

When tabs represent distinct routes rather than in-page view switches, wire them through the router-aware tabs (`Tabs.NavRoot`) rather than local state. Each `Tabs.Trigger` then renders a link, and its `value` is the route it goes to. Use `Tabs.Root` only for switching views inside one page.

### Overflow

Tabs overflow by scrolling horizontally with fade indicators rather than wrapping or truncating. Don't build a custom overflow treatment.

### Icon or logo

Don't set both an `icon` and a `logo` on the same tab trigger. Pick one.

---

## Do's and Don'ts

### ✅ Do

- Wire tabs that represent distinct routes through `Tabs.NavRoot`.
- Let overflowing tabs scroll with the fade indicators.
- Pick either an `icon` or a `logo` for a tab trigger.

### ❌ Don't

- Don't drive route tabs with local state.
- Don't wrap or truncate overflowing tabs, and don't build a custom overflow treatment.
- Don't set both an `icon` and a `logo` on the same tab trigger.

---

## Examples

### ✅ Correct

<!-- Every prop and value used here is checked against props.json by the lint. Examples must obey rules.md. -->

```tsx
// Distinct routes: router-aware tabs, each value is a route
<Tabs.NavRoot>
  <Tabs.List>
    <Tabs.Trigger value="/pipelines">Pipelines</Tabs.Trigger>
    <Tabs.Trigger value="/executions">Executions</Tabs.Trigger>
  </Tabs.List>
</Tabs.NavRoot>

// In-page view switch: local state
<Tabs.Root defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="details">Details</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">...</Tabs.Content>
  <Tabs.Content value="details">...</Tabs.Content>
</Tabs.Root>
```

### ❌ Incorrect

<!-- Exempt from rules.md checks: these show what NOT to do. Say why under each. -->

```tsx
// ❌ Both an icon and a logo on one trigger: pick one
<Tabs.Trigger value="github" icon="..." logo="...">GitHub</Tabs.Trigger>

// ❌ Route tabs driven by local state: use Tabs.NavRoot
<Tabs.Root defaultValue="/pipelines">
  <Tabs.List>
    <Tabs.Trigger value="/pipelines">Pipelines</Tabs.Trigger>
  </Tabs.List>
</Tabs.Root>
```

---

## Accessibility

<!-- SOURCE: intake §6. Cross-check against foundations/accessibility.md. -->
TODO(designer)

---

## Known Gaps

<!-- SOURCE: intake §7. Things the component cannot do yet and the sanctioned substitute. -->
- TODO(designer)
