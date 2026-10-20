---
domain: status-badge
prefix: SBD
version: 0.3.0
manifest: ./status-badge.manifest.json
rules:
  - id: SBD-001
    title: StatusBadge represents state, Tag represents attribute
    status: proposed
    tier: 1
    check: review
  - id: SBD-002
    title: Decision test for choosing StatusBadge over Tag
    status: proposed
    tier: 1
    check: review
  - id: SBD-003
    title: 'Ambiguous cases (tier, scope, marketing labels, connectivity) need per-case judgment, not a default'
    status: proposed
    tier: 3
    check: review
  - id: SBD-004
    title: StatusBadge is an indicator, not a button
    status: proposed
    tier: 1
    check:
      - types:StatusBadgeProps
      - 'test:packages/ui/src/components/status-badge/__tests__/status-badge.rules.test.tsx#SBD-004 renders a non-interactive indicator'
  - id: SBD-006
    title: Text label is mandatory; color and icon never carry meaning alone
    status: proposed
    tier: 1
    check:
      - 'test:packages/ui/src/components/status-badge/__tests__/status-badge.rules.test.tsx#SBD-006 exposes only the text label to assistive tech'
      - review
  - id: SBD-007
    title: icon and pulse are mutually exclusive by variant
    status: proposed
    tier: 2
    check:
      - types:StatusBadgeProps
      - schema:/constraints
      - 'test:packages/ui/src/components/status-badge/__tests__/status-badge.rules.test.tsx#SBD-007 gives the status variant the indicator and pulse, and other variants the icon'
      - lint:no-restricted-syntax
  - id: SBD-009
    title: Fixed shape and a 2-size scale, system-wide — never vary shape by meaning
    status: proposed
    tier: 3
    check:
      - types:StatusBadgeProps
      - review
  - id: SBD-010
    title: theme is a closed semantic enum — never an ad hoc per-team color
    status: proposed
    tier: 1
    check:
      - types:StatusBadgeProps
      - schema:/props/shared/1/values
      - 'test:packages/ui/src/components/status-badge/__tests__/status-badge.rules.test.tsx#SBD-010 maps every manifest theme to its semantic class and accepts no others'
  - id: SBD-016
    title: 'Guidance: reach for the outline variant absent a specific reason to choose another'
    status: proposed
    tier: 3
    check: review
  - id: SBD-017
    title: Reuse pipeline status icons for any Pass/Fail/Pending-shaped badge, regardless of domain
    status: proposed
    tier: 2
    check: review
  - id: SBD-018
    title: 'Outside success/warning/danger, status-like badges default to neutral — info/merged/risk stay valid only as named, non-execution exceptions'
    status: proposed
    tier: 2
    check: review
    depends_on: [SBD-017]
gaps:
  - id: SBD-011
    title: 'Open: docs list variant as optional with a default; the type requires it'
    status: open
  - id: SBD-012
    title: 'Open: icon renders in a fixed DOM order with no RTL mirroring logic'
    status: open
  - id: SBD-013
    title: 'Open: pulse animation has no prefers-reduced-motion guard'
    status: open
---

# Status Badge Guide

Rules for choosing between StatusBadge and Tag, and for StatusBadge's own API constraints. The front matter above is the only source for each rule's id, title, status, tier and check. Rules are `proposed` (likely stable) or `open` (needs verification or resolution). Treat them as context, not settled policy, until Design ratifies them. The component API (props, variants, defaults, tokens) lives in `status-badge.manifest.json`.

Four rules moved to the execution-status pattern (`src/patterns/execution-status/`): SBD-005 is now EXS-001, SBD-008 is EXS-003, SBD-014 is EXS-002 and SBD-015 is EXS-004. Those IDs are retired. Read that pattern when a badge shows the state of a pipeline execution or a state that can change while visible.

## Architecture: Do's and Do Not's

### Do's

- Use StatusBadge for _transient, system-driven state_ that changes automatically (pending → active → closed).
- Pass `children` text always — text is mandatory and conveys all semantic meaning.
- Wrap with `aria-live="polite"` when status can change while visible (connectivity, job progress, etc.). (EXS-003)
- Default to `outline` variant absent a specific reason to pick `primary`, `secondary`, `ghost`, or `status`.
- Use the fixed icon table (check-circle/xmark-circle/timer/pause/prohibition/warning-circle) for Pass/Fail/Pending meanings across any domain.
- Render one StatusBadge per object — pick the most urgent status if multiple apply. (EXS-001)

### Do Not's

- Don't use for stable _attributes_ describing what a thing is (account tier, scope, marketing labels) — use Tag instead.
- Don't pass `icon` when `variant='status'` — the indicator dot already occupies that slot.
- Don't pass `pulse` on variants other than `'status'` — pulse only works with the status variant.
- [TK: draft for Katie] Don't recreate pulse with `className` (for example `animate-pulse` or `motion-safe:animate-pulse`) on any variant. A badge gets an icon or a pulse, never both; if it needs to pulse, use `variant='status'` with `pulse` and drop the icon. Incorrect: `<StatusBadge variant="outline" theme="success" icon="check-circle" className="motion-safe:animate-pulse">Running</StatusBadge>`. (SBD-007)
- Don't put two statuses in one badge ("Error, Pending") — pick the most urgent. Whether separate badges are allowed is open (EXS-009). (EXS-001)
- Don't rely on color or icon alone to convey meaning — text is mandatory.
- Don't add `role`, `tabIndex`, `onClick`, or `aria-readonly` at the call site — they're explicitly stripped from props. StatusBadge is non-interactive by design.
- Don't use `info`, `merged`, or `risk` themes for generic Pass/Fail/Pending indicators — restrict to `success`, `warning`, `danger`, `muted`. Reserve `info`/`merged`/`risk` for named, non-execution exceptions (e.g., "Merged" PR badge). (SBD-018, EXS-002)

## SBD-001 — StatusBadge represents state, Tag represents attribute

`StatusBadge` is for something that _changes_ — usually system- or backend-driven, transient, and evaluative (the color implies good/bad/waiting). `Tag` is for something that _describes what a thing is_ — stable, descriptive, no implied judgment, and open/categorical rather than a closed semantic palette. These are two different components with two different prop contracts; neither should absorb the other's job via a `type` prop.

## SBD-002 — Decision test for choosing StatusBadge over Tag

Ask: _does this value change automatically as a result of a system process, and does the color choice imply something is good/bad/waiting?_ Yes → `StatusBadge`. No — even if it visually mimics badge styling — → `Tag`.

## SBD-003 — Ambiguous cases (tier, scope, marketing labels, connectivity) need per-case judgment, not a default

Some values don't resolve cleanly from SBD-002 and have been called out explicitly rather than forced into either bucket:

- **Account type/tier** (Free/Pro/Enterprise) — a ranked category. Treat as `Tag`, though it can borrow badge-like visual weight; consider a distinct "plan chip" variant if this recurs.
- **Scope** (Public/Private/Internal) — not evaluative, but affects what a user can do. Best as `Tag` with an icon (lock/globe), not color-coded like a status.
- **Marketing labels** ("Beta", "New") — informational `Tag`s; no lifecycle within the object's own state machine.
- **Connectivity** (online/offline/reconnecting) — IS a `StatusBadge`: system-driven, evaluative, mutually exclusive, real lifecycle transitions. Usually needs an `aria-live` wrapper (EXS-003 in the execution-status pattern) since it can change while the user is looking at the screen.

## SBD-004 — StatusBadge is an indicator, not a button

Universal design-system rule, not specific to this component: a badge signals state, it doesn't take action. `status-badge.tsx` enforces this at the type level — `role`, `aria-readonly`, `tabIndex`, `onClick`, and `color` are explicitly `Omit<>`'d from the prop type, so a consumer cannot wire click/focus behavior onto it even by accident. If a status needs to be clickable or filterable, that is a different, interactive component (e.g. `Tag`'s `onActionClick`/`enableHover`), not an augmented `StatusBadge`.

Figma defines `state=hover` variants for `primary`, `secondary` and `outline`. Code has no hover styles. This conflicts with the rule above and is listed in the manifest's `knownGaps`.

## SBD-006 — Text label is mandatory; color and icon never carry meaning alone

The manifest marks `children` as required with no default, so a `StatusBadge` must not be rendered icon-only or color-only. Color-only and icon-only signals fail colorblind users and grayscale contexts (printouts, screenshots); icon may reinforce meaning but never solely carries it.

The type does not enforce this yet: `StatusBadgeProps` inherits an optional `children` from `React.HTMLAttributes`. The manifest's `knownGaps` waives that mismatch until the type or a test enforces it.

## SBD-007 — icon and pulse are mutually exclusive by variant

`StatusBadgeProps` is a discriminated union: when `variant="status"`, `icon` is typed `never` (the status variant already owns the indicator-dot slot) and `pulse?: boolean` is available. For every other variant, `pulse` is typed `never` and `icon` is available. An agent should never try to pass both on the same instance — the type system already blocks it, but a design-side agent generating usage examples needs to know why. The manifest's `constraints` list encodes the same rule for tools that do not run the type checker.

## SBD-009 — Fixed shape and a 2-size scale, system-wide — never vary shape by meaning

One shape (rounded-rect), two sizes (`sm`/`md`). Never vary shape by meaning or introduce a third size.

## SBD-010 — theme is a closed semantic enum — never an ad hoc per-team color

`theme` values: `muted | success | warning | danger | info | merged | risk`. Don't invent ad hoc theme values per team or surface.

## SBD-016 — Guidance: reach for the outline variant absent a specific reason to choose another

Consumer guidance: `outline` is lowest visual weight and reads neutral by default. Pick `primary`, `secondary`, `ghost`, or `status` only with deliberate intent.

## SBD-017 — Reuse pipeline status icons for any Pass/Fail/Pending-shaped badge, regardless of domain

Icon table (`check-circle`=Pass, `xmark-circle`=Fail, `timer`=Pending, `pause`=Queued/Paused, `prohibition`=Rejected, `warning-circle`=Expired/Error) applies to any domain (billing, connectors, integrations, pipelines). Only for variants that accept `icon` (not `status` variant, which has `icon: never`).

## SBD-018 — Outside success/warning/danger, status-like badges default to neutral — info/merged/risk stay valid only as named, non-execution exceptions

For Pass/Fail/Pending-shaped badges, use only `success`, `warning`, `danger` for semantic meaning. Otherwise default to `muted` theme + `outline` variant. `info`/`merged`/`risk` valid only for named, non-execution exceptions (e.g., "Merged" PR badge).

## Known gaps

Open questions that keep their rule IDs but are not rules yet.

### SBD-011 — Open: docs list variant as optional with a default; the type requires it

`StatusBadgeProps` makes `variant` required. The docs site PropsTable lists it as optional with default `'primary'`. At runtime, cva `defaultVariants` does set `'primary'` when an untyped caller omits `variant`, so the docs describe runtime behavior and the type describes the contract. Needs a decision on which one is intended.

### SBD-012 — Open: icon renders in a fixed DOM order with no RTL mirroring logic

Icon renders in fixed order (`{icon}{children}`). No RTL mirroring found; unconfirmed if real-world bug.

### SBD-013 — Open: pulse animation has no prefers-reduced-motion guard

`pulse` applies `animate-pulse` unconditionally. No `prefers-reduced-motion` handling exists outside the stepper component. Needs confirmation whether a global CSS rule covers it.
