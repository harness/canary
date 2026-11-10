# Design system prototyping kit

Makes Claude Code use `@harnessio/ui` components and follow system rules when prototyping.
Extracted from `canary` (`packages/ui`). Excludes component manifests, OpenAPI specs, the
registry, and per-component pattern docs.

## Install into a prototype repo

1. Copy `.claude/` and `docs/` into the repo root, keeping the paths.
2. Add `@harnessio/ui` as a dependency (the skill reads `dist/components.d.ts`).
3. Paste the block below into the repo's `CLAUDE.md`. A skill can fail to trigger; this
   line makes the check unconditional.

```md
## Design system
Before writing or editing any UI, read `.claude/skills/design-system/SKILL.md`.
Use only components and props that exist in `node_modules/@harnessio/ui/dist/components.d.ts`.
No hard-coded colours, no className/style overrides on design-system components.
Run `tsc --noEmit` before finishing.
```

## What is in here

- `.claude/skills/design-system/SKILL.md` — rewritten router (see below)
- `docs/system/*.md` — 10 system rule files from canary
- `DESIGN.md` — token spec
- `eslint/rules.js` — class-name lint rules

## Differences from canary

- `SKILL.md` is a merge of canary's root stub and `packages/ui/.claude/skills/design-system/SKILL.md`,
  with the registry, manifest, pattern-doc and `ds-check` steps removed and the installed
  types as the prop source.
- `docs/system/*.md` are canary's files with references to manifests, pattern docs,
  and `packages/ui/AGENTS.md` removed (`design-to-code-flow.md`,
  `component-architecture.md`). Everything else is verbatim.
- `component-architecture.md` still has a "Follow the actual file structure" section that
  describes canary's own `src/components/` layout. It applies to library authors, not prototypers.
- `DESIGN.md` is verbatim and includes its COMPONENTS section (token-based style anchors).
  It points at canary source paths in comments.

## Token and lint enforcement

- `DESIGN.md` — token spec (colors, typography, rounded, spacing). Reference it for token names.
- `eslint/rules.js` — exports `classNameRules` (flags deprecated `-cn-foreground-` and
  `-cn-background-` classes). Wire it into an ESLint config as `no-restricted-syntax`:

```js
const { classNameRules } = require('./eslint/rules')
module.exports = { rules: { 'no-restricted-syntax': ['error', ...classNameRules] } }
```

## Not included, on purpose

- Component manifests, OpenAPI specs, `registry.json`, `schemas/*.md` pattern docs
- `ds-check` (enforces manifests; needs them). Prop enforcement here is `tsc` against the shipped types.
