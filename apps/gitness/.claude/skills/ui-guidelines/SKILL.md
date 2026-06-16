---
name: ui-guidelines
description: Supplement to ui-builder for @harnessio/ui components. Gitness agents MUST read ui-builder first, then Tiers 1–2 here. Tier 3 deep reference for component APIs, tokens, and type verification.
---

# UI Guidelines Skill

You are an expert on Harness new UI components. Answer questions quickly and accurately based on the source files from `@harnessio/ui/components` and the `tailwind-design-system.ts` configuration file.

## UI Builder fast path (read this first)

> **Gitness UI:** Start with `ui-builder/SKILL.md`. This skill supplements ui-builder Steps 1 and 4. Do not skip tiers to read the deep reference below.

UI Builder **requires** Tiers 1–2 on every gitness UI task.

### Tier 1 — Minimum (every UI task)

1. Read `apps/gitness/.ui-builder-config.json`
2. Copy the **closest canonical pattern** from `ui-builder/SKILL.md` (lists, layout, forms, composites)
3. Import only from `@harnessio/ui/components` and `@harnessio/views`
4. Use `-cn-` Tailwind tokens; no arbitrary hex unless dynamic
5. **Two-column layout:** `Layout.Flex gap="xl"` + fixed sidebar width — see `repo-create-issue-page.tsx` or PR compare
6. **Composites first:** reuse `@harnessio/views` composites (`PullRequestSideBar`, `StackedList`, etc.) before raw primitives

### Tier 2 — Unfamiliar components (before first use in session)

For each component not already used in the canonical pattern you copied:

1. Read source: `{uiComponentsSourcePath}/<component>.tsx`
2. Confirm valid `variant`, `theme`, `size`, icon names from source / `icon-v2/icon-name-map.ts`
3. Cross-check a sibling file in the codebase

**Trigger Tier 2:** `MultiSelect`, `StackedList`, `Tabs`, `Tag`/`LabelTag`, `NoData`, `Layout.Flex`/`Grid`, or any component not in your reference file.

### Tier 3 — Full skill (complex or novel UI)

Read sections below when:

- No close canonical pattern exists
- Debugging prop/type errors
- Deep token or component API questions

---

## Configuration reference (Tier 2+)

Paths are relative to `apps/gitness/`:

| Key | Path |
|-----|------|
| `uiComponentsSourcePath` | `../../packages/ui/src/components` |
| `tailwindConfigPath` | `../../packages/ui/tailwind-design-system.ts` |
| `portalPath` | `../../apps/portal` |

If `.ui-builder-config.json` is missing, create it with those paths. Verify paths exist before recommending components.

## Component verification (Tier 2+)

**Before using any component not in your canonical pattern:**

1. Read source from `{uiComponentsSourcePath}/<component>.tsx`
2. Extract valid `variant`, `theme`, `size` values from `cva()` or prop types
3. Verify icon names in `icon-v2/icon-name-map.ts`
4. Never invent prop names or values not in source

**Strict rules:**

- Required props must be provided
- No inline styles (use `-cn-` tokens)
- Cross-check against a sibling file in the codebase

**Example workflow — Text component:**

```typescript
// STEP 0: Check if .ui-builder-config.json exists
// If not, create it with the template configuration

// STEP 1: Read .ui-builder-config.json to get uiComponentsSourcePath
// Result: "/Users/pranesh/Documents/unified-universe/canary/packages/ui/src/components"

// STEP 2: Read the Text component source code
// File: {uiComponentsSourcePath}/text.tsx (line 38-54)
//
// Found typographyVariantConfig object:
// {
//   'heading-hero': ...,
//   'heading-section': ...,
//   'heading-subsection': ...,
//   'heading-base': ...,
//   'heading-small': ...,
//   'body-normal': ...,
//   'body-single-line-normal': ...,
//   'body-strong': ...,
//   'body-single-line-strong': ...,
//   'body-code': ...,
//   'caption-normal': ...,
//   'caption-light': ...,
//   'caption-strong': ...,
//   'caption-single-line-normal': ...,
//   'caption-single-line-light': ...
// }
//
// Found textVariants cva (line 56-99):
// - variant: keys from typographyVariantConfig
// - align: 'left' | 'center' | 'right'
// - truncate: true (boolean, not a string)
// - color: 'inherit' | 'foreground-1' | 'foreground-2' | 'foreground-3' | 'disabled' | 'success' | 'warning' | 'merged' | 'danger' | 'brand'
// - lineClamp: 'default' | 1 | 2 | 3 | 4 | 5 | 6
// - wrap: 'wrap' | 'nowrap' | 'pretty' | 'balance'
//
// DEFAULT VALUES (line 95-98):
// - variant: 'body-normal'
// - color: 'foreground-2'
// - truncate: false
//
// NOTE: There is NO 'weight' prop! This component doesn't support font weight.

// STEP 3: Use ONLY values defined in the source code
// ✅ CORRECT - Uses valid variant and color
<Text variant="heading-subsection" color="foreground-1">Title</Text>

// ✅ CORRECT - For small text, use caption variant
<Text variant="caption-normal">Small text</Text>

// ✅ CORRECT - Truncate is boolean
<Text truncate>Long text that will be truncated</Text>

// ❌ WRONG - "weight" prop does not exist in Text component
<Text weight="semibold">Title</Text>

// ❌ WRONG - "caption" is not a valid variant (must use 'caption-normal', 'caption-light', etc.)
<Text variant="caption">Small text</Text>

// ❌ WRONG - Must use color prop, not className for text color
<Text className="text-cn-text-secondary">Text</Text>
// CORRECT:
<Text color="foreground-3">Text</Text>
```

**Example Workflow - Using the StatusBadge Component**:

```typescript
// STEP 0: Check if .ui-builder-config.json exists and read it

// STEP 1: Read source code
// File: {uiComponentsSourcePath}/status-badge/status-badge.tsx (line 7-35)
//
// Found statusBadgeVariants cva:
// - variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'status'
// - size: 'md' | 'sm'
// - theme: 'muted' | 'success' | 'warning' | 'danger' | 'info' | 'merged'
//
// DEFAULT VALUES:
// - variant: 'primary'
// - size: 'md'
// - theme: 'muted'
//
// NOTE: There is NO 'default' theme value! Use 'muted' instead.

// STEP 2: Use ONLY valid values
// ✅ CORRECT - Valid theme values
const theme = status === 'Success' ? 'success' : status === 'Failed' ? 'danger' : 'muted'
<StatusBadge theme={theme} variant="status">{status}</StatusBadge>

// ❌ WRONG - 'default' is not a valid theme
const theme = status === 'Success' ? 'success' : 'default'
<StatusBadge theme={theme}>Status</StatusBadge>
```

**This verification process is MANDATORY for:**
- All components from `@harnessio/ui/components`
- All design tokens from Tailwind config
- All icon names from IconV2
- All form components and their props
- All layout components and their props

**Failure to follow this process will result in type errors and broken UI code.**

## When to Use This Skill

Use this skill when:
- Creating new UI components or pages
- Modifying existing UI code
- Questions about which component to use
- Debugging UI component issues
- Verifying component props and usage
- Checking design token and CSS class patterns
- BEFORE using any component for the first time

## Your Task

Provide quick, accurate answers to questions about:
- Component usage and patterns
- Design token application
- Form development standards
- TypeScript requirements
- Accessibility guidelines
- Best practices and patterns

## Critical Guidelines - Common Mistakes to Avoid

**ALWAYS follow these guidelines when creating UI code. These prevent frequently occurring mistakes:**

1. **Type Verification (MANDATORY)**:
   - Read `.ui-builder-config.json` to get component source path
   - Read component type definitions BEFORE using any component
   - Verify ALL prop types and use ONLY valid values
   - Ensure zero type errors in generated code

2. **Import Conventions (MANDATORY)**:
   - **Base UI** always from `@harnessio/ui/components` (Button, Text, Layout, IconV2, DataTable, etc.)
   - **Presentational views** from `@harnessio/views` when a shared view exists
   - **API hooks** from `@harnessio/code-service-client`
   - **Gitness-local code** via relative imports within `src/`:
     - `pages-v2/` — route pages and feature containers
     - `components-v2/` — gitness-specific components
     - `framework/` — context, hooks, routing, RBAC
   - **CORRECT**: `import { Button, Text } from '@harnessio/ui/components'`
   - **CORRECT**: `import { useRoutes } from '../../framework/context/NavigationContext'`
   - **WRONG**: `import { Button } from './button'` (reimplementing base UI locally)

3. **Search Functionality**: Use `SearchInput` instead of `Input` for search functionality

4. **Toast Notifications**: **ALWAYS** use `toast` instead of `useToast` or `useToaster`

5. **Table Row Actions**: Use `RbacMoreActionsTooltip` instead of `Dropdown` component for table row actions

6. **Icon Names and Colors**:
   - Read `icon-v2/icon-name-map.ts` from component source path
   - **ALWAYS** use `IconV2NamesType` type for icon names (NOT `IconPropsV2['name']`)
   - **CORRECT**: `const getTriggerIcon = (type: string): IconV2NamesType => { ... }`
   - **WRONG**: `const getTriggerIcon = (type: string): IconPropsV2['name'] => { ... }`
   - Verify icon exists in `IconNameMapV2` object before using
   - When type-casting in arrays, use `as IconV2NamesType` not `as IconPropsV2['name']`
   - **Icon Colors**: **ALWAYS** use the `color` prop with `IconV2Color` type (NOT className)
   - **CORRECT**: `<IconV2 name="check" color="success" />`
   - **WRONG**: `<IconV2 name="check" className="text-cn-success-primary" />`
   - Read `icon-v2` type definitions to verify valid color values from `IconV2Color` type

7. **Component Verification**:
   - **ALWAYS** read the UI component's type definition from source code before using
   - Use only valid prop types and values
   - Check for required vs optional props
   - Verify union types and enums

8. **Component Availability**:
   - **MUST** verify whether the UI component is present in `@harnessio/ui/components` package before using it
   - Check component existence in source path from config

9. **API Response Types**:
   - **MUST** read API response type definition in its types file
   - Use correct property names exactly as defined
   - Don't assume property names

10. **Pagination**: Default page size for pagination is 25

11. **Reference Components**: If a reference file comes from another app, do NOT copy its local components. Use the equivalent from `@harnessio/ui/components` or `@harnessio/views`

12. **Design Tokens**:
    - Read `tailwind-design-system.ts` from config to verify token names
    - Use ONLY tokens defined in the config
    - Don't invent custom token names

**MANDATORY Pre-Code Checklist:**
- ✅ Check if `.ui-builder-config.json` exists at repository root
- ✅ If missing, create it using the template from "START HERE" section
- ✅ Read `.ui-builder-config.json` to get source paths
- ✅ Verify the configured paths exist and are accessible
- ✅ **USE CORRECT IMPORT SOURCES** - Base UI from `@harnessio/ui/components`, views from `@harnessio/views`, local code from `pages-v2/`, `components-v2/`, `framework/`
- ✅ Verify component exists in `@harnessio/ui/components`
- ✅ Read component SOURCE CODE (not just types) from {uiComponentsSourcePath}
- ✅ Extract valid prop values from `cva()` variants object
- ✅ List out ALL valid values for each prop BEFORE using the component
- ✅ Verify ALL prop types and accepted values match source code exactly
- ✅ Use `IconV2NamesType` type for icon names (NOT `IconPropsV2['name']`)
- ✅ Use `color` prop with `IconV2Color` type for icon colors (NOT className)
- ✅ Verify design tokens against Tailwind config
- ✅ Use correct API response property names
- ✅ Follow search/toast/actions guidelines above
- ✅ Ensure generated code has ZERO type errors

## Common Component Mistakes (AVOID THESE)

### ❌ Text Component Mistakes:

**MISTAKE 1: Using non-existent 'weight' prop**
```typescript
// ❌ WRONG - Text has NO weight prop
<Text truncate weight="semibold">Title</Text>

// ✅ CORRECT - Use variant instead
<Text variant="body-strong">Title</Text>
<Text variant="heading-subsection">Title</Text>
```

**MISTAKE 2: Using invalid variant values**
```typescript
// ❌ WRONG - 'caption' is not a valid variant
<Text variant="caption">Small text</Text>

// ✅ CORRECT - Use caption-normal, caption-light, etc.
<Text variant="caption-normal">Small text</Text>
<Text variant="caption-strong">Small text</Text>
```

**MISTAKE 3: Using className for text color**
```typescript
// ❌ WRONG - Use color prop, not className
<Text className="text-cn-text-secondary">Text</Text>

// ✅ CORRECT - Use color prop
<Text color="foreground-3">Text</Text>
<Text color="success">Success text</Text>
```

### ❌ StatusBadge Component Mistakes:

**MISTAKE 1: Using 'default' theme**
```typescript
// ❌ WRONG - 'default' is not a valid theme
const theme = status === 'Success' ? 'success' : 'default'
<StatusBadge theme={theme}>Status</StatusBadge>

// ✅ CORRECT - Use 'muted' as default
const theme = status === 'Success' ? 'success' : status === 'Failed' ? 'danger' : 'muted'
<StatusBadge theme={theme} variant="status">{status}</StatusBadge>
```

### ❌ IconV2 Type Mistakes:

**MISTAKE 1: Using wrong type for icon name**
```typescript
// ❌ WRONG - Using IconPropsV2['name']
const getTriggerIcon = (type: string): IconPropsV2['name'] => {
  return 'webhook'
}

// ✅ CORRECT - Use IconV2NamesType
import { IconV2NamesType } from '@harnessio/ui/components'
const getTriggerIcon = (type: string): IconV2NamesType => {
  return 'webhook'
}
```

**MISTAKE 2: Wrong type in action arrays**
```typescript
// ❌ WRONG - Using IconPropsV2['name']
iconName: 'trash' as IconPropsV2['name']

// ✅ CORRECT - Use IconV2NamesType
import { IconV2NamesType } from '@harnessio/ui/components'
iconName: 'trash' as IconV2NamesType
```

**MISTAKE 3: Using className for icon color instead of color prop**
```typescript
// ❌ WRONG - Using className for icon color
<IconV2 name="check" className="text-cn-success-primary" />
<IconV2 name="info" className="text-red-500" />
<IconV2 name="warning" className="text-cn-warning" />

// ✅ CORRECT - Use color prop with IconV2Color type
import { IconV2 } from '@harnessio/ui/components'
<IconV2 name="check" color="success" />
<IconV2 name="info" color="danger" />
<IconV2 name="warning" color="warning" />

// Valid IconV2Color values (verify in icon-v2 type definitions):
// - 'inherit'
// - 'success'
// - 'danger'
// - 'warning'
// - 'info'
// - 'primary'
// - 'secondary'
// - etc. (read component source to get full list)
```

**Why this matters**:
- The `color` prop uses predefined semantic colors that match the design system
- Using className bypasses the component's color system and may break with theme changes
- IconV2Color type ensures type safety and IDE autocomplete
- Color prop values are consistent across the application

### ❌ DataTable Sorting Mistakes:

**MISTAKE 1: Wrong onSortingChange signature**
```typescript
// ❌ WRONG - Handler only accepts SortingState
onSortingChange={(sorting: SortingState) => {
  handleSort(sorting)
}}

// ✅ CORRECT - Handler must accept Updater<SortingState>
onSortingChange={(updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
  const newSorting = typeof updaterOrValue === 'function'
    ? updaterOrValue(currentSorting)
    : updaterOrValue
  handleSort(newSorting)
}}
```

### ❌ Import Path Mistakes:

**CRITICAL**: Base UI components always come from `@harnessio/ui/components`. Gitness-local code lives under `src/pages-v2/`, `src/components-v2/`, and `src/framework/`.

**MISTAKE 1: Reimplementing base UI locally**
```typescript
// ❌ WRONG - Custom button instead of design system
import { Button } from '../components-v2/button'

// ✅ CORRECT - Use design system
import { Button } from '@harnessio/ui/components'
```

**MISTAKE 2: Putting containers in components-v2**
```typescript
// ❌ WRONG - Page container in components-v2
// components-v2/repo-list-page.tsx with routing and data fetching

// ✅ CORRECT - Container in pages-v2, reusable UI in components-v2 or @harnessio/views
// pages-v2/repo/repo-list.tsx — fetches data, passes props to view
```

**MISTAKE 3: API calls outside containers**
```typescript
// ❌ WRONG - Mutation hook in a dumb presentational component
// components-v2/repo-card.tsx calling useCreateRepositoryMutation

// ✅ CORRECT - Data fetching/mutations in pages-v2 containers; pass callbacks as props
```

**Gitness source layout**:
- `src/pages-v2/` — route pages, data fetching, mutations (containers)
- `src/components-v2/` — gitness-specific composite UI
- `src/framework/` — context providers, hooks, routing utils, RBAC
- `@harnessio/views` — shared presentational views (RepoCreatePage, layouts, etc.)
- `@harnessio/ui/components` — base UI (Button, Text, IconV2, Layout, DataTable, Dialog, etc.)
- `@harnessio/code-service-client` — API hooks and types

### How to Avoid These Mistakes:

1. **ALWAYS read the component source code** before using it
2. **NEVER assume a prop exists** - verify in source code
3. **NEVER guess prop values** - extract from cva() variants
4. **List valid values** before writing code
5. **Cross-reference your code** against the source

## Component Verification Process (MANDATORY)

**Every time you use a component, follow these steps:**

### Step 1: Check and Read Configuration
```bash
# Check if .ui-builder-config.json exists at repository root
# If it doesn't exist, create it with the template from "START HERE" section

# Read .ui-builder-config.json
# Extract these paths:
# - uiComponentsSourcePath: "/path/to/canary/packages/ui/src/components"
# - tailwindConfigPath: "/path/to/canary/packages/ui/tailwind-design-system.ts"
# - portalPath: "/path/to/canary/apps/portal"

# Verify the paths exist before proceeding
```

### Step 2: Read Component Source Code (NOT OPTIONAL)
```bash
# For component "Text", read:
# {uiComponentsSourcePath}/text.tsx

# For component "Button", read:
# {uiComponentsSourcePath}/button.tsx
# OR
# {uiComponentsSourcePath}/button/button.tsx

# For compound components like "StatusBadge", read:
# {uiComponentsSourcePath}/status-badge/status-badge.tsx
```

**CRITICAL**: You must READ THE ACTUAL FILE, not just know the path!

### Step 3: Find the cva() Configuration
Look for the `cva()` function call in the component file:

```typescript
// Example from text.tsx:
export const textVariants = cva('', {
  variants: {
    variant: {
      'heading-hero': '...',
      'heading-section': '...',
      'body-normal': '...',
      'caption-normal': '...',
      // ... etc
    },
    color: {
      inherit: '...',
      'foreground-1': '...',
      // ... etc
    },
    truncate: {
      true: 'truncate'
    }
  },
  defaultVariants: {
    variant: 'body-normal',
    color: 'foreground-2'
  }
})
```

### Step 4: Extract ALL Valid Prop Values
From the cva() configuration, create a list:

1. **List ALL variant keys**: These are the ONLY valid prop names
2. **List ALL values for each variant**: These are the ONLY valid values
3. **Note default values**: From `defaultVariants` object
4. **Check for boolean props**: Look for `{ true: '...' }` pattern
5. **NO GUESSING**: If a prop isn't in variants, it doesn't exist

**Example extraction for Text component**:
```typescript
// Valid props (from variants object):
variant?: 'heading-hero' | 'heading-section' | 'heading-subsection' | 'heading-base' |
          'heading-small' | 'body-normal' | 'body-single-line-normal' | 'body-strong' |
          'body-single-line-strong' | 'body-code' | 'caption-normal' | 'caption-light' |
          'caption-strong' | 'caption-single-line-normal' | 'caption-single-line-light'
color?: 'inherit' | 'foreground-1' | 'foreground-2' | 'foreground-3' | 'disabled' |
        'success' | 'warning' | 'merged' | 'danger' | 'brand'
align?: 'left' | 'center' | 'right'
truncate?: boolean  // NOT a string!
lineClamp?: 'default' | 1 | 2 | 3 | 4 | 5 | 6
wrap?: 'wrap' | 'nowrap' | 'pretty' | 'balance'

// Default values:
variant defaults to 'body-normal'
color defaults to 'foreground-2'

// NON-EXISTENT props (DO NOT USE):
weight  // Does not exist!
size    // Does not exist!
bold    // Does not exist!
```

### Step 5: Verify Icon Names (if using IconV2)
```bash
# Read icon name mappings:
# {uiComponentsSourcePath}/icon-v2/icon-name-map.ts

# Check the IconNameMapV2 object keys
# ONLY use icon names present in this map
# ALWAYS use IconV2NamesType type (NOT IconPropsV2['name'])
```

### Step 6: Verify Design Tokens (if using Tailwind classes)
```bash
# Read Tailwind config:
# {tailwindConfigPath}

# Verify:
# - Color tokens: bg-cn-*, text-cn-*, border-cn-*
# - Spacing tokens: p-cn-*, m-cn-*, gap-cn-*
# - Size tokens: w-cn-*, h-cn-*, size-cn-*
# - Other custom utilities defined in config
```

### Step 7: Construct Type-Safe Code
Use ONLY:
- Props that exist in the cva() variants
- Values that match the extracted valid values EXACTLY
- Icon names that exist in IconNameMapV2, typed as IconV2NamesType
- Design tokens that exist in tailwind config
- Required props must always be provided
- If a prop doesn't exist in cva(), use className instead (carefully)

### Complete Example Workflow

**Task**: Use a Button component with an icon

**Step 0: Check config exists**
```typescript
// Check if .ui-builder-config.json exists at repository root
// If not, create it using the template from "START HERE" section
```

**Step 1: Read config**
```typescript
// Read .ui-builder-config.json
// uiComponentsSourcePath = "/Users/pranesh/Documents/unified-universe/canary/packages/ui/src/components"
```

**Step 2: Read Button type definition**
```typescript
// Read: {uiComponentsSourcePath}/button/button.tsx
// Found ButtonProps interface:
// {
//   variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'transparent' | 'ai'
//   theme?: 'default' | 'success' | 'danger'
//   size?: 'xs' | 'sm' | 'md' | 'lg'
//   iconOnly?: boolean
//   onClick?: (e: MouseEvent) => void | Promise<void>
//   children?: ReactNode
//   // ... other props
// }
```

**Step 3: Read IconV2 valid names**
```typescript
// Read: {uiComponentsSourcePath}/icon-v2/icon-name-map.ts
// Found valid icon names include: 'plus', 'trash', 'edit-pencil', 'check', etc.
```

**Step 4: Write type-safe code**
```typescript
import { Button, IconV2 } from '@harnessio/ui/components'

// ✅ CORRECT - All values verified from type definitions
<Button variant="primary" size="md" theme="success">
  <IconV2 name="plus" /> {/* 'plus' verified in IconNameMapV2 */}
  Add Item
</Button>

// ❌ WRONG - 'large' is not a valid size (valid: xs, sm, md, lg)
<Button size="large">Click</Button>

// ❌ WRONG - 'add' is not a valid icon name
<Button><IconV2 name="add" />Click</Button>

// ❌ WRONG - 'warning' is not a valid theme (valid: default, success, danger)
<Button theme="warning">Click</Button>
```

**This process is NON-NEGOTIABLE for every component you use.**

## Response Style

- **Concise**: Get straight to the point
- **Accurate**: Reference component source code from `@harnessio/ui/components` and `tailwind-design-system.ts`
- **Practical**: Provide code examples
- **Complete**: Include both what to do and what NOT to do

## Question Categories

### 1. "How do I...?" Questions

Provide a complete, working example with:
- Required imports
- Full code snippet
- Explanation of key points
- Common pitfalls to avoid

**Example Response**:
```markdown
To create a button with a loading state:

```typescript
import { Button } from '@harnessio/ui/components'

// Auto-loading with async onClick
<Button variant="primary" onClick={async () => await saveData()}>
  Save Changes
</Button>
```

**Key Points**:
- Button automatically shows loading state during async operations
- No need for manual loading state management
- Use `variant="primary"` for main actions, `variant="outline"` for secondary actions

**DON'T**: Never use raw HTML `<button>` elements
```
```

### 2. "What's the difference between...?" Questions

Provide a comparison table or side-by-side examples:

**Example Response**:
```markdown
### FormInput.Text vs TextInput

| Aspect | FormInput.Text | TextInput |
|--------|---------------|-----------|
| Use Case | Inside forms with React Hook Form | Standalone input |
| Validation | Automatic via Zod schema | Manual |
| Error Display | Automatic | Manual |
| Registration | Via `{...register('field')}` | N/A |

**Use FormInput.Text when**:
- Building forms with React Hook Form
- Need automatic validation
- Want integrated error messages

**Use TextInput when**:
- Building non-form UI
- Need controlled input outside form context
- Implementing custom validation logic
```

### 3. "Can I...?" Questions

Give a clear YES/NO answer with explanation:

**Example Response**:
```markdown
**❌ NO** - You should NOT use raw HTML `<div className="flex">` elements.

**Instead, use**: `<Layout.Flex>`

```typescript
// ❌ WRONG
<div className="flex items-center gap-4">
  <span>Icon</span>
  <span>Text</span>
</div>

// ✅ CORRECT
import { Layout, Text, IconV2 } from '@harnessio/ui/components'

<Layout.Flex align="center" gap="md">
  <IconV2 name="check" />
  <Text>Text</Text>
</Layout.Flex>
```
```

### 4. "What component should I use for...?" Questions

Recommend the correct component with usage example:

**Example Response**:
```markdown
For displaying a list of selectable cards, use **CardSelect**:

```typescript
import { CardSelect } from '@harnessio/ui/components'

<CardSelect
  options={[
    {
      value: 'option1',
      title: 'Option 1',
      description: 'First option description',
      icon: 'check'
    },
    {
      value: 'option2',
      title: 'Option 2',
      description: 'Second option description',
      icon: 'star'
    }
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
/>
```

**Alternative**: If you need more control over card layout, use `Card.Root` with radio buttons or checkboxes.
```

### 5. "Why is my...?" Troubleshooting Questions

Identify common issues and provide solutions:

**Example Response**:
```markdown
### Common Causes of Form Validation Not Working

**1. Missing `z.coerce.number()` for number inputs**
```typescript
// ❌ WRONG - Will fail validation
age: z.number().min(18)

// ✅ CORRECT - Use z.coerce for form inputs
age: z.coerce.number().min(18)
```

**2. Not spreading register() correctly**
```typescript
// ❌ WRONG
<FormInput.Text register={register('name')} />

// ✅ CORRECT
<FormInput.Text {...register('name')} />
```

**3. Missing FormWrapper**
```typescript
// ❌ WRONG - Direct form element
<form onSubmit={handleSubmit(onSubmit)}>

// ✅ CORRECT - Use FormWrapper
<FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
```
```

## Quick Reference Tables

### Component Lookup Table

**NOTE**: This table lists **BASE UI components** from `@harnessio/ui/components` ONLY.
- Gitness-specific composites go in `src/components-v2/`; page containers in `src/pages-v2/`
- NEVER import base UI components (Button, Text, Layout, etc.) from local paths

| Need | Component | Import |
|------|-----------|--------|
| Button | `Button` | `@harnessio/ui/components` |
| Text input | `TextInput` or `FormInput.Text` | `@harnessio/ui/components` |
| Search input | `SearchInput` ⚠️ NOT `Input` | `@harnessio/ui/components` |
| Dropdown | `Select` or `DropdownMenu` | `@harnessio/ui/components` |
| Table row actions (RBAC) | `RbacMoreActionsTooltip` ⚠️ NOT `Dropdown` | `@harnessio/ui/components` |
| Modal/Dialog | `Dialog.Root` | `@harnessio/ui/components` |
| Layout (flex) | `Layout.Flex` | `@harnessio/ui/components` |
| Layout (grid) | `Layout.Grid` | `@harnessio/ui/components` |
| Text/Headings | `Text` | `@harnessio/ui/components` |
| Icons | `IconV2` (use `IconV2NamesType` for names, `color` prop for colors) | `@harnessio/ui/components` |
| Form wrapper | `FormWrapper` | `@harnessio/ui/components` |
| Tabs | `Tabs.Root` | `@harnessio/ui/components` |
| Card | `Card.Root` | `@harnessio/ui/components` |
| Table | `DataTable` or `TableV2` | `@harnessio/ui/components` |
| Toast | `toast` ⚠️ NOT `useToast`/`useToaster` | `@harnessio/ui/components` |
| Accordion | `Accordion.Root` | `@harnessio/ui/components` |

### Design Token Lookup

**⚠️ CRITICAL: Always verify tokens against `tailwind-design-system.ts` from config before using!**

These are **example patterns** - actual tokens MUST be verified in the config file:

| Need | Token Pattern | Example (Verify First!) |
|------|--------------|-------------------------|
| Background color | `bg-cn-{0-3}` or `bg-cn-{status}-{variant}` | `bg-cn-brand-primary` |
| Text color | `text-cn-{1-3}` or `text-cn-{status}-{variant}` | `text-cn-success-primary` |
| Border | `border-cn-{1-3}` | `border-cn-2` |
| Spacing | `gap-cn-{size}`, `p-cn-{size}`, `m-cn-{size}` | `gap-cn-md`, `p-cn-lg` |
| Size | `size-cn-{0-96}`, `h-cn-{value}`, `w-cn-{value}` | `h-cn-48` |
| Radius | `rounded-{1-7}`, `rounded-cn-input` | `rounded-3` |

**MANDATORY Verification Process**:
1. Read `.ui-builder-config.json` to get `tailwindConfigPath`
2. Read the Tailwind config file from that path
3. Verify the token exists in the config
4. Use ONLY tokens that are defined in the config
5. Match token names EXACTLY as defined (including case and separators)

**Common Verification Steps**:
```typescript
// Step 1: Read config
// tailwindConfigPath = "/path/to/canary/packages/ui/tailwind-design-system.ts"

// Step 2: Read tailwind-design-system.ts
// Check theme.extend.colors, theme.extend.spacing, etc.

// Step 3: Verify token exists
// ✅ If token is defined: Use it
// ❌ If token is NOT defined: Do NOT use it, find alternative

// Step 4: Use exact token name
// ✅ bg-cn-brand-primary (if defined in config)
// ❌ bg-cn-primary-brand (wrong order)
// ❌ bg-brand-primary (missing cn- prefix)
```

**DO NOT**:
- Invent token names that "seem right"
- Assume a token exists without verification
- Use arbitrary values like `p-[16px]` - use design tokens instead
- Mix standard Tailwind with custom tokens without verification

### Form Validation Patterns

| Input Type | Zod Schema | Example |
|------------|------------|---------|
| Text (required) | `z.string().min(1)` | `z.string().min(1, 'Name required')` |
| Text (optional) | `z.string().optional()` | `z.string().optional()` |
| Email | `z.string().email()` | `z.string().email('Invalid email')` |
| Number | `z.coerce.number()` | `z.coerce.number().min(0)` |
| Boolean | `z.boolean()` | `z.boolean()` |
| Enum | `z.enum([...])` | `z.enum(['admin', 'user'])` |
| Array | `z.array(z.string())` | `z.array(z.string()).min(1)` |
| Object | `z.object({...})` | `z.object({ name: z.string() })` |

## Common Patterns Reference

### Pattern: Form with Validation
```typescript
const schema = z.object({ field: z.string().min(1) })
type FormValues = z.infer<typeof schema>
const formMethods = useForm<FormValues>({ resolver: zodResolver(schema) })

<FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
  <FormInput.Text {...register('field')} label="Field" />
  <Button type="submit">Submit</Button>
</FormWrapper>
```

### Pattern: Dialog with Form
```typescript
<Dialog.Body>
  <FormWrapper id="my-form" {...formMethods} onSubmit={handleSubmit(onSubmit)}>
    <FormInput.Text {...register('field')} label="Field" />
  </FormWrapper>
</Dialog.Body>
<Dialog.Footer>
  <Button type="submit" form="my-form">Submit</Button>
</Dialog.Footer>
```

### Pattern: Async Button
```typescript
<Button onClick={async () => {
  await saveData()
  toast.success({ title: 'Saved!' })
}}>
  Save
</Button>
```

### Pattern: Layout Composition
```typescript
<Layout.Flex direction="row" align="center" justify="between" gap="md">
  <Text variant="heading-subsection">Title</Text>
  <Button variant="primary">Action</Button>
</Layout.Flex>
```

### Pattern: Loading State
```typescript
{isLoading ? (
  <Spinner />
) : (
  <Text>{data}</Text>
)}
```

### Pattern: Error Handling
```typescript
try {
  await apiCall()
  toast.success({ title: 'Success!' })
} catch (error) {
  toast.danger({
    title: 'Error',
    description: error instanceof Error ? error.message : 'Unknown error'
  })
}
```

## Response Guidelines

1. **Check Configuration File Exists**: Check if `.ui-builder-config.json` exists at repository root
   - If missing, inform user to create it using the template from "START HERE" section
   - Provide the sample configuration with correct paths
2. **Read Configuration First**: Always read `.ui-builder-config.json` to get source paths
3. **Verify Before Recommending**: Read component type definitions before suggesting any component
4. **Be Direct**: Answer the specific question first
5. **Provide Context**: Explain why it's done this way
6. **Show Examples**: Include working code snippets with type-verified props
7. **Reference Source Code**: Cite component implementation from `@harnessio/ui/components` source and show which props are valid
8. **Highlight Gotchas**: Warn about common mistakes, especially type errors
9. **Offer Alternatives**: Suggest related approaches when relevant (after verifying their types too)
10. **Verify CSS Classnames**: Read `tailwind-design-system.ts` from config and verify classnames follow the defined patterns
11. **Follow Critical Guidelines**: ALWAYS adhere to the "Critical Guidelines - Common Mistakes to Avoid" section above
12. **Ensure Type Safety**: Every code example must be type-correct with zero errors
13. **Document Type Verification**: When providing complex examples, show the verification process (which types you checked)

## Example Responses

### Q: "How do I create a form with multiple inputs?"

**A**: Use React Hook Form with Zod validation and FormWrapper:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormWrapper, FormInput, Button, Layout } from '@harnessio/ui/components'

const schema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Invalid email'),
  age: z.coerce.number().min(18, 'Must be 18+'),
})

type FormValues = z.infer<typeof schema>

export const MultiFieldForm: React.FC = () => {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', email: '', age: 0 }
  })

  const { register, handleSubmit } = formMethods

  const onSubmit = async (data: FormValues) => {
    await saveUser(data)
    toast.success({ title: 'User saved!' })
  }

  return (
    <FormWrapper {...formMethods} onSubmit={handleSubmit(onSubmit)}>
      <Layout.Vertical gap="md">
        <FormInput.Text {...register('firstName')} label="First Name" />
        <FormInput.Text {...register('lastName')} label="Last Name" />
        <FormInput.Text {...register('email')} label="Email" type="email" />
        <FormInput.Number {...register('age')} label="Age" />
        <Button type="submit" variant="primary">Save</Button>
      </Layout.Vertical>
    </FormWrapper>
  )
}
```

**Key Points**:
- Use `z.coerce.number()` for number inputs (not `z.number()`)
- Always spread `{...register('fieldName')}`
- Use `z.infer<typeof schema>` for TypeScript types
- FormWrapper automatically handles form state and validation display

---

### Q: "What's the difference between Button variants?"

**A**: Button has 7 variants for different UI contexts:

| Variant | Use Case | Example |
|---------|----------|---------|
| `primary` | Main actions | Save, Create, Submit |
| `secondary` | Secondary actions | Cancel, Back |
| `outline` | Subtle actions | Edit, View Details |
| `ghost` | Minimal emphasis | Menu items, inline actions |
| `link` | Text-like actions | Links, navigation |
| `transparent` | Completely invisible until hover | Overlay actions |
| `ai` | AI-specific features | AI Generate, AI Suggest |

```typescript
<Button variant="primary">Save Changes</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost" iconOnly aria-label="Settings">
  <IconV2 name="settings" skipSize />
</Button>
```

**Themes**: Combine with `theme` prop for semantic colors:
- `theme="success"` - Green for positive actions
- `theme="danger"` - Red for destructive actions
- `theme="default"` - Standard brand colors (default)

---

### Q: "Can I use inline styles?"

**❌ NO** - Inline styles are not allowed.

**Why**: They bypass the design system and break theme consistency.

**Instead**: Use Tailwind classes with `cn-` prefix tokens:

```typescript
// ❌ WRONG
<div style={{ backgroundColor: '#0066cc', padding: '16px' }}>

// ✅ CORRECT
<div className="bg-cn-brand-primary p-cn-lg">
```

**Exception**: Only for truly dynamic values that can't be expressed with design tokens (rare):
```typescript
// OK for dynamic positioning
<div style={{ transform: `translateX(${x}px)` }}>
```

---

## Summary: Type Safety is Paramount

**Remember**: Your primary goal is to provide fast, accurate, actionable answers that help developers write **type-safe, error-free** code.

**Every response you provide must:**
1. ✅ Check if `.ui-builder-config.json` exists (create if missing with template)
2. ✅ Read `.ui-builder-config.json` for source paths
3. ✅ Verify paths in config are valid
4. ✅ Verify component types before recommending
5. ✅ Use only valid prop values from type definitions
6. ✅ Verify icon names from `IconNameMapV2`
7. ✅ Verify design tokens from `tailwind-design-system.ts`
8. ✅ Generate code with ZERO type errors
9. ✅ Document which types you verified (for complex examples)

**Failure to follow this process will result in:**
- ❌ TypeScript compilation errors
- ❌ Runtime errors from invalid props
- ❌ Broken UI components
- ❌ Wasted developer time debugging

**When in doubt:**
- Read the source code
- Verify the types
- Check the implementation
- Test your recommendations

**This skill should be invoked:**

- Via **ui-builder** Step 1 (Tiers 2–3) on every gitness UI task
- When debugging UI prop/type errors
- When uncertain about component APIs (read source, do not guess)

**For gitness workflow, architecture, and canonical patterns → `ui-builder/SKILL.md` first.**

**Type safety is not optional. It is mandatory.**
