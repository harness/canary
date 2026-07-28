# Stepper Component Design

## Motivation

The platform has multiple multi-step workflows (onboarding wizards, pipeline setup, connector configuration) that need a consistent progress visualization. Today:

- **The existing stepper (`DrawerSteps`/`DrawerStep`/`DrawerSubStep`) is tightly coupled to the dual-pane drawer** — it can't be used in standalone contexts like full-page wizards or inline card flows.
- **No dynamic substep support** — workflows where user choices reveal additional steps (e.g., selecting GitHub vs GitLab shows different authentication substeps) require manual orchestration outside the component.
- **No loading, error, or blocking states** — consumers resort to ad-hoc UI treatments that differ across the product.
- **No accessibility** — missing keyboard navigation, ARIA attributes, and screen reader announcements.
- **No current consumers** — the drawer stepper was built speculatively and never adopted, so we can replace it without migration.

This spec defines a standalone, general-purpose stepper that addresses all of the above and becomes the single stepper component for the design system.

## Overview

A standalone, reusable stepper component for `@harnessio/ui` (canary) that visualizes multi-step workflows with progress tracking. Replaces the existing drawer-coupled stepper with a general-purpose component usable anywhere — including the dual-pane drawer.

## Key Design Decisions

| Decision                                 | Choice                                                      | Why                                                                                                                                                                                |
| ---------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Controlled-only (no internal state)      | `value` + `onValueChange` required                          | Consumer owns navigation logic; avoids hidden state bugs. Matches pattern of other canary components (Tabs, Accordion).                                                            |
| Compound component pattern               | `Stepper.Root` / `.Step` / `.SubStep`                       | Enables conditional rendering for branching (consumer uses standard React `{condition && <SubStep />}`). Config-object approach would require a custom DSL for dynamic branches.   |
| Registration pattern (mount/unmount)     | Steps register via `useEffect`                              | Supports dynamic substeps without consumer needing to imperatively add/remove from a list. Stepper always reflects what's actually rendered.                                       |
| CSS-only transition animations           | `transition-delay` chaining, no JS orchestration            | Browser compositor schedules the full timeline atomically — avoids frame-gap stutters from `onTransitionEnd` JS handoffs. Animation is fire-and-forget (no mid-flow abort needed). |
| Context hook kept internal               | `useStepperContext` not exported                            | Preserves freedom to restructure internals (split context, switch to store) without breaking consumers. Can open later if use case emerges.                                        |
| Single linear list                       | Branching via conditional render, not a graph/state-machine | Avoids routing complexity. From the user's perspective, the path is always linear — they see a flat list of steps/substeps representing their specific branch.                     |
| `blocking` separate from `state="error"` | Two independent props                                       | Not all errors block progress (e.g., non-critical warning), and not all blocks are errors (e.g., "must complete this step before proceeding"). Orthogonal concerns stay separate.  |
| Forward animate, backward snap           | Transitions only on forward progression                     | Forward animation creates the "flow" feeling. Backward is a correction — animating it feels sluggish and fights user intent.                                                       |

## Assumptions & Dependencies

| Assumption                                                 | Risk if wrong                                                                                                                                                    |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No current consumers of `DrawerSteps`                      | If consumers exist, we'd need migration support. Verified via codebase search — zero imports outside the component's own files.                                  |
| `AlertDialog` API is stable                                | Our confirmation dialog delegates entirely to AlertDialog. If its API changes, our navigation guard UX breaks. Low risk — AlertDialog is mature and widely used. |
| `IconV2` icons (`check`, `minus`, `xmark`, `loader`) exist | Build failure. Verified — all four exist in the icon set.                                                                                                        |
| `SkeletonBase` shimmer animation works at arbitrary sizes  | Used for empty state. If it requires fixed dimensions, skeleton rows would need custom shimmer. Verified — it's flex-friendly.                                   |
| `--cn-*` design tokens are stable across themes            | If tokens are renamed, colors break. Low risk — these are the foundational token layer, changes would be breaking across the entire system.                      |
| No consumers need horizontal orientation                   | If a horizontal stepper is requested soon after ship, we'd need to add it. Acceptable — vertical covers all current known use cases.                             |

## Location

`packages/ui/src/components/stepper/`

## Consumer API

### Usage

```tsx
const [currentStep, setCurrentStep] = useState('version-control')

<Stepper.Root
  value={currentStep}
  onValueChange={setCurrentStep}
  title="Build pipeline setup"
  onBeforeChange={(from, to) => {
    if (isDestructiveNav(from, to))
      return "Going back will reset your connectivity check."
    return true
  }}
>
  <Stepper.Step
    value="version-control"
    title="Select Version Control"
    description="Choose your VCS provider"
  />
  <Stepper.Step
    value="connectivity"
    title="Check Connectivity"
    description="Verify access to your repo"
  >
    {provider === 'github' && (
      <>
        <Stepper.SubStep value="conn.oauth" title="Authenticate" description="OAuth with GitHub" />
        <Stepper.SubStep value="conn.test" title="Test Connection" description="Ping repository endpoint" />
      </>
    )}
    {provider === 'gitlab' && (
      <Stepper.SubStep value="conn.token" title="Enter Access Token" description="Paste your PAT" />
    )}
  </Stepper.Step>
  <Stepper.Step
    value="repository"
    title="Select a repository"
    description="Pick the repo to build"
  />
  <Stepper.Step
    value="pipeline"
    title="Generate Pipeline"
    description="Create your CI config"
  />
</Stepper.Root>
```

### Props

#### `Stepper.Root`

| Prop             | Type                                              | Required | Default | Description                                                                                            |
| ---------------- | ------------------------------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `value`          | `string`                                          | yes      | —       | Current active step or substep value                                                                   |
| `onValueChange`  | `(value: string) => void`                         | yes      | —       | Callback when step changes                                                                             |
| `title`          | `ReactNode`                                       | no       | —       | Header title (e.g., "Build pipeline setup")                                                            |
| `onBeforeChange` | `(from: string, to: string) => boolean \| string` | no       | —       | Navigation guard. Return `true` to allow, `false` to block, string to show confirmation dialog         |
| `showConnectors` | `boolean`                                         | no       | `true`  | Show connector lines between steps                                                                     |
| `completed`      | `boolean`                                         | no       | `false` | Mark entire flow as completed. Active step flips to completed; skipped/error steps retain their state. |
| `skeletonCount`  | `number`                                          | no       | `3`     | Number of skeleton step rows to show when no Step children are mounted                                 |
| `className`      | `string`                                          | no       | —       | Additional CSS class                                                                                   |

#### `Stepper.Step`

| Prop          | Type                   | Required | Default | Description                                                                                         |
| ------------- | ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------- |
| `value`       | `string`               | yes      | —       | Unique step identifier                                                                              |
| `title`       | `ReactNode`            | yes      | —       | Step title                                                                                          |
| `description` | `ReactNode`            | no       | —       | Description text below title                                                                        |
| `state`       | `'skipped' \| 'error'` | no       | —       | Override step state (skipped = completed without action, error = step failed)                       |
| `loading`     | `boolean`              | no       | `false` | Show spinner in place of the step indicator icon (for async work)                                   |
| `blocking`    | `boolean`              | no       | `false` | Prevents navigation to any step after this one (use with `state="error"` for blocking errors)       |
| `hasSubSteps` | `boolean`              | no       | `false` | Show placeholder branch when step has no mounted SubStep children (hints that substeps will appear) |
| `disabled`    | `boolean`              | no       | `false` | Explicitly disable this step (non-navigable regardless of state)                                    |
| `className`   | `string`               | no       | —       | Additional CSS class                                                                                |
| `children`    | `ReactNode`            | no       | —       | SubStep components                                                                                  |

#### `Stepper.SubStep`

| Prop              | Type        | Required | Default | Description                                                                                                                                                                      |
| ----------------- | ----------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`           | `string`    | yes      | —       | Unique substep identifier                                                                                                                                                        |
| `title`           | `ReactNode` | yes      | —       | Substep title                                                                                                                                                                    |
| `description`     | `ReactNode` | no       | —       | Description text below title                                                                                                                                                     |
| `visualCompleted` | `boolean`   | no       | `false` | Presentation-only: render this substep's icon/color/title as 'completed' regardless of `state`. Does NOT affect accordion-open behavior, which always reflects the real `state`. |
| `className`       | `string`    | no       | —       | Additional CSS class                                                                                                                                                             |

## State Management

### Step States

| State       | When                                             | Navigable            | Icon                                      |
| ----------- | ------------------------------------------------ | -------------------- | ----------------------------------------- |
| `completed` | Index < active, or within furthest-reached       | Yes                  | Green filled circle + check icon          |
| `active`    | Value matches this step (or one of its substeps) | Yes                  | Blue filled circle + step number          |
| `upcoming`  | Index > active AND beyond furthest-reached       | No (button disabled) | Gray bordered circle + step number        |
| `skipped`   | `state="skipped"` prop set                       | Yes                  | Muted gray circle + check icon            |
| `error`     | `state="error"` prop set                         | Yes                  | Red bordered circle + xmark icon          |
| `loading`   | `loading` prop is true on active step            | No (in progress)     | Blue filled circle + spinning loader icon |

> **Note:** `loading` is a visual modifier on the `active` state, not a distinct `StepState` value. A loading step remains `'active'` in the type system — the `loading` prop only affects rendering (spinner icon + shimmer text).

### State Derivation

Priority order:

1. Explicit `state="error"` prop → `'error'` (preserved even when `completed` is true)
2. Explicit `state="skipped"` prop → `'skipped'` (preserved even when `completed` is true)
3. `completed` prop is true → `'completed'` (all remaining steps flip to completed)
4. Value matches → `'active'`
5. Index < active index → `'completed'`
6. Index ≤ furthest-reached index → `'completed'`
7. Otherwise → `'upcoming'`

### Furthest-Reached Tracking

The stepper tracks the highest step index ever reached. This allows users to navigate back to any previously visited step. Combined with `onBeforeChange`, consumers can warn about destructive backward navigation.

### Context Shape (internal)

```typescript
type StepState = 'completed' | 'active' | 'upcoming' | 'skipped' | 'error'

type StepperContextType = {
  value: string
  onValueChange: (value: string) => void
  onBeforeChange?: (from: string, to: string) => boolean | string
  registerStep: (value: string) => () => void
  registerSubStep: (parentValue: string, subStepValue: string) => () => void
  getStepState: (stepValue: string) => StepState
  getSubStepState: (parentValue: string, subStepValue: string) => StepState
  getStepIndex: (stepValue: string) => number
  totalSteps: number
  currentStepNumber: number
  selectStep: (stepValue: string) => void
  selectSubStep: (subStepValue: string) => void
  showConnectors: boolean
}
```

### Navigation Guard Flow

1. User clicks a step
2. Is the step `disabled`? → block (button is disabled regardless of state)
3. Is the target step navigable? (completed, active, skipped, or error — NOT upcoming)
4. Is there a `blocking` step between the current step and the target? If target is forward of a blocking step → block navigation (button stays disabled)
5. `onBeforeChange(from, to)` fires (if provided)
6. Returns `true` → proceed with `onValueChange(to)`
7. Returns `false` → block navigation silently
8. Returns a string → show built-in `AlertDialog` with the string as message body
9. User confirms dialog → proceed with `onValueChange(to)`
10. User cancels dialog → no-op

### Blocking Steps

When a step has `blocking={true}`:

- All steps after the blocking step are forced to `upcoming` state (non-navigable), regardless of furthest-reached
- The user cannot advance past the blocking step until `blocking` is removed by the consumer
- The user CAN still navigate backwards to previously completed steps
- Typically used with `state="error"` but can be used independently (e.g., a step that requires explicit completion before proceeding)

### SubStep Behavior

- Register with context on mount, deregister on unmount
- Only visible when their parent step is `active`
- If the active substep unmounts (branch changes), focus falls back to the parent step value
- Don't affect the announced step position (top-level steps only)
- Consumer owns branching logic — renders substeps conditionally based on their own state
- Stepper sees a flat list of whatever substeps are currently mounted under a parent

### Header

When the optional `title` prop is provided, the stepper renders a header above the step list
displaying that title. The header is omitted entirely when `title` is not set. There is no visible
progress counter — the current step position is exposed only to assistive tech via the live region
(see [Accessibility](#accessibility)).

### Completion State

When the `completed` prop is `true`:

- The active step (and any remaining upcoming steps) flip to `completed` state
- Steps with explicit `state="error"` or `state="skipped"` retain their state
- All steps remain navigable (user can click back to review)
- The `value` prop is still respected for focus/keyboard navigation

## Visual Design

### DOM Structure

Every step renders as a `<button>` — disabled when not navigable (upcoming state).

```html
<nav class="cn-stepper">
  <header class="cn-stepper-header">
    <span class="cn-stepper-title">Build pipeline setup</span>
  </header>
  <ol class="cn-stepper-list">
    <li class="cn-stepper-step-item">
      <button class="cn-stepper-step cn-stepper-step-completed">
        <span class="cn-stepper-indicator">
          <IconV2 name="check" />
        </span>
        <span class="cn-stepper-step-content">
          <span class="cn-stepper-step-title">...</span>
          <span class="cn-stepper-step-description">...</span>
        </span>
      </button>
    </li>
  </ol>
</nav>
```

### Connector Layout

Single continuous vertical line on the left, with horizontal arms branching to each substep:

- **Main vertical connector**: runs between step indicators in the left column. Color = previous step's state.
- **Horizontal substep arms**: branch from the main vertical line to each substep indicator. Color = parent step's state (blue when active).
- **No gaps**: connectors touch icons directly in all directions. The indicator icon and connector are in the same flex column.
- **First step**: no connector above it.
- **Last step**: no connector below it.
- **SubStep placeholder**: when `hasSubSteps` is true and no SubStep children are mounted, render a single horizontal arm + small empty gray-bordered circle. Disappears once actual SubStep children mount.

### Indicator Sizing

- Parent steps: 20px diameter circle
- Substeps: 14px diameter circle

### Connector Coloring

**Main vertical connectors (between parent steps):**

The connector below a step takes the color of that step's state:

| Step above state | Connector color | Token                         |
| ---------------- | --------------- | ----------------------------- |
| completed        | green           | `--cn-set-success-primary-bg` |
| active           | blue            | `--cn-set-brand-primary-bg`   |
| upcoming         | light gray      | `--cn-border-2`               |
| skipped          | light gray      | `--cn-border-2`               |
| error            | red             | `--cn-set-danger-primary-bg`  |

**SubStep connectors (vertical segments + horizontal arms):**

Coloring fills progressively as substeps are visited:

| Element                        | Color rule           | Example                                                                     |
| ------------------------------ | -------------------- | --------------------------------------------------------------------------- |
| Horizontal arm to substep      | That substep's state | Arm → completed substep = green, arm → active = blue, arm → upcoming = gray |
| Vertical segment below substep | That substep's state | Below completed substep = green, below active = blue, below upcoming = gray |

Visual example with substeps A(completed), B(active), C(upcoming):

```
├── ● A (completed)     ← arm is green (A is completed)
│                       ← vertical is green (A is completed)
├── ● B (active)        ← arm is blue (B is active)
│                       ← vertical is gray (B is active but C hasn't been reached)
├── ○ C (upcoming)      ← arm is gray (C is upcoming)
```

Note: the vertical segment below the active substep is gray (not blue) because the next substep hasn't been reached yet. The coloring represents "progress made" — only segments leading TO a visited substep are colored.

### SubStep Indicators

| State       | Visual                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------ |
| completed   | Green filled circle + check icon                                                                 |
| active      | Blue filled circle + white dot center                                                            |
| upcoming    | Gray bordered circle + minus icon                                                                |
| placeholder | Gray bordered circle, empty (no icon) — shown when `hasSubSteps` is true but no children mounted |

### Empty / Loading State

When no `Stepper.Step` children are mounted:

- Header renders with the title when the consumer provides one
- Step list shows `skeletonCount` (default 3) skeleton rows matching the step layout:
  - Gray circle placeholder for the indicator (20px, same position as real indicators)
  - Skeleton text line for title
  - Shorter skeleton text line for description
  - Vertical connector skeletons between rows
- Uses existing `SkeletonBase` shimmer animation (7s `cnSkeletonShimmer`)
- Skeleton rows disappear once real Step children mount

### Sizing

- **Min width**: 200px — prevents unreadable collapsed state
- **Max width**: none — fills its container
- **Width**: 100% of parent container

### Text Overflow

- **Titles** (step and substep): single line, truncate with ellipsis via CSS `text-overflow`. No hover tooltip.
- **Descriptions** (step and substep): wrap to multiple lines, no truncation.

### Dark Mode

All colors use `--cn-*` design tokens which resolve correctly in both light and dark modes. No hardcoded hex values in the implementation.

### Alignment

- Substep icons sit flush-left with the parent step's text content
- Horizontal arms span the full distance from the vertical line center to the substep icon (no gaps)

### Reference Rendering

The approved visual design (from brainstorming v11):

```
┌─────────────────────────────────────────────────┐
│ Build pipeline setup                   Step 2/4 │
│                                                 │
│  ✓  Select Version Control                      │
│  │   Choose your VCS provider                   │
│  │                                              │
│  ②  Check Connectivity                          │
│  │   Verify access to your repo                 │
│  │                                              │
│  ├── ● Authenticate                             │
│  │      OAuth with GitHub                       │
│  │                                              │
│  ├── ● Test Connection                          │
│  │      Ping repository endpoint                │
│  │                                              │
│  ├── ○ Verify Permissions                       │
│  │      Check repo access level                 │
│  │                                              │
│  3  Select a repository                         │
│  │   Pick the repo to build                     │
│  │                                              │
│  ├── ○ (placeholder, hasSubSteps=true)          │
│  │                                              │
│  4  Generate Pipeline                           │
│      Create your CI config                      │
└─────────────────────────────────────────────────┘

Legend:
  ✓  = completed (green filled circle + check icon)
  ②  = active (blue filled circle + step number)
  3  = upcoming (gray bordered circle + step number)
  ●  = substep completed (small green) / active (small blue + white dot)
  ○  = substep upcoming (small gray bordered + minus icon)

Connector coloring (shown with annotations):
  │ (green) = vertical below a completed step/substep
  │ (blue)  = vertical below the active parent step
  │ (gray)  = vertical below active substep or upcoming step/substep
  ├── (green) = horizontal arm to a completed substep
  ├── (blue)  = horizontal arm to the active substep
  ├── (gray)  = horizontal arm to an upcoming substep
```

Layout structure (flexbox):

- Each step row is a flex container with two children:
  1. **Left column** (20px wide): indicator icon on top, vertical connector grows to fill remaining height. No gap between them.
  2. **Right column** (flex: 1): text content + substeps. Uses `padding-left: 14px` to create the gap that horizontal arms span.
- Substep horizontal arms use `position: absolute; left: -24px; width: 24px` to span from the vertical line center (10px into the 20px column + 14px padding = 24px total) to the substep icon.
- Substep icons (14px) align flush-left with parent step text.

## Confirmation Dialog

Uses the existing `AlertDialog` component:

```tsx
<AlertDialog.Root
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  onConfirm={() => proceedNavigation()}
  onCancel={() => cancelNavigation()}
  theme="warning"
>
  <AlertDialog.Content title="Go back?">{confirmMessage}</AlertDialog.Content>
</AlertDialog.Root>
```

## File Structure

```
packages/ui/src/components/stepper/
├── index.ts
├── stepper.tsx
├── stepper-step.tsx
├── stepper-sub-step.tsx
├── stepper-context.tsx
├── stepper-types.ts
└── __tests__/
    └── stepper.test.tsx
```

CSS lives in `packages/ui/src/styles/styles.css` using `cn-stepper-*` prefix.

## CSS Class Naming

Following existing convention: `cn-{component}-{element}-{state}`

- `cn-stepper` — root nav
- `cn-stepper-header` — header container (only rendered when `title` is provided)
- `cn-stepper-title` — title text
- `cn-stepper-list` — ordered list
- `cn-stepper-step-item` — list item wrapper
- `cn-stepper-step` — button element
- `cn-stepper-step-completed` / `-active` / `-upcoming` / `-skipped` / `-error` — state variants
- `cn-stepper-indicator` — icon circle
- `cn-stepper-indicator-number` — number text inside indicator
- `cn-stepper-step-content` — title + description wrapper
- `cn-stepper-step-title` — step title
- `cn-stepper-step-description` — step description
- `cn-stepper-connector` — vertical connector line
- `cn-stepper-connector-completed` / `-active` / `-upcoming` — connector color variants
- `cn-stepper-substep-list` — substep ordered list
- `cn-stepper-substep-item` — substep list item
- `cn-stepper-substep` — substep button
- `cn-stepper-substep-completed` / `-active` / `-upcoming` — substep state variants
- `cn-stepper-substep-branch` — horizontal arm connector
- `cn-stepper-substep-indicator` — substep icon circle
- `cn-stepper-substep-title` — substep title
- `cn-stepper-substep-description` — substep description
- `cn-stepper-substep-placeholder` — placeholder circle (shown when `hasSubSteps` with no children)

## Existing Code & Token Reuse

### Components

| Component     | Import Path                 | Usage                                                   |
| ------------- | --------------------------- | ------------------------------------------------------- |
| `AlertDialog` | `@/components/alert-dialog` | Built-in confirmation dialog for destructive navigation |
| `IconV2`      | `@/components/icon-v2`      | Step/substep indicator icons (`check`, `minus`)         |
| `cn()`        | `@/utils/cn`                | Class merging (clsx + tailwind-merge)                   |

### Design Tokens by Element

| Stepper Element                  | Property        | Tailwind Class            | CSS Variable                                                            |
| -------------------------------- | --------------- | ------------------------- | ----------------------------------------------------------------------- |
| **Step indicator (completed)**   | background      | `bg-cn-success-primary`   | `--cn-set-success-primary-bg`                                           |
|                                  | text/icon color | `text-cn-success-primary` | `--cn-set-success-primary-text` (white)                                 |
| **Step indicator (active)**      | background      | `bg-cn-brand-primary`     | `--cn-set-brand-primary-bg`                                             |
|                                  | text color      | `text-cn-brand-primary`   | `--cn-set-brand-primary-text` (white)                                   |
| **Step indicator (upcoming)**    | background      | `bg-cn-0`                 | `--cn-bg-0` (transparent/base)                                          |
|                                  | border          | `border-cn-2`             | `--cn-border-2`                                                         |
|                                  | text color      | `text-cn-3`               | `--cn-text-3`                                                           |
| **Step indicator (skipped)**     | background      | `bg-cn-gray-primary`      | `--cn-set-gray-primary-bg`                                              |
|                                  | text/icon color | `text-cn-3`               | `--cn-text-3`                                                           |
| **Step indicator (error)**       | background      | `bg-cn-danger-primary`    | `--cn-set-danger-primary-bg`                                            |
|                                  | text/icon color | `text-cn-danger-primary`  | `--cn-set-danger-primary-text` (white)                                  |
| **Step indicator (loading)**     | background      | `bg-cn-brand-primary`     | `--cn-set-brand-primary-bg` (same as active)                            |
|                                  | icon            | —                         | `<IconV2 name="loader" size="xs" className="animate-spin" />`           |
|                                  | icon color      | `text-cn-brand-primary`   | `--cn-set-brand-primary-text` (white)                                   |
|                                  | title/desc text | `cn-shimmer`              | Gradient shimmer sweep across text (4s linear infinite, blue highlight) |
| **Step title**                   | text color      | `text-cn-1`               | `--cn-text-1`                                                           |
|                                  | font size       | `text-cn-size-5`          | `--cn-font-size-5` (14px)                                               |
|                                  | font weight     | —                         | 440 (medium via variable font)                                          |
| **Step description**             | text color      | `text-cn-3`               | `--cn-text-3`                                                           |
|                                  | font size       | `text-cn-size-4`          | `--cn-font-size-4` (13px)                                               |
| **Header title**                 | text color      | `text-cn-2`               | `--cn-text-2`                                                           |
|                                  | font weight     | —                         | 550 (semibold via variable font)                                        |
|                                  | font size       | `text-cn-size-5`          | `--cn-font-size-5` (14px)                                               |
| **Step number text**             | font size       | `text-cn-size-2`          | `--cn-font-size-2` (~11.5px)                                            |
| **Connector (completed)**        | background      | `bg-cn-success-primary`   | `--cn-set-success-primary-bg`                                           |
| **Connector (active)**           | background      | `bg-cn-brand-primary`     | `--cn-set-brand-primary-bg`                                             |
| **Connector (upcoming/skipped)** | background      | `bg-cn-separator`         | `--cn-border-2`                                                         |
| **Connector (error)**            | background      | `bg-cn-danger-primary`    | `--cn-set-danger-primary-bg`                                            |
| **Indicator circle (parent)**    | size            | `size-5`                  | 20px                                                                    |
|                                  | border-radius   | `rounded-cn-full`         | `--cn-rounded-full` (9999px)                                            |
| **Indicator circle (substep)**   | size            | `size-3.5`                | 14px                                                                    |
|                                  | border-radius   | `rounded-cn-full`         | `--cn-rounded-full` (9999px)                                            |
| **Placeholder circle**           | size            | `size-3.5`                | 14px                                                                    |
|                                  | border          | `border-cn-2`             | `--cn-border-2`                                                         |
|                                  | background      | `bg-cn-0`                 | `--cn-bg-0` (transparent/base)                                          |
|                                  | border-radius   | `rounded-cn-full`         | `--cn-rounded-full` (9999px)                                            |
| **Step gap (icon→text)**         | padding-left    | `pl-3.5`                  | 14px                                                                    |
| **Connector line**               | width           | —                         | 2px                                                                     |

### Icons Used

| Icon Name | Context                                            |
| --------- | -------------------------------------------------- |
| `check`   | Completed/skipped step/substep indicator           |
| `minus`   | Upcoming substep indicator                         |
| `xmark`   | Error step/substep indicator                       |
| `loader`  | Loading step indicator (with `animate-spin` class) |

### New CSS Keyframe

One new keyframe is needed for the loading text shimmer effect (distinct from the existing `cnSkeletonShimmer` which is for block-level skeleton placeholders):

```css
@keyframes cnStepperShimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.cn-stepper-step-loading .cn-stepper-step-title {
  background: linear-gradient(90deg, var(--cn-text-1) 25%, var(--cn-set-brand-primary-bg) 37%, var(--cn-text-1) 50%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: cnStepperShimmer 4s linear infinite;
}

.cn-stepper-step-loading .cn-stepper-step-description {
  background: linear-gradient(90deg, var(--cn-text-3) 25%, var(--cn-set-brand-primary-bg) 37%, var(--cn-text-3) 50%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: cnStepperShimmer 4s linear infinite;
}
```

This is disabled alongside transition animations when `prefers-reduced-motion: reduce` is active.

All other visual requirements are covered by existing design tokens and components. No new tokens, icons, or shared components need to be created.

## Migration Path

1. Build the standalone stepper at `packages/ui/src/components/stepper/`
2. Export from `packages/ui` public API
3. Update the `Drawer.DualPane` to use the new stepper internally (or let consumers compose it)
4. Remove `DrawerSteps`, `DrawerStep`, `DrawerSubStep`, and `drawer-dual-pane-context.tsx`
5. Remove associated CSS classes (`cn-drawer-dual-pane-step-*`, `cn-drawer-dual-pane-substep-*`)

Since there are no current consumers of the drawer stepper, this is a clean replacement with no migration needed.

## Accessibility

### Keyboard Navigation

Uses the roving tabindex pattern:

| Key           | Behavior                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| Tab           | Moves focus into the stepper (lands on the active step, or first navigable step). Next Tab exits the stepper. |
| Arrow Down    | Moves focus to the next navigable step/substep (skips disabled upcoming steps)                                |
| Arrow Up      | Moves focus to the previous navigable step/substep                                                            |
| Enter / Space | Selects the focused step (triggers `onBeforeChange` guard if present)                                         |
| Home          | Moves focus to the first navigable step                                                                       |
| End           | Moves focus to the last navigable step                                                                        |

Only one step is in the tab order at a time (`tabindex="0"`). All other steps have `tabindex="-1"`. Upcoming (disabled) steps are skipped entirely by arrow keys.

### ARIA Attributes

| Element              | Attribute       | Value                                                 |
| -------------------- | --------------- | ----------------------------------------------------- |
| Root `<nav>`         | `aria-label`    | Consumer-provided or defaults to `"Progress steps"`   |
| Step list `<ol>`     | `role`          | `list` (implicit)                                     |
| Active step button   | `aria-current`  | `"step"`                                              |
| Upcoming step button | `aria-disabled` | `"true"` (plus native `disabled` attribute)           |
| Step button          | `aria-label`    | `"Step {n} of {total}: {title}"` (for screen readers) |
| SubStep button       | `aria-label`    | `"{title}"`                                           |

### Live Announcements

A visually hidden `aria-live="polite"` region announces step changes:

- On step change: `"Step {n} of {total}: {title}"`
- On substep change: `"{substep title}"`
- On confirmation dialog open: handled by AlertDialog's built-in accessibility

### Focus Management

- When `onValueChange` fires (step changes programmatically), focus moves to the new active step
- When a substep unmounts and the active value falls back to the parent, focus moves to the parent step button
- Confirmation dialog traps focus while open (handled by AlertDialog)

## Step Transition Animations

### Forward Progression (animated)

When the user advances to the next step, the transition plays as a sequential 3-phase flow:

| Phase                              | Duration | What happens                                                                              |
| ---------------------------------- | -------- | ----------------------------------------------------------------------------------------- |
| 1. Source indicator crossfade      | 150ms    | Current step's indicator morphs to its new state (e.g., number → checkmark, blue → green) |
| 2. Connector fill                  | 300ms    | The connector below the source step fills top-to-bottom with the completed color          |
| 3. Destination indicator crossfade | 150ms    | Target step's indicator morphs to its new state (e.g., upcoming gray → active blue)       |

**Total duration**: ~600ms end-to-end.

**Sequencing**: Each phase starts only after the previous one completes. This creates a directional "flow" sensation — color originates at the source, travels through the connector, and arrives at the destination. The destination icon does NOT change simultaneously with the source.

**Easing**: Connector fill uses `ease-out` (fast start, gentle landing). Indicator crossfades use `ease-in-out`.

**CSS implementation**: Pure CSS with `transition-delay` chaining — no JS orchestration. All three phases are defined on a single parent class (`cn-stepper-step-transitioning`), with staggered delays (0ms, 150ms, 450ms). The browser's compositor schedules the full timeline atomically, avoiding frame-gap stutters that JS handoffs (`onTransitionEnd`) would introduce. The connector fill uses a `scaleY` transform (origin: top) on a colored overlay. Indicator crossfades use opacity transitions on overlapping icon elements.

**Interaction lock**: During the 600ms animation, `pointer-events: none` is applied to the step list to prevent rapid-click conflicts. Removed after animation completes via a single `setTimeout`.

### Backward Navigation (instant)

When the user navigates backwards (clicking a previously completed step):

- All state changes apply immediately with no animation
- Connectors snap to their new colors
- Indicators snap to their new states

Rationale: backward navigation is a user correction — they want to get back quickly. Animating it would feel sluggish and fight the user's intent.

### Substep Transitions

When advancing between substeps within the same parent step:

- Same 3-phase sequential pattern applies (substep indicator → horizontal arm or vertical segment → next substep indicator)
- Durations are slightly shorter: 100ms / 200ms / 100ms (~400ms total) since the distance is smaller
- Backward substep navigation is also instant

### Skipping Animations

Transitions are skipped (instant state change) when:

- `completed` prop flips to true (bulk state change)
- A step's `state` prop is set externally (e.g., `state="error"`)
- The component first mounts (initial state renders without animation)
- `prefers-reduced-motion: reduce` media query is active

### CSS Classes

- `cn-stepper-connector-animating` — applied during the connector fill phase
- `cn-stepper-indicator-entering` — applied to the destination indicator during phase 3
- `cn-stepper-indicator-leaving` — applied to the source indicator during phase 1

## Export Surface

### Exported (public API)

| Export                | Kind                                                         | Purpose                                                               |
| --------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------- |
| `Stepper`             | Namespace (with `.Root`, `.Step`, `.SubStep` static members) | The compound component                                                |
| `StepperProps`        | Type                                                         | Root component props                                                  |
| `StepperStepProps`    | Type                                                         | Step component props                                                  |
| `StepperSubStepProps` | Type                                                         | SubStep component props                                               |
| `StepState`           | Type                                                         | `'completed' \| 'active' \| 'upcoming' \| 'skipped' \| 'error'` union |

### Internal (not exported)

| Symbol               | Reason                                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `useStepperContext`  | Exposing context is a strong API commitment — restricts internal restructuring. Can open later if a use case emerges. |
| `StepperContextType` | Implementation detail tied to context hook                                                                            |

## Testing Strategy

Unit tests with React Testing Library. No visual regression tests — low maintenance, high behavioral coverage.

### Coverage Areas

| Area                       | What to test                                                                                                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **State derivation**       | Steps render correct state based on position relative to active/furthest-reached. Error/skipped props override. Completion prop flips remaining steps.                  |
| **Registration lifecycle** | Dynamic substeps mount/unmount correctly. Counts update. Active substep unmount falls back to parent value.                                                             |
| **Keyboard navigation**    | Arrow keys move focus, skip disabled upcoming steps. Enter/Space triggers selection. Home/End jump to first/last. Roving tabindex updates.                              |
| **Navigation guard**       | `onBeforeChange` returning `true` proceeds, `false` blocks silently, string shows dialog. Dialog confirm/cancel produce correct outcomes.                               |
| **Blocking**               | Steps after a blocking step are disabled. User can still navigate backwards. Removing `blocking` re-enables forward navigation.                                         |
| **Completion**             | `completed` flips active/upcoming to completed. Error/skipped states preserved.                                                                                         |
| **Header**                 | Renders `title` when provided; header omitted entirely when `title` is absent.                                                                                          |
| **Empty/skeleton state**   | Renders `skeletonCount` rows when no children mounted. Disappears when children mount.                                                                                  |
| **Animation classes**      | Correct CSS classes applied on forward navigation (`cn-stepper-step-transitioning`, etc.). No animation classes on backward navigation, first mount, or reduced-motion. |
| **Text overflow**          | Titles truncate via CSS; no tooltip is rendered (verified by absence of tooltip markup).                                                                                |

### What NOT to test

- Visual CSS transitions (timing, easing) — not reliably testable in jsdom
- Exact pixel layout — belongs in Storybook visual review
- AlertDialog internals — tested by that component's own suite

## Out of Scope

- Horizontal stepper orientation (vertical only for now)
- Step validation (consumer handles via `onBeforeChange`)
- Non-linear navigation (step ordering is always linear; branching is handled by conditional rendering)
