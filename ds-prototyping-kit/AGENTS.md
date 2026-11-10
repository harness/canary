# `@harnessio/ui` — Design rules for prototyping

Extracted from canary's `packages/ui/AGENTS.md`. Only the parts that do not depend on
component manifests are kept. For the workflow, read `.claude/skills/design-system/SKILL.md`.

## System rules

`docs/system/` holds the design governance that applies to every component:

- `accessibility.md` — WCAG rules, accessible names, decorative vs interactive
- `color-system.md` — Semantic tokens, color sets, theme-switching
- `interaction-states.md` — Disabled, focus, hover/selected states
- `visual-primitives.md` — Icon/logo/illustration decisions (when to use each)

The other six files (`app-setup.md`, `component-architecture.md`, `design-to-code-flow.md`,
`shadows.md`, `spacing.md`, `typography.md`) are in the same folder. These docs are the only
home for these rules. The docs site is maintained separately and is not the reference.

## Tokens

Every value is a token reference, never a literal hex or px. This ensures:

- Colors theme-switch (light/dark)
- Spacing is consistent
- Design system changes propagate

No hard-coded hex or px in components, ever. Token names and values are in `DESIGN.md`.
