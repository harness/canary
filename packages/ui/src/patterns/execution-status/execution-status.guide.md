---
domain: execution-status
prefix: EXS
version: 0.1.0
manifest: ./execution-status.manifest.json
rules:
  - id: EXS-001
    title: One state per badge — when several apply, show the most urgent
    status: proposed
    tier: 2
    check: review
  - id: EXS-002
    title: Execution status uses only success, warning, muted or danger
    status: proposed
    tier: 2
    check: review
  - id: EXS-003
    title: A status that can change while visible sits inside an aria-live="polite" region
    status: proposed
    tier: 1
    check: review
  - id: EXS-004
    title: In hierarchical execution lists, Tree View renders the status — don't compose StatusBadge by hand
    status: proposed
    tier: 3
    check: review
gaps:
  - id: EXS-005
    title: 'Open: no mapping from ExecutionState to theme, variant, icon and label'
    status: open
  - id: EXS-006
    title: "Open: Tree View's status icons and colors disagree with SBD-017's icon table"
    status: open
  - id: EXS-007
    title: 'Resolved: SBD-005, 008, 014 and 015 move here'
    status: resolved
  - id: EXS-008
    title: 'Open: a Figma counterpart is expected but not identified'
    status: open
  - id: EXS-009
    title: 'Open: whether an execution may show two badges'
    status: open
---

# Execution Status Pattern Guide

Draft. How to show the state of a pipeline execution: a run, a stage or a step. The front matter above is the only source for each rule's id, title, status, tier and check. Every rule here restates a rule from `status-badge.guide.md` at the level of the screen, and its body names that rule. Those four SBD rules move here (EXS-007); until the move lands they exist in both guides. Nothing new is decided here; the open questions are under Known gaps. The anatomy, the states and the examples live in `execution-status.manifest.json`.

## Architecture: Do's and Do Not's

### Do's

- Put one state in a badge. If more than one applies, show the most urgent. (EXS-001)
- Use `success`, `warning`, `muted` or `danger` for the theme. (EXS-002)
- Wrap the badge in `<div aria-live="polite">` when the state can change while it's on screen. (EXS-003)
- Pass a text label. Color, icon and pulse never carry the state alone. (SBD-006)
- In a hierarchical list of steps or stages, pass `status` to Tree View's `Folder` or `File`. (EXS-004)

### Do Not's

- Don't put two states in one badge ("Error, Pending"). (EXS-001)
- Don't use `info`, `merged` or `risk` for an execution. (EXS-002)
- Don't give one badge both an icon and a pulse, including a pulse recreated with `className`. (SBD-007)
- Don't hand-compose StatusBadge plus an icon inside a Tree View row. (EXS-004)

## EXS-001 — One state per badge — when several apply, show the most urgent

Restates SBD-005 for executions. A badge never holds two states. When more than one applies, show the most urgent. SBD-005 also allows "separate badges with clear spacing rules", but no spacing rules exist yet. Whether an execution may show two badges is EXS-009.

## EXS-002 — Execution status uses only success, warning, muted or danger

Restates SBD-014. The other three themes, `info`, `merged` and `risk`, are for named exceptions that aren't executions (SBD-018). Which theme each state gets is EXS-005.

## EXS-003 — A status that can change while visible sits inside an aria-live="polite" region

Restates SBD-008, at the same tier. StatusBadge has no live region, so the screen supplies one.

## EXS-004 — In hierarchical execution lists, Tree View renders the status — don't compose StatusBadge by hand

Restates SBD-015. `Folder` and `File` in `treeview.tsx` take a `status` prop of type `ExecutionState` and render an icon for it. That icon rendering doesn't use StatusBadge, and its icons differ from SBD-017's table (EXS-006).

## Known gaps

Open questions that keep their rule IDs but are not rules yet.

### EXS-005 — Open: no mapping from ExecutionState to theme, variant, icon and label

`ExecutionState` in `src/types/execution.ts` has 12 values: pending, running, success, failure, error, skipped, killed, blocked, waiting_on_dependencies, unknown, failure_ignored, ignorefailed. No guide says which theme, variant, icon or label each gets. SBD-014 notes that the icon-to-substate pairing is unratified. Design owns the decision.

### EXS-006 — Open: Tree View's status icons and colors disagree with SBD-017's icon table

Tree View's `getStatusIcon` renders running as `loader` (spinning, warning), success as `check-circle-solid` (success), failure as `xmark-circle-solid` (danger), and everything else as `circle` (neutral). That includes error, killed and blocked. SBD-017's table uses `check-circle`, `xmark-circle`, `timer`, `pause`, `prohibition` and `warning-circle`. Which side changes is a decision for Design and engineering.

### EXS-007 — Resolved: SBD-005, 008, 014 and 015 move here

Decided by Jared Hawkins, 2026-10-20. The four rules move to this guide. SBD-005, SBD-008, SBD-014 and SBD-015 are then retired in `rule-ids.md` with a pointer to the EXS rule, and their IDs are never reused. The move waits until `ds:*` scripts read `src/patterns/`: retiring them sooner would remove the rules from the StatusBadge reference, which is the only file agents read. Until then the rules exist in both places.

### EXS-008 — Open: a Figma counterpart is expected but not identified

Patterns are expected to have Figma counterparts. Not known yet: which file and node hold the execution status pattern, or when it will exist.

### EXS-009 — Open: whether an execution may show two badges

SBD-005 allows "separate badges with clear spacing rules" when an item has more than one state. `status-badge.manifest.json` lists two separate badges, "Error" and "Pending", as an incorrect example of SBD-005. The two disagree, and no spacing rules exist. Until this is decided, show one badge (EXS-001).
