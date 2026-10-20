# `@harnessio/ui` — Component Discovery & Manifests

The main Harness UI component library. Contains React components built on Radix UI + ShadCN + Tailwind, with design system contracts (manifests) and Figma Code Connect mappings.

---

## Quick Start for AI Agents

### Finding a component

1. **Component source:** `packages/ui/src/components/{component-name}/`
   - `.tsx` file: React component implementation
   - `.figma.ts` file: Figma Code Connect mapping

2. **Component contract (manifest):** `packages/ui/generated/manifests/{component-name}.manifest.json`
   - Machine-readable spec: props (shared/designOnly/codeOnly), states, accessibility, tokens, bindings
   - Links to system rules and component-specific pattern guidance
   - Use this to understand the component's API and design constraints

3. **System rules:** `apps/portal/src/content/docs/design-system/`
   - `accessibility.md` — WCAG rules, accessible names, decorative vs interactive
   - `color-system.md` — Semantic tokens, color sets, theme-switching
   - `interaction-states.md` — Disabled, focus, hover/selected states
   - `visual-primitives.md` — Icon/logo/illustration decisions (when to use each)

4. **Component-specific patterns:** `{component-name}.md` (e.g., `button.md`, `status-badge.md`)
   - Do's and do-nots, decision framework, known gaps, governance status
   - Linked from the manifest's `governance.rulesDocs` array

---

## Using a Component Manifest

### Example: Finding Button

```
File: packages/ui/generated/manifests/button.manifest.json

{
  "id": "canary.button",
  "status": "stable",
  
  "code": {
    "export": "Button",
    "import": "import { Button } from '@harnessio/ui/components'",
    "path": "packages/ui/src/components/button/button.tsx"
  },
  
  "props": {
    "shared": [
      { "name": "variant", "type": "enum", "values": ["primary", "secondary", "outline", ...] }
    ],
    "designOnly": [],
    "codeOnly": [
      { "name": "onClick", "type": "function", "trigger": "event-handler" }
    ]
  },
  
  "governance": {
    "rulesDocs": [
      "apps/portal/src/content/docs/design-system/accessibility.md",
      "apps/portal/src/content/docs/design-system/color-system.md",
      "apps/portal/src/content/docs/design-system/interaction-states.md",
      "./button.md"
    ]
  }
}
```

**Read in this order:**
1. `purpose.useWhen` / `purpose.doNotUseWhen` — Is this the right component?
2. `props.shared` — What props can you pass?
3. `governance.rulesDocs[0-3]` — What are the global design rules?
4. `governance.rulesDocs[4]` (`button.md`) — Component-specific guidance (when Button vs other actions?)

---

## Prop Categories Explained

### `shared`: Exists in both Figma and code

```json
{
  "name": "variant",
  "type": "enum",
  "values": ["primary", "secondary"],
  "figmaProperty": "variant"
}
```

These props are mapped between Figma and React. Designers can change them in Figma; Code Connect generates the correct React prop.

### `designOnly`: Figma-only controls

```json
{
  "name": "state",
  "type": "enum",
  "figmaProperty": "state",
  "transform": "style-only"
}
```

These exist in Figma (e.g., `:hover` variant) but compile to CSS, not a React prop. Agents should not expect code-level equivalents.

### `codeOnly`: React-only props

```json
{
  "name": "onClick",
  "type": "function",
  "trigger": "event-handler"
}
```

Handlers, runtime state, aria-attributes. No Figma representation. Designers can't set these in Figma; they're purely code-side.

**Why the split?** So agents never assume a prop exists on both sides unless it's explicitly `shared`. Prevents bugs where a Figma change has no code equivalent, or vice versa.

---

## Tokens & CSS Classes

Each component uses a root CSS class (e.g., `cn-button`) and semantic token references:

```json
"tokens": {
  "rootClass": "cn-button",
  "rule": "semantic-only",
  "refs": {
    "size.md": "button.size.md",
    "text.color": "text.cn-1",
    "bg.color": "bg.cn-0"
  }
}
```

**Key rule:** Every value is a token reference, never a literal hex/px. This ensures:
- Colors theme-switch (light/dark)
- Spacing is consistent
- Design system changes propagate

---

## Validation

### Check all manifests

```bash
pnpm ds-check                    # Schema + refs + code validation
pnpm ds-check --schema           # Schema structure only
pnpm ds-check --refs             # Check rulesDocs paths exist
pnpm ds-check --code             # Validate code.export, code.path
```

Runs automatically on `pnpm pre-commit`.

---

## File Structure

```
packages/ui/
├── src/
│   └── components/
│       ├── button/
│       │   ├── button.tsx           # Component implementation
│       │   └── button.figma.ts      # Code Connect mapping
│       ├── status-badge/
│       │   ├── status-badge.tsx
│       │   └── status-badge.figma.ts
│       └── ... (other components)
│
├── generated/
│   └── manifests/
│       ├── button.manifest.json      # Component contract
│       ├── status-badge.manifest.json
│       └── ... (one per component)
│
├── schemas/
│   ├── component-manifest.schema.json # Manifest validation schema
│   └── TEMPLATE.manifest.json         # Template for new components
│
└── scripts/
    └── ds-check.ts                    # Validation script
```

---

## System Design

### Architecture

```
Component.tsx (runtime API)
    ↓
Design tokens (semantic-only)
    ↓
Figma Code Connect (.figma.ts)
    ↓
Component Manifest (.manifest.json)
    ↓
System Rules (accessibility.md, color-system.md, ...)
Component Pattern Rules ({component}.md)
```

### Key Decisions

1. **Manifest is the contract** — One source of truth for props, states, tokens, accessibility
2. **System rules are global** — Shared across all components (WCAG, color semantics, interaction states)
3. **Component patterns are specific** — Do's/do-nots, decision framework (this component vs alternatives)
4. **Code Connect is the mapping** — Figma properties → React props (Figma remains authoritative for design)
5. **Tokens are the source** — No hardcoded hex/px in components, ever

---

## Common Tasks

### Agent: "Build a form with Save and Cancel buttons"

1. Locate Button manifest: `packages/ui/generated/manifests/button.manifest.json`
2. Read `purpose.useWhen` — confirm Button is right choice
3. Check `props.shared` — variant, size, disabled options
4. Read `governance.rulesDocs` — especially button.md (when Button vs other actions?)
5. Read growth patterns: `apps/portal/src/content/docs/growth-patterns/form-actions.md`
6. Import and compose: `<Button variant="primary" onClick={save}>Save</Button>`

### Designer: "Map Button to Figma"

1. Open Code Connect: `packages/ui/src/components/button/button.figma.ts`
2. Check `variantPropertyMap` — Figma property names
3. Confirm mapping: Figma `variant` property → code `variant` prop
4. Test in Figma: select a Button instance, run Code Connect
5. If changes needed: update `.figma.ts`, test again

### Agent: "Validate all component manifests"

```bash
pnpm ds-check
```

Checks:
- ✅ Each manifest validates against schema
- ✅ `governance.rulesDocs` paths exist and are readable
- ✅ `code.export` is a valid TypeScript name
- ✅ `code.path` references actual file

---

## References

- **System Rules:** `apps/portal/src/content/docs/design-system/`
- **Patterns & Growth:** `apps/portal/src/content/docs/growth-patterns/`
- **Token Architecture:** See `DESIGN.md` (root)
- **Manifest Consumer Guide:** See `schemas/TEMPLATE.manifest.json` for example structure

---

## Questions?

- **"How do I create a new component manifest?"**
  → Copy `schemas/TEMPLATE.manifest.json`, fill in the required fields, run `pnpm ds-check`

- **"When should I add component-specific rules to the manifest vs a separate pattern doc?"**
  → Manifest: props, states, tokens (the contract). Pattern doc: do's/do-nots, decision framework, governance status (the guidance).

- **"How do I version a component?"**
  → `status` field: "draft" → "beta" → "stable" → "deprecated". Change in manifest + update `supersededBy` if replacing an old component.
