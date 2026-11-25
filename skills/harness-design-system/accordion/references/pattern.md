# Accordion Pattern Guide

> Props, values and defaults are in [props.json](./props.json). This file is judgment only:
> when to use it, how to compose it, and known gaps.

## Contents

- [Overview](#overview): what Accordion is and when it is the right component
- [Decision Framework](#decision-framework): whether to disclose content at all
- [Behavior](#behavior): expanding, collapsing, open sections and form data
- [Default state](#default-state): which sections start open
- [Do's and Don'ts](#dos-and-donts): quick rules
- [Examples](#examples): correct and incorrect usage
- [Accessibility](#accessibility)
- [Known Gaps](#known-gaps): what Accordion cannot do yet

---

## Overview

Accordion discloses content progressively. It organizes related content into expandable and
collapsible sections, which reduces visual complexity and lets people focus on what is relevant
without leaving the current context.

**Use when:**

- Grouping related information into distinct sections
- Presenting secondary or optional information
- Organizing configuration settings
- Reducing the visual density of a content-heavy interface
- People should be able to explore the sections independently

**Do not use when:**

- The content must stay visible for the person to complete the task
- The content is critical information, an error or a warning that needs immediate attention
- The sections are navigation between pages or distinct views
- People need to compare content across sections often
- The only reason is to make the page shorter

---

## Decision Framework

Ask these in order. Only the last answer is an Accordion.

| Question | Answer | Result |
| -------- | ------ | ------ |
| Must the person see this to complete the task? | Yes | Keep it visible |
| Is it an error, warning or other critical message? | Yes | Keep it visible |
| Is it navigation between pages or views? | Yes | Do not use an Accordion |
| Will people often compare it with other sections? | Yes | Keep the sections visible together |
| Is it related, secondary or optional content, or a group of settings? | Yes | Accordion |

---

## Behavior

- Selecting a trigger expands or collapses its section.
- The expanded state must look different from the collapsed state. The component turns the
  indicator over when a section is open.
- Allow several sections to stay open when people benefit from referencing related content.
  Allow only one open section when the workflow needs focused interaction.
- When a collapsed section contains a validation error, open it so the error is seen.
- Do not lose what the person has entered when a section is collapsed. Closed content is
  removed from the page by default (see Known Gaps), so keep field values in your form state,
  not in the content itself.

## Default state

- Open the sections that hold immediately relevant or required information.
- Collapse the sections that hold optional or supplementary information.
- Choose the starting state from the person's task and context, not from a fixed rule.

---

## Do's and Don'ts

### ✅ Do

- Give each section a short, descriptive heading
- Group logically related content in each section
- Keep the visual hierarchy the same across sections
- Use the default `variant` unless there is a reason not to
- Keep the indicator on the right, which is the default; use `indicatorPosition="left"` only when the right side is not workable
- Use the Accordion component for disclosure instead of building your own

### ❌ Don't

- Don't nest accordions unless the content structure needs it
- Don't use an accordion in place of page navigation
- Don't hide content that must remain visible, or critical messages
- Don't use an accordion only to shorten a page

---

## Examples

### ✅ Correct

```tsx
import { Accordion, Text } from '@harnessio/ui/components'

// Settings grouped by topic: the required group starts open, the optional group starts closed
<Accordion.Root type="multiple" defaultValue={['general']}>
  <Accordion.Item value="general">
    <Accordion.Trigger>General settings</Accordion.Trigger>
    <Accordion.Content>
      <Text>Name, description and owner.</Text>
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="advanced">
    <Accordion.Trigger>Advanced settings</Accordion.Trigger>
    <Accordion.Content>
      <Text>Optional timeouts and retry behavior.</Text>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### ❌ Incorrect

```tsx
// ❌ Don't: a section holding a failed validation starts closed, so the error is hidden
<Accordion.Root type="multiple" defaultValue={[]}>
  <Accordion.Item value="credentials">
    <Accordion.Trigger>Credentials</Accordion.Trigger>
    <Accordion.Content>{/* field with a validation error */}</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>

// ❌ Don't: an accordion used to switch between views. Use page navigation.
```

---

## Accessibility

- Triggers must be keyboard accessible. Enter and Space expand and collapse a section.
- Expanded and collapsed state must reach assistive technology. The component's trigger does
  this, so use `Accordion.Trigger`; do not build your own.
- Keep a logical focus order.
- Collapsed content must not be keyboard focusable. The component removes closed content from
  the page by default, so this holds unless you override it.
- Do not rely on an icon alone to say what a section is for. Give every trigger a text heading.
- Do not set `clickable={false}` on a trigger unless you provide another keyboard-operable
  control that opens the section. Without the trigger button, the section cannot be reached
  from the keyboard.

---

## Known Gaps

- **Closed content is not kept.** The content of a collapsed section is removed from the page,
  so anything held only in that content (uncontrolled inputs, local state) is lost when the
  section closes. Keep values in form state outside the content.
- **No guidance yet for `size`, the reasons to choose the `card` variant, or `cardSize`.** The designer has not said how to
  choose between the values. Use the defaults until it does.
