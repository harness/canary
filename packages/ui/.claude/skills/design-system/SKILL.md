---
name: design-system
description: Build UI with the Harness design system (@harnessio/ui). Use BEFORE writing or editing any component markup, styling, props, or tokens — it routes you to the authoritative contracts so you use real components with real prop values instead of inventing them. Also use when asked which component or variant is correct, or when a ds-check validation fails.
---

# Harness Design System — where to look

This file is a **router, not a reference.** It contains no design rules of its own. Read
the files it points to; they are the source of truth and they change independently.

Paths are given relative to the `@harnessio/ui` package root. In the canary repo, prefix
them with `packages/ui/`.

## Authoritative sources, in priority order

| Source | Path | What it settles |
|---|---|---|
| Registry | `schemas/registry.json` | Which components exist as contracts; where each one's files are |
| Manifest | `schemas/{component}.manifest.json` | The real props, allowed values, defaults, tokens, import path |
| Pattern doc | `schemas/{component}.md` | When to use this component, when not to, known gaps |
| System rules | `docs/system/*.md` | Cross-cutting rules (9 files, listed below) |

`docs/system/` contains: `accessibility.md`, `color-system.md`, `component-architecture.md`,
`design-to-code-flow.md`, `interaction-states.md`, `shadows.md`, `spacing.md`,
`typography.md`, `visual-primitives.md`.

## Not authoritative — do not cite these

**`apps/portal/src/content/docs/**` (the docs site) is not a reference for design-system
rules.** It is maintained on its own cadence, so it lags the code, and it is less detailed
than the manifests and pattern docs. Where the portal and a manifest disagree, the
**manifest is correct** — the portal is out of date.

Never cite a portal path in a manifest's `governance.rulesDocs`, and never resolve a design
question from the portal when a manifest or pattern doc covers it.

Do not treat a `*.figma.ts` Code Connect file as evidence of what Figma exposes either; its
lookups fail silently when a Figma property is renamed.

## Workflow

1. **Find the component.** Read `schemas/registry.json`. If the component has no manifest,
   it has no contract yet — say so rather than guessing its API.
2. **Read its manifest.** Take props, allowed enum values, and defaults from
   `props.shared` / `props.codeOnly`. Use `code.import` verbatim for the import, and
   `code.path` to locate the source — the repo uses both `components/{name}.tsx` and
   `components/{name}/{name}.tsx`, so do not guess the layout.
3. **Read its pattern doc** (`schemas/{component}.md`) and the `docs/system/` rules listed
   in the manifest's `governance.rulesDocs`. These decide whether this component is the
   right choice, not just how to call it.
4. **Generate.** Use only props and values that appear in the manifest. Use semantic
   tokens, never literal hex or px. Do not invent a prop, a variant, or a theme value
   because it seems plausible — if it is not in the manifest, it does not exist.
5. **Validate.** Run `pnpm ds-check` from `packages/ui`. If you changed a manifest, run
   `pnpm ds-check --write` to regenerate its OpenAPI spec; never hand-edit a
   `*.openapi.json`. When a check fails, read `schemas/TROUBLESHOOTING.md`.

## If a source disagrees with the code

Report the conflict; do not silently pick one. A manifest that no longer matches its
component is either stale documentation or a real regression in the component, and the two
need different fixes. `ds-check --source` catches this case.

## Keeping this file small

This is the only design-system skill, deliberately. An earlier set of seven topic-specific
skill files drifted out of date and was removed. If you are tempted to add a rule here,
add it to the relevant `docs/system/` file instead and link it above.
