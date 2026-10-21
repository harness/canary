# StatusBadge Pattern Guide

**Manifest ID:** `canary.status-badge`
**Status:** stable
**Last Updated:** 2026-10-21

> **This file is hand-written judgment only.**
>
> Prop names, enum values, defaults, and tokens live in
> [`status-badge.manifest.json`](./status-badge.manifest.json) and are published to
> [`status-badge.openapi.json`](./status-badge.openapi.json), which is **generated**.
> Don't copy them here.

---

## Overview

StatusBadge displays *transient, system-driven state* that changes on its own
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

| Question | Answer | Component |
|----------|--------|-----------|
| Does this value change automatically via a system process? | Yes | StatusBadge |
| Does the colour choice imply good/bad/waiting? | Yes | StatusBadge |
| Does it describe what something *is*, not how it changes? | Yes | Tag |
| Is it stable, with no lifecycle? | Yes | Tag |

### Ambiguous cases

- **Account tier** (Free/Pro/Enterprise) → **Tag** — a ranked category, not evaluative
- **Scope** (Public/Private/Internal) → **Tag** with icon — descriptive, not state
- **Marketing labels** ("Beta", "New") → **Tag** — informational, no lifecycle
- **Connectivity** (online/offline/reconnecting) → **StatusBadge** — system-driven,
  evaluative, a real lifecycle

---

## Do's and Don'ts

### ✅ Do

- **Always pass text as `children`.** Text carries all semantic meaning; colour and icon
  are reinforcement only
- **Pass `variant` explicitly** — the type requires it, and `outline` is the right default
  when you have no specific reason to choose otherwise
- Wrap in `aria-live="polite"` when the status can change while on screen (connectivity,
  job progress)
- Use the shared icon vocabulary so a status reads the same across products:

  | Meaning | Icon |
  |---|---|
  | Pass / Success | `check-circle` |
  | Fail | `xmark-circle` |
  | Pending | `timer` |
  | Queued / Paused | `pause` |
  | Rejected | `prohibition` |
  | Expired / Error | `warning-circle` |

- Render **one** badge per object — if several statuses apply, show the most urgent

### ❌ Don't

- **Don't use it for stable attributes** — that's Tag's job (SBD-001)
- **Don't rely on colour or icon alone** — text is mandatory; colour-only fails colourblind
  users and greyscale rendering
- **Don't restrict Pass/Fail/Pending to arbitrary themes** — use `success`, `warning`,
  `danger`, `muted`. Reserve `info`, `merged`, and `risk` for named exceptions such as a
  "Merged" pull-request badge
- **Don't stack multiple badges** on one object
- **Don't combine `icon` with `variant="status"`** — the indicator dot already occupies
  that slot *(the type also rejects this)*
- **Don't pass `pulse` on any variant except `status`** *(the type also rejects this)*

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

// No strong reason to pick a variant — outline is the sensible default
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
- [ ] **Figma/code mismatch:** the manifest classifies `icon` and `children` as code-only,
      but `status-badge.figma.ts` maps both (`icon#1293:13`, `text#1299:25`), and classifies
      `pulse` as design-only though it is a code prop Figma does not appear to expose.
      All three need reclassifying

---

## How to Contribute

### Adding a variant, theme, or prop

1. Update [`status-badge.manifest.json`](./status-badge.manifest.json) — the single source
   of truth
2. Run `pnpm ds-check --write` to regenerate the OpenAPI spec
3. Update the examples and guidance in this file if the change affects *when* to use it
4. Run `pnpm ds-check` and commit both files together

**Never hand-edit `status-badge.openapi.json`.** It is generated; the next regeneration
discards your change.

### Reporting issues

- Design drift → file in Jira (XD project)
- Accessibility gap → add to Known Gaps with a workaround
- Figma/code mismatch → check `status-badge.figma.ts` first; it records what Figma
  actually exposes

---

## References

- **Source:** `packages/ui/src/components/status-badge/status-badge.tsx`
- **Code Connect:** `packages/ui/src/components/status-badge/status-badge.figma.ts`
- **Manifest (authored):** [`status-badge.manifest.json`](./status-badge.manifest.json)
- **OpenAPI spec (generated):** [`status-badge.openapi.json`](./status-badge.openapi.json)
- **System rules:** `docs/system/`

---

## Questions?

See [AGENTS.md](../AGENTS.md) for the discovery workflow, or ask @design-systems on Slack.
