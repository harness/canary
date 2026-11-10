# Design system prototyping kit

Rules, a lint config and a lint hook that keep Claude Code on `@harnessio/ui` components and
tokens when it prototypes. Extracted from `canary` (`packages/ui`). It excludes component
manifests, OpenAPI specs, the registry and per-component pattern docs.

The failure it targets: the `@harnessio/ui` Tailwind preset replaces the default colour,
spacing, radius, font-size and shadow scales, so `bg-blue-500` and `p-4` compile to nothing.
The page renders unstyled and nothing complains. The lint makes that loud, and the hook hands
the error back to Claude in the same turn.

## Install into a prototype repo

1. Copy `.claude/`, `docs/`, `AGENTS.md`, `DESIGN.md` and `eslint/` into the repo root, keeping the paths.
   Keep `eslint/package.json`: it marks the folder as CommonJS, so the config and hook still load when the host app has `"type": "module"`.
2. Add `@harnessio/ui` as a dependency. Its `tailwind.config` must use the `@harnessio/ui` preset.
3. Install the lint dependencies: `eslint@8`, `eslint-plugin-react`, `eslint-plugin-tailwindcss`, `@typescript-eslint/parser`.
4. Paste the block below into the repo's `CLAUDE.md`. A skill can fail to trigger; this makes the check unconditional.
5. Open `/hooks` once, or restart Claude Code. The settings watcher only picks up `.claude/` if it existed when the session started.

```md
## Design system
@AGENTS.md
Before writing or editing any UI, read `.claude/skills/design-system/SKILL.md`.
Use only components and props that exist in `node_modules/@harnessio/ui/dist/components.d.ts`.
No hard-coded colours, no className/style overrides on design-system components.
Run `tsc --noEmit` before finishing.
```

To lint outside the hook, extend the config from an `.eslintrc.js`:

```js
module.exports = { root: true, extends: [require.resolve('./eslint/ds-prototyping.js')] }
```

## What is in here

- `.claude/skills/design-system/SKILL.md`: the workflow. Read the component index, check props in the installed types, build with components and tokens, fix lint errors from the hook, run `tsc`.
- `.claude/settings.json`: registers the lint hook (PostToolUse on `Write|Edit`).
- `AGENTS.md`: system rules index and the token rule. Extracted from canary's `packages/ui/AGENTS.md`; only the parts that do not need manifests.
- `DESIGN.md`: token spec (colours, typography, radius, spacing). Reference for token names.
- `docs/system/*.md`: 10 system rule files from canary.
- `docs/components-index.md`: one row per exported component (196 rows, generated from `@harnessio/ui@1.6.5`). About 43% of rows have a purpose line; the rest give the name only.
- `eslint/ds-prototyping.js`: the lint config. It is the enforcer.
- `eslint/post-edit-lint.js`: the hook. Lints the file Claude just wrote and returns violations to Claude as a block.
- `eslint/rules.js`: verbatim copy of canary's `eslint/rules.js` (deprecated `-cn-foreground-` and `-cn-background-` classes). `scripts/sync.js` checks it has not drifted.
- `scripts/build-component-index.js`: regenerates `docs/components-index.md` from a built package.
- `scripts/sync.js`: drift check (see below).
- `eval/`: the harness that measures whether the kit changes what Claude writes.

## What the lint rejects

- Hex colours, `rgb()`-style colour functions, default-palette classes (`bg-blue-500`), `text-white`/`bg-black`.
- Inline `style` for colour, type, spacing, radius or shadow.
- Fixed widths and heights: `w-[720px]`, `style={{ width: 720 }}`, `maxWidth: '40rem'`. A size computed from data (`style={{ width: progress }}`) is allowed. This overrides `docs/system/spacing.md`, which notes canary's own components still use arbitrary sizes.
- Arbitrary Tailwind values, contradicting classes, and classes the preset does not define. Allowed host classes: `cn-root`, `cn-page-content`, `cn-page-content-pt`, and the `light`/`dark` theme classes.
- Raw `<button>`, `<input>`, `<select>`, `<textarea>`, `<dialog>`, `<table>`.
- Radix, deep `@harnessio/ui` imports, and other UI or icon libraries.

## Fixtures

`eval/check-fixtures.js` asserts the violation count for each fixture and exits 1 on any mismatch. Run it after every change to `eslint/ds-prototyping.js`.

| Fixture | Expected violations |
|---|---|
| `eval/fixtures/bad.tsx` | 16 |
| `eval/fixtures/good.tsx` | 0 |
| `eval/fixtures/edge.tsx` | 0 |
| `eval/fixtures/bad-geometry.tsx` | 4 |

```bash
DS_PACKAGE_DIR=/path/to/built/@harnessio/ui DS_ESLINT_ROOT=/path/with/eslint/node_modules \
  node eval/check-fixtures.js
```

`edge.tsx` holds valid code that looks suspicious (theme classes, `cn-page-content`, sizes computed from props). A rule change that flags it is a false positive.

## Drift check

```bash
node scripts/sync.js <path-to-built-@harnessio/ui> [canary-root] [--write] [--rules-only]
```

Exit 1 when `eslint/rules.js` differs from canary's, or when a forbidden-element message names a component the package does not export. `--write` copies canary's `rules.js` over the kit's. `--rules-only` skips the component check, which needs `dist/components.d.ts`.

In canary, `packages/ui/scripts/__tests__/ds-prototyping-kit.test.ts` runs it under `pnpm test`. The `rules.js` check always runs. The component check skips when `packages/ui/dist` is missing; set `DS_KIT_REQUIRE_DIST=1` in a pipeline that builds first to make a missing build a failure.

## Eval

```bash
DS_PACKAGE_DIR=... DS_ESLINT_ROOT=... eval/run.sh <kit|hint|baseline> [prompt-id ...]
```

Runs each prompt in `eval/prompts.json` headlessly (`claude -p`) in a throwaway app, then lints what Claude wrote with the same config. The `kit` condition proves the hook blocks `bad.tsx` before spending a run.

Results, 15 prompts per pass, clean = zero lint violations:

| Stage | Clean runs |
|---|---|
| Baseline (installed package only) | 0/15, 200 violations |
| Hint (a short note in CLAUDE.md) | 0/15, 93 violations |
| Kit rules only | 11/15, 11/15 |
| Plus component index and revised skill, hook not working | 13/15, 13/15 |
| Plus working lint hook | 15/15, 15/15 |
| Plus width ban and `cn-page-content` whitelist | 15/15 (one pass) |

Baseline, hint and the width-ban stage ran once; the other kit stages ran twice.

**Read these numbers with the caveats.** The lint config is both the enforcer and the judge, so 30/30 shows Claude satisfies the lint, not that the output renders or looks right. There is no `tsc` or screenshot check in the score. The prompts are written to tempt. Each prompt ran twice. Before the width ban, one run satisfied the lint with `style={{ width: 720 }}`. In the width-ban pass, `arbitrary-spacing` used `w-full max-w-cn-page`, `p-cn-sm` and `gap="2xs"` and disclosed each substitution.

## Differences from canary

- `SKILL.md` merges canary's root stub and `packages/ui/.claude/skills/design-system/SKILL.md`, with the registry, manifest, pattern-doc and `ds-check` steps removed, the installed types as the prop source, and substitute-and-disclose in place of warn-and-wait.
- `docs/system/*.md` are canary's files with references to manifests and pattern docs removed and the `packages/ui/AGENTS.md` cross-reference repointed at the kit's `AGENTS.md` (`design-to-code-flow.md`, `component-architecture.md`). `design-to-code-flow.md` also replaces the warn-and-wait paragraphs with substitute-and-disclose.
- `component-architecture.md` still has a "Follow the actual file structure" section describing canary's `src/components/` layout. It applies to library authors, not prototypers.
- `DESIGN.md` is verbatim, including its COMPONENTS section. It points at canary source paths in comments.

## Not included, on purpose

- Component manifests, OpenAPI specs, `registry.json`, `schemas/*.md` pattern docs.
- `ds-check`, which enforces manifests. Prop enforcement here is `tsc` against the shipped types.
- An Oxlint variant. platformUI uses Oxlint; this config is ESLint 8 only.
