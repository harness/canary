# @harnessio/ui — Agent Guide

Component library for the Harness Unified UI. All code must support React 17.

## Using components

Some components have a contract: a manifest (`<kebab>.manifest.json`) and a guide (`<kebab>.guide.md`) next to the source. Agents read the generated reference instead of the raw files.

1. Read [`agents/components/INDEX.md`](agents/components/INDEX.md) to find the component.
2. Read that component's reference in `agents/components/`.
3. If the reference lists the component under **Used in patterns**, and your screen matches the pattern, read that pattern's reference in `agents/patterns/` too. A pattern holds the rules for composing components on a screen.
4. Follow [`agents/USING-COMPONENTS.md`](agents/USING-COMPONENTS.md) to write code against it.

If a component is not in the index, it has no contract yet. Say so, then read its source and its docs page in `apps/portal/src/content/docs/components/`. Do not assume props or tokens.

## Reviewing UI changes

Run [`agents/REVIEW-UI.md`](agents/REVIEW-UI.md) against the diff.

## Checks

Run from `packages/ui`:

| Command | When |
| ------- | ---- |
| `pnpm ds:check <Component>` | After editing a component, its manifest or its guide. Runs the validator, the reference staleness check and the component's rule tests. A pattern name, such as `ExecutionStatus`, works too. |
| `pnpm ds:generate` | After editing a manifest or guide. Commit the output. |
| `pnpm typecheck` | Also needed: some rules are enforced by `@ts-expect-error` lines that only the type checker reads. |

The pre-commit hook runs `ds:check` on staged contract files, and CI runs the same scripts. The `ds:*` scripts need Node 22.18 or later.

## Editing contracts

- Never edit `agents/components/` or `agents/patterns/`. They are generated.
- Never invent a token, prop, Figma property or rule. Write `[TK]` and ask.
- Adding a contract: see [`contracts/README.md`](contracts/README.md) and [`contracts/COMPONENT_CHECKLIST.md`](contracts/COMPONENT_CHECKLIST.md). For a pattern, use [`contracts/PATTERN_CHECKLIST.md`](contracts/PATTERN_CHECKLIST.md).
