---
domain: status-badge-pattern
prefix: SBP
version: 0.2.0
manifest: ./status-badge-pattern.manifest.json
rules:
  - id: SBP-001
    title: One state per badge — when several apply, show the most urgent
    status: proposed
    tier: 2
    check: review
  - id: SBP-002
    title: Execution status uses only success, warning, muted or danger
    status: proposed
    tier: 2
    check: review
  - id: SBP-003
    title: A status that can change while visible sits inside an aria-live="polite" region
    status: proposed
    tier: 1
    check: review
  - id: SBP-004
    title: In hierarchical execution lists, Tree View renders the status — don't compose StatusBadge by hand
    status: proposed
    tier: 3
    check: review
gaps:
  - id: SBP-005
    title: 'Open: no mapping from ExecutionState to theme, variant, icon and label'
    status: open
  - id: SBP-006
    title: "Open: Tree View's status icons and colors disagree with SBD-017's icon table"
    status: open
  - id: SBP-007
    title: 'Resolved: SBD-005, 008, 014 and 015 move here'
    status: resolved
  - id: SBP-008
    title: 'Open: a Figma counterpart is expected but not identified'
    status: open
  - id: SBP-009
    title: 'Resolved: an execution shows one badge'
    status: resolved
---

# Status Badge Pattern Guide

Draft. How to compose StatusBadge on a screen. It covers one use so far: showing the state of a pipeline execution (a run, a stage or a step). SBP-001 to SBP-004 moved here from `status-badge.guide.md`, where they were SBD-005, SBD-014, SBD-008 and SBD-015 (SBP-007). Those SBD IDs are retired. Nothing new is decided here; the open questions are under Known gaps. The anatomy, the states and the examples live in `status-badge-pattern.manifest.json`.

## Architecture: Do's and Do Not's

### Do's

- Put one state in a badge. If more than one applies, show the most urgent. (SBP-001)
- Use `success`, `warning`, `muted` or `danger` for the theme. (SBP-002)
- Wrap the badge in `<div aria-live="polite">` when the state can change while it's on screen. (SBP-003)
- Pass a text label. Color, icon and pulse never carry the state alone. (SBD-006)
- In a hierarchical list of steps or stages, pass `status` to Tree View's `Folder` or `File`. (SBP-004)

### Do Not's

- Don't put two states in one badge ("Error, Pending"), or show two badges for one execution. (SBP-001)
- Don't use `info`, `merged` or `risk` for an execution. (SBP-002)
- Don't give one badge both an icon and a pulse, including a pulse recreated with `className`. (SBD-007)
- Don't hand-compose StatusBadge plus an icon inside a Tree View row. (SBP-004)

## SBP-001 — One state per badge — when several apply, show the most urgent

Formerly SBD-005. A badge never holds two states, such as "Error, Pending". When more than one applies, show the most urgent. An execution shows one badge, not two separate ones (SBP-009).

## SBP-002 — Execution status uses only success, warning, muted or danger

Formerly SBD-014. Use only `success`, `warning`, `muted` and `danger` for execution status. The other three themes, `info`, `merged` and `risk`, are for named exceptions that aren't executions (SBD-018). Which theme each state gets is SBP-005.

## SBP-003 — A status that can change while visible sits inside an aria-live="polite" region

Formerly SBD-008. StatusBadge has no live region of its own, so the screen supplies one: wrap the badge in `<div aria-live="polite">` when the state can change while it is on screen, such as job progress. Connectivity badges (SBD-003) follow the same rule.

## SBP-004 — In hierarchical execution lists, Tree View renders the status — don't compose StatusBadge by hand

Formerly SBD-015. In hierarchical lists (steps within a stage, stages within a pipeline), use Tree View's built-in rendering instead of composing StatusBadge and an icon by hand. `Folder` and `File` in `treeview.tsx` take a `status` prop of type `ExecutionState` and render an icon for it. That icon rendering doesn't use StatusBadge, and its icons differ from SBD-017's table (SBP-006).

## Known gaps

Open questions that keep their rule IDs but are not rules yet.

### SBP-005 — Open: no mapping from ExecutionState to theme, variant, icon and label

`ExecutionState` in `src/types/execution.ts` has 12 values: pending, running, success, failure, error, skipped, killed, blocked, waiting_on_dependencies, unknown, failure_ignored, ignorefailed. No guide says which theme, variant, icon or label each gets. The retired SBD-014 noted that the icon-to-substate pairing is unratified. Design owns the decision.

### SBP-006 — Open: Tree View's status icons and colors disagree with SBD-017's icon table

Tree View's `getStatusIcon` renders running as `loader` (spinning, warning), success as `check-circle-solid` (success), failure as `xmark-circle-solid` (danger), and everything else as `circle` (neutral). That includes error, killed and blocked. SBD-017's table uses `check-circle`, `xmark-circle`, `timer`, `pause`, `prohibition` and `warning-circle`. Which side changes is a decision for Design and engineering.

### SBP-007 — Resolved: SBD-005, 008, 014 and 015 move here

Decided by Jared Hawkins, 2026-10-20. The four rules move to this guide. SBD-005, SBD-008, SBD-014 and SBD-015 are retired in `rule-ids.md` with a pointer to the SBP rule, and their IDs are never reused. The move waited until the `ds:*` scripts read `src/patterns/`, so agents still find the rules: the StatusBadge reference lists this pattern under Used in patterns.

### SBP-008 — Open: a Figma counterpart is expected but not identified

Patterns are expected to have Figma counterparts. Not known yet: which file and node hold the status badge pattern, or when it will exist.

### SBP-009 — Resolved: an execution shows one badge

Decided by Jared Hawkins, 2026-10-20. When more than one state applies to an execution, show one badge with the most urgent state (SBP-001). Don't render a second badge. The retired SBD-005 allowed "separate badges with clear spacing rules", but no spacing rules existed and `status-badge.manifest.json` listed two separate badges as incorrect. StatusBadge's `purpose.doNotUseWhen` now says the same. Which state is most urgent depends on SBP-005.
