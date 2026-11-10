# AI kit: maintainer notes

How the `@harnessio/ui` Claude Code kit is built, checked and measured. Consumer docs are in the
"Using Claude Code with @harnessio/ui" section of `packages/ui/README.md`.

The failure the kit targets: the `@harnessio/ui` Tailwind preset replaces the default colour,
spacing, radius, font-size and shadow scales, so `bg-blue-500` and `p-4` compile to nothing.
The page renders unstyled and nothing complains. The lint makes that loud, and the hook hands
the error back to Claude in the same turn.

## Where things are (all under `packages/ui`)

Shipped in the npm package:

- `bin/harnessio-ui.cjs`: the `init-ai` command. Merges the hook into the consumer's `.claude/settings.json`, copies the skill with its paths rewritten to `node_modules/@harnessio/ui/...`, and adds a marked block to `CLAUDE.md`. Idempotent; never installs anything.
- `.claude/skills/design-system/SKILL.md`: the workflow. Written with package-relative paths (`docs/...`, `eslint/...`); `init-ai` rewrites them.
- `eslint/ds-prototyping.js`: the lint config, the enforcer. Exported as `@harnessio/ui/eslint`. `eslint/package.json` marks the folder CommonJS so it loads under `"type": "module"` hosts.
- `eslint/post-edit-lint.js`: the PostToolUse hook. Lints the file Claude just wrote and returns violations as a block.
- `eslint/rules.js`: copy of the root `eslint/rules.js` (deprecated `-cn-foreground-` and `-cn-background-` classes).
- `docs/system/*.md`: system rules, with `docs/system/README.md` as the index. `docs/DESIGN.md`: copy of the root `DESIGN.md`. `docs/components-index.md`: one row per exported component (generated; about 43% of rows have a purpose line).

Not shipped:

- `scripts/ai/build-component-index.cjs`: regenerates `docs/components-index.md` from a built package.
- `scripts/ai-eval/`: fixtures, the fixture assertion, and the eval harness.
- `scripts/__tests__/ai-kit.test.ts`: runs under `pnpm test`.

## What the lint rejects

Listed in the package README. One point specific to maintainers: the width and height ban overrides `docs/system/spacing.md`, which notes that canary's own components still use arbitrary sizes. The skill and `docs/system/README.md` say so.

## Fixtures

`scripts/ai-eval/check-fixtures.cjs` asserts the violation count for each fixture and exits 1 on any mismatch. Run it after every change to `eslint/ds-prototyping.js`.

| Fixture | Expected violations |
|---|---|
| `scripts/ai-eval/fixtures/bad.tsx` | 16 |
| `scripts/ai-eval/fixtures/good.tsx` | 0 |
| `scripts/ai-eval/fixtures/edge.tsx` | 0 |
| `scripts/ai-eval/fixtures/bad-geometry.tsx` | 4 |

```bash
DS_PACKAGE_DIR=$PWD DS_ESLINT_ROOT=/path/with/eslint/node_modules \
  node scripts/ai-eval/check-fixtures.cjs
```

`edge.tsx` holds valid code that looks suspicious (theme classes, `cn-page-content`, sizes computed from props). A rule change that flags it is a false positive.

## Drift check

`scripts/__tests__/ai-kit.test.ts` runs under `pnpm test` and fails when:

- `eslint/rules.js` differs from the root `eslint/rules.js`, or `docs/DESIGN.md` differs from the root `DESIGN.md`. Copy the root file over the package copy.
- a forbidden-element message names a component the package does not export. This check skips when `dist/` is missing; set `DS_KIT_REQUIRE_DIST=1` in a pipeline that builds first to make a missing build a failure.
- `package.json` `files` omits a shipped path, or the skill references a file the package does not ship.
- a `docs/system` file mentions manifests, `ds-check` or `packages/ui/AGENTS.md`.
- `init-ai` stops being idempotent, drops existing settings or `CLAUDE.md` content, or writes when `--dry-run` is set.

## Eval

```bash
DS_PACKAGE_DIR=<built @harnessio/ui, for dist/> DS_ESLINT_ROOT=... scripts/ai-eval/run.sh <kit|hint|baseline> [prompt-id ...]
```

Runs each prompt in `scripts/ai-eval/prompts.json` headlessly (`claude -p`) in a throwaway app, then lints what Claude wrote with the same config. The `kit` condition runs `harnessio-ui init-ai` in the app, as a consumer would, against a staged copy of this checkout's shipped files plus the built `dist/`. It proves the installed hook blocks `bad.tsx` before spending a run.

Results, 15 prompts per pass, clean = zero lint violations:

| Stage | Clean runs |
|---|---|
| Baseline (installed package only) | 0/15, 200 violations |
| Hint (a short note in CLAUDE.md) | 0/15, 93 violations |
| Kit rules only | 11/15, 11/15 |
| Plus component index and revised skill, hook not working | 13/15, 13/15 |
| Plus working lint hook | 15/15, 15/15 |
| Plus width ban and `cn-page-content` whitelist | 15/15 (one pass) |

Baseline, hint and the width-ban stage ran once; the other kit stages ran twice. All of these runs used the earlier layout, where the kit files were copied into the app by hand. After the move into `packages/ui`, only one prompt (`red-badge`, clean, $0.07) has run through the `init-ai` path. The full 15-prompt pass has not been repeated.

**Read these numbers with the caveats.** The lint config is both enforcer and judge, so 30/30 shows Claude satisfies the lint, not that the output renders or looks right. There is no `tsc` or screenshot check in the score. The prompts are written to tempt. Before the width ban, one run satisfied the lint with `style={{ width: 720 }}`. In the width-ban pass, `arbitrary-spacing` used `w-full max-w-cn-page`, `p-cn-sm` and `gap="2xs"` and disclosed each substitution. That reply also misattributed the ban to `spacing.md`, and its claim about the width of `max-w-cn-page` was not checked.

## Differences from the #11459 docs

- `SKILL.md` has no registry, manifest, pattern-doc or `ds-check` steps. The installed types are the prop source, and a rule conflict means substitute and disclose rather than warn and wait.
- `docs/system/design-to-code-flow.md` and `component-architecture.md` have the manifest and pattern-doc references removed. The other eight files match #11459.
- `component-architecture.md` still has a "Follow the actual file structure" section describing canary's `src/components/` layout. It applies to library authors, not prototypers.
- `docs/DESIGN.md` is verbatim, including its COMPONENTS section, which points at canary source paths in comments.

## Not included, on purpose

- Component manifests, OpenAPI specs, `registry.json`, `schemas/*.md` pattern docs. These stay on #11459.
- `ds-check`, which enforces manifests. Prop enforcement here is `tsc` against the shipped types.
- Optional `peerDependencies` for the lint packages. Adding them changes the lockfile; `init-ai` prints the install command instead.
- An Oxlint variant. platformUI uses Oxlint; this config is ESLint 8 only.
