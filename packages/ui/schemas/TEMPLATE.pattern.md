# {ComponentName} Pattern Guide

**Manifest ID:** `canary.{component-kebab}`
**Status:** [draft | beta | stable | deprecated]
**Last Updated:** YYYY-MM-DD

> **This file is hand-written judgment only — written by designers.**
>
> **YOU OWN:** Pattern logic, decision-making, when/why to use it, composition assembly, known gaps.
>
> **TEAM OWNS:** Component manifests, prop definitions, Figma bindings, OpenAPI specs (auto-generated), technical verification.
>
> Do **not** add prop tables, enum values, token lists, or defaults here. Those live in
> `{component-kebab}.manifest.json` (one per component) and are published to `.openapi.json`,
> which is **generated** — `pnpm ds-check` fails if it drifts.
>
> Write what a manifest cannot express: *when* to reach for this component, when not to,
> and why.
>
> **For this draft:** Leave sections blank or annotate with `[TODO: team]` / `[NEEDS REVIEW]`
> if you're unsure. The internal team will fill in technical details and verify against
> the component's actual API.

---

## Composition

**[OPTIONAL — only if this is a composition]**

List the sub-components that make up this pattern and their roles:

| Component | Role | Required? |
|-----------|------|-----------|
| `{SubComponent1}` | [e.g., Root/wrapper] | Yes / No |
| `{SubComponent2}` | [e.g., Label] | Yes / No |
| `{SubComponent3}` | [e.g., Control] | Yes / No |

**Assembly pattern:** [e.g., "SubComponent1 wraps the others"; "SubComponent2 must come before SubComponent3"]

**Note:** Each sub-component has its own manifest and OpenAPI spec (handled by team). This section documents the *composition logic only* — when and how to use them together.

---

## Overview

**[DESIGNER — required]** What this component is, and the kind of thing it represents.

**Use when:**
- **[DESIGNER — required]** Situation where this is the right choice

**Do not use when:**
- **[DESIGNER — required]** Situation where something else is right (use [AlternativeComponent] instead)

---

## Decision Framework: {ComponentName} vs [AlternativeComponent]

**[DESIGNER — required]** The test a reader applies to choose between them.

| Question | Answer | Component |
|----------|--------|-----------|
| [Distinguishing question] | Yes | {ComponentName} |
| [Distinguishing question] | Yes | [AlternativeComponent] |

### Ambiguous cases

**[DESIGNER — most valuable]** Real cases that genuinely sit on the line, and the call made for each.
These are the judgments a reader cannot derive from the prop list alone. If unsure, leave this for team review.

- **[Case]** → [Component] ([one-line reason])

---

## Do's and Don'ts

**[DESIGNER — optional]** Document the choices that matter in practice, not what the compiler catches.

### ✅ Do

- **[DESIGNER]** Guidance that is a *choice*, not a type constraint
- [OPTIONAL] Leave blank if the component's constraints are self-explanatory

### ❌ Don't

- **[DESIGNER]** Mistake that compiles but is wrong
- **[DESIGNER]** Combination the type system allows but the design system forbids

> Prefer documenting mistakes the **compiler cannot catch**. If TypeScript already
> rejects it, the reader does not need a doc to find out.

---

## Examples

**[DESIGNER or TEAM]** Include 2–3 real-world examples showing common usage.

**Note:** Code examples must compile. If you're unsure about exact prop names, leave as `[TODO: team fill in props]` and the team will verify against the generated spec.

### ✅ Correct

```tsx
// [What this demonstrates]
<{ComponentName} [TODO: team fill in props] />
```

### ❌ Incorrect

```tsx
// ❌ Don't: [why]
<{ComponentName} [TODO: team fill in props] />
```

**[OPTIONAL]** If examples are too implementation-specific, you can skip this section and leave for team to populate.

---

## Accessibility

**[DESIGNER + TEAM]** Consumer-facing obligations only — what someone *using* this component must do.
The ARIA role and internal behaviour are in the manifest and auto-generated.

**Designer provides:** What consumers must do to use it accessibly (e.g., provide alt text, wrap in aria-live).
**Team verifies:** Against the actual implementation and manifest.

- [What the consumer must provide, e.g. mandatory text content]
- [When a wrapper is required, e.g. aria-live for values that change while visible]

**[OPTIONAL]** Leave blank if this component is self-contained and has no consumer obligations.

---

## Known Gaps

**[DESIGNER — valuable]** Limitations a reader would otherwise discover the hard way.
Remove entries when they are fixed — a stale gap is worse than no gap.

- [ ] [Gap] ([Jira id if one exists]; workaround: ...)

**[OPTIONAL]** Leave empty if there are no known limitations.

---

## How to Contribute

### Writing or updating this pattern doc

1. **Before you start:** The component must exist in code. Ask @design-systems if it's ready.
2. **Write your sections:** Follow the template; annotate `[TODO: team]` or `[NEEDS REVIEW]` for anything you're unsure of.
3. **Examples:** Write what you know; leave prop details for the team to fill in.
4. **Submit:** Open a PR with just the `.md` file. The team will:
   - Create/verify the manifest (`{component-kebab}.manifest.json`)
   - Auto-generate the OpenAPI spec
   - Verify your examples compile
   - Review your decision framework for correctness

### Adding a variant, theme, or prop to an existing pattern

1. Update this file with the new usage guidance
2. **Do not edit** `{component-kebab}.manifest.json` or `.openapi.json` directly
3. File a design change request in Jira (XD project); the team will update the manifest and regenerate

### Reporting issues

- Design gap / limitation → add to **Known Gaps** section with workaround
- Figma/code mismatch → check the Code Connect file first (`{component-kebab}.figma.ts`); it records what Figma exposes
- Manifest/spec drift → file in Jira (XD project)

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
