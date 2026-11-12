# Contributing: Add a New Component Skill

This guide walks you through adding a new component to the design system skills registry.

## Quick Overview

```
Component Source (src/components/)
       ↓
Manifest Contract (schemas/{component}.manifest.json)
       ↓
OpenAPI Spec (schemas/{component}.openapi.json)
       ↓
Registry Entry (schemas/registry.json)
       ↓
Pattern Docs (schemas/{component}.md)
```

**Time estimate:** 30–45 minutes per component (first time: 1 hour)

---

## Step 1: Gather Component Info

Before creating files, understand your component:

```bash
# Find the component source
ls -la packages/ui/src/components/{your-component}/

# Check TypeScript types
cat packages/ui/src/components/{your-component}/{your-component}.tsx

# Look for existing Figma mapping
cat packages/ui/src/components/{your-component}/{your-component}.figma.ts

# Check if pattern doc exists
cat apps/portal/src/content/docs/components/{category}/{your-component}.mdx
```

**Document:**
- Component name (PascalCase): `{ComponentName}`
- Kebab name: `{component-kebab}`
- Export statement: `import { {ComponentName} } from '@harnessio/ui/components'`
- All props (variant, size, theme, etc.) and their values
- Which props are design-time (Figma) vs runtime (code)
- Which props only exist in Figma, code, or both

---

## Step 2: Create the Manifest

Copy the template and fill in:

```bash
cp packages/ui/schemas/TEMPLATE.manifest.json packages/ui/schemas/{component-kebab}.manifest.json
```

**Required fields to customize:**

1. **`id`** → `canary.{component-kebab}`
2. **`code`** → Actual component path and export name
3. **`figma`** → Library, file key, component key (get from Figma)
4. **`purpose`** → Use cases and anti-patterns
5. **`props`** → All three categories with descriptions
6. **`tokens`** → Root class and token refs
7. **`governance.rulesDocs`** → Link to your pattern doc

**Example from StatusBadge:**

```json
{
  "id": "canary.status-badge",
  "code": {
    "package": "@harnessio/ui",
    "export": "StatusBadge",
    "import": "import { StatusBadge } from '@harnessio/ui/components'",
    "path": "packages/ui/src/components/status-badge/status-badge.tsx"
  },
  "props": {
    "shared": [
      { "name": "variant", "type": "enum", "values": ["primary", ...], "default": "primary" },
      { "name": "theme", "type": "enum", "values": ["muted", "success", ...], "default": "muted" }
    ],
    "designOnly": [...],
    "codeOnly": [...]
  }
}
```

**Validate:**

```bash
cd packages/ui && pnpm ds-check --schema
```

---

## Step 3: Generate the OpenAPI Spec

The OpenAPI spec is **generated from the manifest** — never hand-edit it.

```bash
cd packages/ui
pnpm ds-check --write                            # Generates {component-kebab}.openapi.json
```

**Verify:**

```bash
pnpm ds-check --generated                        # Fails if the spec is stale
```

The generator automatically:
- Maps all `shared` and `codeOnly` props from the manifest
- Derives enum values and defaults
- Sets `required` fields
- Embeds governance rules (`x-governance`)
- Formats JSON via Prettier (idempotent)

**If the spec file doesn't exist yet:** `pnpm ds-check --write` creates it. **If it exists but is out of sync:** `pnpm ds-check --generated` detects and fails; run `--write` to fix.

**⚠️ Do not hand-edit the OpenAPI spec.** Any manual changes will be overwritten on the next regeneration.

---

## Step 4: Update the Registry

Edit `schemas/registry.json`:

```json
{
  "skills": [
    {
      "id": "canary.{component-kebab}",
      "name": "{ComponentName} Component",
      "status": "stable",
      "description": "One-line description",
      "openapi": "schemas/{component-kebab}.openapi.json",
      "manifest": "schemas/{component-kebab}.manifest.json",
      "version": "1.4.1",
      "package": "@harnessio/ui",
      "export": "{ComponentName}",
      "import": "@harnessio/ui/components",
      "consumption": {
        "claude": { "method": "npm-import" },
        "cursor": { "method": "npm-import" },
        "figma-make": { "method": "http-openapi", "endpoint": "/components/{component-kebab}" }
      }
    }
  ]
}
```

**Validate:**

```bash
node -e "
const r = JSON.parse(require('fs').readFileSync('./schemas/registry.json', 'utf-8'));
const s = r.skills.find(s => s.id === 'canary.{component-kebab}');
console.log(s ? '✅ Registered' : '❌ Not found');
"
```

---

## Step 5: Create Pattern Documentation

Copy the template:

```bash
cp packages/ui/schemas/TEMPLATE.pattern.md packages/ui/schemas/{component-kebab}.md
```

**Sections to customize:**

1. **Overview** → What is this component, why does it exist?
2. **Props table** → Document each shared/design/code prop
3. **Tokens** → List all semantic token references
4. **Accessibility** → ARIA role, keyboard support
5. **Examples** → ✅ correct, ❌ incorrect
6. **Decision framework** → When to use this vs alternatives
7. **Known gaps** → Limitations, future improvements

**Example:**

```markdown
# StatusBadge Pattern Guide

## Overview
Display a status indicator with semantic theme (success, warning, error).

When to use:
- Communicating the state of a system or entity
- Showing pulse animation for real-time status

When NOT to use:
- Showing count (use CounterBadge)
- Actionable tags (use Tag component)

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | enum | `primary` | Maps from Figma variant |
| `theme` | enum | `muted` | Semantic color |

## Tokens

All values must be semantic token references:
- `badge.variant.primary`
- `badge.theme.success`
- `animation.pulse`
```

---

## Step 6: Validate Everything

Run the validation suite:

```bash
cd packages/ui

# Check manifest schema validity
pnpm ds-check --schema

# Check governance.rulesDocs paths exist
pnpm ds-check --refs

# Check code.export is valid TypeScript name
pnpm ds-check --code

# Check manifest enums match component CVA variants
pnpm ds-check --source

# Check OpenAPI spec is in sync (and regenerate if needed)
pnpm ds-check --generated
pnpm ds-check --write

# Full validation (all of the above)
pnpm ds-check
```

**Expected output:**

```
✅ {component-kebab}.manifest.json validates
✅ governance.rulesDocs paths exist
✅ code.export is valid TypeScript name
✅ {component-kebab}.openapi.json is up-to-date
```

---

## Step 7: Test Consumption

Simulate how Claude/Cursor will consume the skill:

```bash
node -e "
const fs = require('fs');
const registry = JSON.parse(fs.readFileSync('./schemas/registry.json', 'utf-8'));
const skill = registry.skills.find(s => s.id === 'canary.{component-kebab}');
const openapi = JSON.parse(fs.readFileSync('./schemas/{component-kebab}.openapi.json', 'utf-8'));
const manifest = JSON.parse(fs.readFileSync('./schemas/{component-kebab}.manifest.json', 'utf-8'));

console.log('Registry entry:', skill ? '✅' : '❌');
console.log('OpenAPI spec:', openapi.info.title);
console.log('Manifest ID:', manifest.id);
console.log('Governance rules:', manifest.governance.rulesDocs.length);
"
```

---

## Step 8: Commit & Open PR

```bash
git add packages/ui/schemas/{component-kebab}.*
git commit -m "feat: [UUI-XXXX] Add {ComponentName} component skill

- Create {component-kebab}.manifest.json with full component contract
- Add {component-kebab}.openapi.json OpenAPI specification
- Register skill in registry.json
- Create {component-kebab}.md pattern documentation

Manifest validates; all cross-references verified.

Co-Authored-By: [Your Name] <[email]>"
```

---

## Checklist

- [ ] Manifest created and validates against schema
- [ ] OpenAPI spec created with all props mapped
- [ ] Registry entry added with consumption methods
- [ ] Pattern doc created with examples and decision framework
- [ ] All validation checks pass (`pnpm ds-check`)
- [ ] Consumption test succeeds
- [ ] Commit message follows format
- [ ] Pattern doc linked in manifest's `governance.rulesDocs`

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Hardcoded color in tokens (e.g., `#0066cc`) | Use semantic token ref (e.g., `button.bg.primary`) |
| Missing prop description | Every prop needs a `description` field |
| Design-only prop without `transform` | Specify: `ignored`, `style-only`, `compose-derived`, or `layout-only` |
| Code-only prop without `trigger` | Specify: `event-handler`, `runtime-state`, `data-binding`, or `a11y-only` |
| Broken governance.rulesDocs path | Use `docs/system/...` for system rules and `schemas/{component}.md` for component-specific rules |
| Hand-editing the OpenAPI spec | Never; regenerate with `pnpm ds-check --write` instead |

---

## Need Help?

- **Schema questions:** See `schemas/component-manifest.schema.json` for field definitions
- **Token refs:** Check `apps/portal/src/content/docs/design-system/` for available tokens
- **Figma mapping:** See existing `.figma.ts` file for Code Connect patterns
- **Slack:** Ask @design-systems

---

## Examples to Reference

- ✅ **StatusBadge:** `schemas/status-badge.*` (complete POC)
- Template files:
  - `TEMPLATE.manifest.json`
  - `TEMPLATE.openapi.json`
  - `TEMPLATE.pattern.md`
