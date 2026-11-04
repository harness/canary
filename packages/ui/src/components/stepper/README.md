# Horizontal Stepper Orientation

`Stepper.Root` accepts an `orientation?: 'vertical' | 'horizontal'` prop (default `'vertical'`).
This document explains the scope of that feature and the reasoning behind the decisions made
while adding it. For the full component spec (props, state model, accessibility, CSS naming),
see [`DESIGN.md`](./DESIGN.md) — this file only covers what's new/different for horizontal mode.

```tsx
<Stepper.Root value={value} onValueChange={setValue} orientation="horizontal">
  <Stepper.Step value="step-1" title="Step one" />
  <Stepper.Step value="step-2" title="Step two" />
  <Stepper.Step value="step-3" title="Step three" />
</Stepper.Root>
```

## Scope: flat top-level Steps only

`orientation="horizontal"` only restyles a flat list of top-level `Stepper.Step`s (no
`Stepper.StepGroup`, no nested `Stepper.Step`s). This is a deliberate, narrower scope than "make
every existing Stepper configuration work horizontally," for one concrete technical reason:

`stepper-group.tsx`'s branch/trunk connector — the line down the left edge with elbows branching
off to each nested step — is built entirely around vertical geometry. It calls
`getBoundingClientRect()` and uses a `ResizeObserver` to measure real pixel positions
(`measureTrunkSegmentEnds`, `measureCompletedTrunkEnd`, `getBranchWireElbowY`, ...) and writes the
results into CSS custom properties (`--cn-stepper-trunk-green-end`, `--cn-stepper-trunk-blue-end`)
that drive multi-color trunk segments. None of that math has a horizontal analog — "how far down
the trunk is green" doesn't translate to "how far across" without re-deriving the whole measurement
and elbow-drawing system for a second axis. Porting it is a real rewrite, not a CSS pass.

The flat top-level-Step path (`TopLevelStep` in `stepper-step.tsx`), by contrast, has no such
DOM-measured geometry — connectors are one straight CSS line per step, styled entirely from
`stepper.ts`. That's what makes it tractable to restyle for a second axis with CSS alone, while
`StepGroup`/nested steps are left vertical-only.

If a horizontal `StepGroup`/nested-step flow is ever needed, treat it as a new design effort against
`stepper-group.tsx`'s connector system, not an extension of this change.

## How the horizontal connector line works

The connector is positioned with CSS alone, no measurement:

- `.cn-stepper-list` is a grid of equal columns
  (`grid-auto-columns: minmax(var(--cn-size-24), 1fr)`) with no gap, so the distance between two
  adjacent step centers is always one column width (`100%`). Don't switch this to
  `flex: 1 1 0%`: a percentage flex-basis falls back to content size when the list's width is
  indefinite, so a long title widens its item and the connector overshoots the next circle.
- The connector is inset by one indicator radius on each end:
  `left: calc(50% + var(--cn-size-5) / 2)`, `width: calc(100% - var(--cn-size-5))`. It can't run
  center-to-center and hide behind the circle, because the connector is absolutely positioned with
  `z-index: 1` while `.cn-stepper-indicator` is static, so the line would paint over the step
  number.

## Keyboard navigation: axis swap, not axis addition

WAI-ARIA authoring practices call for horizontal widgets to navigate with `ArrowLeft`/`ArrowRight`
and vertical widgets with `ArrowUp`/`ArrowDown`. `StepperList`'s keydown handler swaps which keys
map to "next"/"previous" based on `orientation`, rather than making both axes active at once:

```ts
const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
```

`Home`/`End` are unaffected — they're orientation-agnostic. Supporting both axes simultaneously
was considered and rejected: it would mean `ArrowDown` silently does something in a horizontal
list (or vice versa), which contradicts users' spatial expectations for the widget they're looking
at rather than just being a harmless extra affordance.

## No runtime guard for the unsupported combination

Combining `orientation="horizontal"` with `Stepper.StepGroup`/nested `Stepper.Step`s is
undefined/unstyled, not runtime-checked. This matches the rest of `packages/ui/src` — there's no
existing convention of dev-mode `console.warn`/`NODE_ENV` guards for unsupported prop
combinations anywhere in the package. The restriction is documented (here, in `DESIGN.md`, and in
the `orientation` prop's JSDoc in `stepper-types.ts`) rather than enforced, consistent with the
codebase's general approach of trusting callers and documenting contracts instead of validating
against scenarios that are just out of scope.

## Supporting evidence from Figma

`stepper.figma.ts`'s Code Connect mapping references Figma-side sub-components named `.StepVert`,
`.StepHor`, and `.StepBarHor`. The `Hor`-suffixed names indicate the Figma design source already
anticipates a horizontal step visual — this change brings the code in line with a variant the
design system already models, rather than inventing a new one.

## Out of scope

- `Stepper.StepGroup` / nested `Stepper.Step`s in horizontal mode (see above).
- Passing `children` (a content panel) to a horizontal top-level `Step`. This is already an
  untested combination in vertical mode (see the comment in `TopLevelStep` in `stepper-step.tsx`);
  horizontal mode doesn't add layout for it either.
- Responsive collapse (e.g. auto-switching to vertical below some viewport width). Consumers that
  need this can conditionally pass `orientation` themselves.
