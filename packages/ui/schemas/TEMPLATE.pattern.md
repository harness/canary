# {ComponentName} Pattern Guide

**Manifest ID:** `canary.{component-kebab}`  
**Status:** [draft | beta | stable | deprecated]  
**Last Updated:** YYYY-MM-DD

---

## Overview

[AUTHORED] Brief explanation of what this component is and why it exists.

**When to use:**
- Use case 1
- Use case 2

**When NOT to use:**
- Anti-pattern 1 (use [AlternativeComponent] instead)
- Anti-pattern 2

---

## Props

### Shared Props (Design ↔ Code)

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | enum | `primary` | Figma variant maps to code prop |
| `size` | enum | `md` | Size options |

**Design binding:** These props exist in both Figma and React. Code Connect maps Figma properties to these prop names.

### Design-Only Props (Figma only)

| Prop | Type | Transform | Notes |
|------|------|-----------|-------|
| `state` | enum | `style-only` | Figma controls `:hover`, `:focus` → CSS only |

**Why:** These change appearance in the design file but compile to CSS, not React props.

### Code-Only Props (React only)

| Prop | Type | Trigger | Notes |
|------|------|---------|-------|
| `onClick` | function | `event-handler` | User interaction; not designable in Figma |

**Why:** Runtime behavior that can't be represented in a static design file.

---

## Tokens

All color, spacing, and animation values MUST be semantic token references. No hardcoded hex, px, or RGB values.

```json
"tokens": {
  "rootClass": "cn-{component}",
  "rule": "semantic-only",
  "refs": {
    "bg.primary": "{component}.bg.primary",
    "text.color": "text.cn-1",
    "padding.md": "spacing.md"
  }
}
```

**Why:** Enables theme switching (light/dark) and design system changes to propagate automatically.

---

## Accessibility

**ARIA Role:** [status | button | region | etc.]

**Keyboard Support:**
- Tab: [enter if applicable]
- Enter/Space: [if interactive]
- Escape: [if applicable]

**Usage Guidance:**
- [Specific accessible name requirement]
- [When to add aria-label / aria-labelledby]
- [Decorative vs semantic content]

---

## Known Gaps

List any limitations or future improvements:

- [ ] Gap/limitation 1 (linked to design issue / Jira ticket if exists)
- [ ] Gap/limitation 2 (workaround: ...)

---

## Examples

### ✅ Correct Usage

```tsx
import { {ComponentName} } from '@harnessio/ui/components'

// Example 1: Primary variant
<{ComponentName} variant="primary">Save</{ ComponentName}>

// Example 2: With icon
<{ComponentName} variant="secondary" icon="check">Confirm</{ ComponentName}>
```

### ❌ Incorrect Usage

```tsx
// ❌ Don't: Hardcoded color
<{ComponentName} style={{ backgroundColor: '#0066cc' }}>Bad</{ ComponentName}>

// ❌ Don't: Using alternative component
<Button>Use {ComponentName} instead for this case</Button>
```

---

## Decision Framework

### This component vs [AlternativeComponent]

| Aspect | {ComponentName} | Alternative |
|--------|-----------------|-------------|
| Use case A | ✅ | ❌ |
| Use case B | ❌ | ✅ |

---

## Governance Status

- **System Rules Applied:** Accessibility, Color System, Interaction States, Visual Primitives
- **Token Verification:** [All verified | Partial | Pending]
- **Design Sync:** [Latest | Out of date]
- **Code Connect:** [Active | Needs update]

---

## How to Contribute

### Adding a New Variant

1. Add variant to Figma component set (if design-time)
2. Update `props.shared[].values` in `{component-kebab}.manifest.json`
3. Update `props.shared[].values` in `{component-kebab}.openapi.json`
4. Add token refs to `tokens.refs` if new colors/sizing involved
5. Update this guide with new use cases
6. Test with `pnpm ds-check`

### Adding a New Prop

1. **Shared prop** (Figma ↔ Code):
   - Add to Figma component properties
   - Add to `props.shared[]` in manifest
   - Update Code Connect mapping
   - Add token refs if style-related

2. **Code-only prop** (behavior):
   - Add to component.tsx TypeScript type
   - Add to `props.codeOnly[]` in manifest with `trigger` reason
   - Document in this guide under Props section

### Reporting Issues

- Design drift: Check Figma publish status; file issue if out of sync
- Token missing: Verify `tokens.refs` in manifest
- Accessibility gap: Add to Known Gaps with workaround; flag for future sprint

---

## References

- **Component Source:** `packages/ui/src/components/{component-kebab}/{component}.tsx`
- **Code Connect:** `packages/ui/src/components/{component-kebab}/{component}.figma.ts`
- **Manifest:** `packages/ui/schemas/{component-kebab}.manifest.json`
- **OpenAPI Spec:** `packages/ui/schemas/{component-kebab}.openapi.json`
- **Figma File:** [Link to component in Harness Design System file]

---

## Questions?

See the main [AGENTS.md](../AGENTS.md) for discovery workflow, or ask @design-systems on Slack.
