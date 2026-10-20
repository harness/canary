# StatusBadge Pattern Guide

**Manifest ID:** `canary.status-badge`  
**Status:** stable  
**Last Updated:** 2026-10-20

---

## Overview

StatusBadge displays *transient, system-driven state* that changes automatically (pending → active → closed). Use this component when a value is evaluative (the color implies good/bad/waiting) and backed by a system process.

**For stable attributes** (account tier, scope, marketing labels) → use Tag instead.

See [`status-badge.manifest.json`](./status-badge.manifest.json) for complete prop reference, tokens, and accessibility details.

---

## Decision Framework: StatusBadge vs. Tag

| Question | Answer | Component |
|----------|--------|-----------|
| Does this value change automatically via a system process? | Yes | StatusBadge |
| Does the color choice imply good/bad/waiting? | Yes | StatusBadge |
| Describes what something *is* (not how it changes)? | Yes | Tag |
| Stable, no lifecycle? | Yes | Tag |

### Ambiguous Cases (Per-Case Judgment)

- **Account tier** (Free/Pro/Enterprise) → Tag (ranked category, not evaluative)
- **Scope** (Public/Private/Internal) → Tag with icon (descriptive, not state)
- **Marketing labels** ("Beta", "New") → Tag (informational, not lifecycle)
- **Connectivity** (online/offline/reconnecting) → **StatusBadge** (system-driven, evaluative, real lifecycle)

---

## Architecture: Do's and Do Not's

### ✅ Do's

- Use StatusBadge for *transient, system-driven state* (pending → active → closed)
- **Always pass `children` text** — text is mandatory and conveys all semantic meaning
- Wrap with `aria-live="polite"` when status changes while visible (connectivity, job progress, etc.)
- Default to `outline` variant unless you have a specific reason for `primary`, `secondary`, `ghost`, or `status`
- Use the fixed icon table for Pass/Fail/Pending meanings across domains:
  - `check-circle` = Pass/Success
  - `xmark-circle` = Fail
  - `timer` = Pending
  - `pause` = Queued/Paused
  - `prohibition` = Rejected
  - `warning-circle` = Expired/Error
- Render one StatusBadge per object — pick the most urgent status if multiple apply

### ❌ Do Not's

- **Don't use for stable attributes** — use Tag instead (SBD-001)
- **Don't pass `icon` when `variant='status'`** — the indicator dot already occupies that slot
- **Don't pass `pulse` on variants other than `'status'`** — pulse only works with status variant
- **Don't stack multiple StatusBadges** — pick the most urgent status or use separate components
- **Don't rely on color or icon alone** — text is mandatory (fails colorblind users)
- **Don't make it interactive** — StatusBadge is non-interactive by design (role, tabIndex, onClick are blocked by type)
- **Don't use `info`, `merged`, `risk` for Pass/Fail/Pending** — restrict to `success`, `warning`, `danger`, `muted`
  - Reserve `info`/`merged`/`risk` for named exceptions (e.g., "Merged" PR badge)

---

## Props & Tokens

See [`status-badge.manifest.json`](./status-badge.manifest.json) for:
- Full prop definitions (shared, designOnly, codeOnly)
- Variant options (primary, secondary, outline, ghost, status)
- Theme options (muted, success, warning, danger, info, merged, risk)
- Size options (sm, md)
- Token references (all semantic, no hardcoded values)

---

## Examples

### ✅ Correct Usage

```tsx
// Execution status with pulse
<StatusBadge variant="status" theme="success" pulse>Running</StatusBadge>

// Static badge with icon
<StatusBadge variant="outline" theme="warning" icon="warning-circle">
  Attention needed
</StatusBadge>

// Live-changing status (wrap with aria-live)
<div aria-live="polite">
  <StatusBadge variant="status" theme={connected ? 'success' : 'danger'} pulse={!connected}>
    {connected ? 'Connected' : 'Disconnected'}
  </StatusBadge>
</div>

// Default to outline variant
<StatusBadge theme="muted">Draft</StatusBadge>
```

### ❌ Incorrect Usage

```tsx
// ❌ Don't: Color/icon only
<StatusBadge variant="status" theme="success" pulse />

// ❌ Don't: Icon on status variant
<StatusBadge variant="status" icon="check-circle">Success</StatusBadge>

// ❌ Don't: Multiple statuses
<StatusBadge theme="warning">Warning & Pending</StatusBadge>

// ❌ Don't: Use for attributes
<StatusBadge theme="info">Enterprise</StatusBadge> {/* Use Tag instead */}

// ❌ Don't: Make interactive
<StatusBadge onClick={() => {}}>Status</StatusBadge> {/* onClick is blocked by type */}
```

---

## Known Gaps & Open Issues

- [ ] **SBD-008:** No built-in `aria-live` — consumers must wrap when status changes while visible
- [ ] **SBD-011:** Type requires `variant`; docs suggest it's optional with default → needs resolution
- [ ] **SBD-012:** Icon DOM order has no RTL logic → unconfirmed if real-world bug
- [ ] **SBD-013:** `pulse` has no `prefers-reduced-motion` guard → confirm if Tailwind handles globally

---

## Accessibility

**ARIA Role:** `status` (passive indicator, not interactive)

**Keyboard:** Not applicable (non-interactive)

**Color:** Text is mandatory — never rely on color alone (fails colorblind users, grayscale)

**Live updates:** Wrap with `aria-live="polite"` when status can change while visible

**See manifest** for full accessibility details.

---

## Governance Rules Applied

1. **Accessibility** — Mandatory text, ARIA role, no color-only signals
2. **Color System** — Semantic theme enum (no ad hoc colors)
3. **Interaction States** — Non-interactive by design; state changes are system-driven
4. **Visual Primitives** — Fixed shape + 2-size scale; never vary shape by meaning

---

## Governance Status

- **System Rules Applied:** ✅ All 4 system rules verified
- **Token Verification:** ✅ All color and animation tokens verified
- **Design Sync:** ✅ Latest (published)
- **Code Connect:** ✅ Active (`status-badge.figma.ts`)
- **Manifest:** ✅ Valid (`status-badge.manifest.json`)

---

## How to Contribute

### Adding a new theme
1. Add to `props.shared[].values` in manifest
2. Add OpenAPI enum in spec
3. Add token refs in `tokens.refs`
4. Update this guide's examples
5. Test: `pnpm ds-check`

### Reporting issues
- Design drift: File in Jira (XD project)
- Accessibility gap: Add to Known Gaps section
- Feature request: Document as Open Issue with reasoning

---

## References

- **Component Source:** `packages/ui/src/components/status-badge/status-badge.tsx`
- **Code Connect:** `packages/ui/src/components/status-badge/status-badge.figma.ts`
- **Manifest:** `status-badge.manifest.json` (props, tokens, governance)
- **OpenAPI Spec:** `status-badge.openapi.json` (for tool consumption)
- **System Rules:** `docs/system/` (accessibility, color-system, interaction-states, visual-primitives)

---

## Questions?

See [AGENTS.md](../AGENTS.md) for discovery workflow, or ask @design-systems on Slack.
