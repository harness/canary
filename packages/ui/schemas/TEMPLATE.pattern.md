# {ComponentName} Pattern Guide

**Manifest ID:** `canary.{component-kebab}`
**Status:** [draft | beta | stable | deprecated]
**Last Updated:** YYYY-MM-DD

> **This file is hand-written judgment only.**
>
> Do **not** add prop tables, enum values, token lists, or defaults here. Those live in
> `{component-kebab}.manifest.json` and are published to `{component-kebab}.openapi.json`,
> which is **generated** — `pnpm ds-check` fails if it drifts. Copying any of it into this
> file creates a second copy that nothing keeps in sync, which is the one failure this
> system exists to prevent.
>
> Write what a manifest cannot express: *when* to reach for this component, when not to,
> and why.

---

## Overview

[AUTHORED] What this component is, and the kind of thing it represents.

**Use when:**
- [AUTHORED] Situation where this is the right choice

**Do not use when:**
- [AUTHORED] Situation where something else is right (use [AlternativeComponent] instead)

---

## Decision Framework: {ComponentName} vs [AlternativeComponent]

[AUTHORED] The test a reader applies to choose between them.

| Question | Answer | Component |
|----------|--------|-----------|
| [Distinguishing question] | Yes | {ComponentName} |
| [Distinguishing question] | Yes | [AlternativeComponent] |

### Ambiguous cases

[AUTHORED] Real cases that genuinely sit on the line, and the call made for each.
These are the most valuable lines in the file — they are the judgments a reader
cannot derive from the prop list.

- **[Case]** → [Component] ([one-line reason])

---

## Do's and Don'ts

### ✅ Do

- [AUTHORED] Guidance that is a *choice*, not a type constraint

### ❌ Don't

- [AUTHORED] Mistake that compiles but is wrong
- [AUTHORED] Combination the type system allows but the design system forbids

> Prefer documenting mistakes the **compiler cannot catch**. If TypeScript already
> rejects it, the reader does not need a doc to find out.

---

## Examples

[AUTHORED] Every example must compile — include all required props.
Verify against the generated spec's `required` list before committing.

### ✅ Correct

```tsx
// [What this demonstrates]
<{ComponentName} />
```

### ❌ Incorrect

```tsx
// ❌ Don't: [why]
<{ComponentName} />
```

---

## Accessibility

[AUTHORED] Consumer-facing obligations only — what someone *using* this component
must do. The ARIA role and internal behaviour are in the manifest.

- [What the consumer must provide, e.g. mandatory text content]
- [When a wrapper is required, e.g. aria-live for values that change while visible]

---

## Known Gaps

[AUTHORED] Limitations a reader would otherwise discover the hard way.
Remove entries when they are fixed — a stale gap is worse than no gap.

- [ ] [Gap] ([Jira id if one exists]; workaround: ...)

---

## How to Contribute

### Adding a variant, theme, or prop

1. Update `{component-kebab}.manifest.json` — it is the single source of truth
2. Run `pnpm ds-check --write` to regenerate the OpenAPI spec
3. Update the examples and guidance **in this file** if the change affects when to use it
4. Run `pnpm ds-check` and commit both files together

**Never hand-edit `{component-kebab}.openapi.json`.** It is generated, and the next
regeneration discards your change.

### Reporting issues

- Design drift → file in Jira (XD project)
- Accessibility gap → add to Known Gaps with a workaround
- Figma/code mismatch → check the Code Connect file first; it records what Figma
  actually exposes

---

## References

- **Source:** `packages/ui/src/components/{component-kebab}/{component-kebab}.tsx`
- **Code Connect:** `packages/ui/src/components/{component-kebab}/{component-kebab}.figma.ts`
- **Manifest (authored):** `{component-kebab}.manifest.json`
- **OpenAPI spec (generated):** `{component-kebab}.openapi.json`
- **System rules:** `docs/system/`

---

## Questions?

See [AGENTS.md](../AGENTS.md) for the discovery workflow, or ask @design-systems on Slack.
