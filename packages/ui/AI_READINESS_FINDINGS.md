# AI-Readiness Findings — `packages/ui` owners

**Audience:** abhinav.rastogi, kevin.nagurski, vardan.bansal, pranesh.g,
shaurya.kalia, srdjan.arsic (core-design-system: pranesh.g)

## Bottom line

An external audit scored how well AI coding agents build with Canary and
recommended Figma Code Connect as the top fix. Rather than execute the PDF, we
tested its claims with a re-runnable A/B harness. The prioritization it implies
is wrong for our repo: **adding agent docs is low-return, because agents read our
source and copy real usage.** The high-return work is **fixing factually-wrong
docs** and **binding Figma to code**. Four branches are up for review; Code
Connect is live for the badge family under a reversible label.

## What we verified vs. the audit

Most claims hold. Four corrections so you trust our read over the PDF:

- JSDoc claim ("296 files, zero blocks") is overstated — actual ~33% coverage.
- Issue **#1100 does not exist** in our history; only **#1505** (Tag migration).
- Arbitrary-px count is 79–81, not 78.
- Our token layer already separates `badge`/`tag` sets — the fix leaned on
  distinctions we already encode.

## The evidence

Four A/B trials, 24 build runs, mostly Sonnet 4.6. Same task, once with a change,
once without; compare what the agent ships.

- In **3 of 4 trials, docs made no measurable difference** — agents chose the same
  components either way by reading real usage in `packages/views`.
- The one trial that moved: the badge-boundary doc fix took baseline **1/3 →
  treatment 3/3**.

Read that as "docs help where a doc is actively *wrong* and no code example
protects the agent," not "docs help generally." **Confidence: moderate on the
null result, low-to-moderate on the positive — small n, single model family.**

## Shipped (in review)

- **`docs/ui-agent-readiness`** — corrects the phantom `badge.tsx` anchor in
  DESIGN.md; adds `packages/ui/AGENTS.md`. Trial-backed.
- **`docs/design-md-fact-fixes`** (stacked on the above — **merge that first or
  retarget its base**) — verified-against-source fixes: `cn-set-lime-*` →
  `cn-set-forest-green-*` (the lime set doesn't exist); component radii
  (button/input/dialog/dropdown/badge) corrected to match
  `components/desktop/base/*.json`; tooltip/popover elevation `cn-shadow-3` →
  `-4`; intent count 14 → 16; and `split-button.tsx` JSDoc, which listed
  `variant=solid/surface`, `theme=primary/muted` — none of which exist on Button.
- **`docs/filters-agent-guide-fix`** — the guide claimed "headless, no UI"; the
  package now ships `FilterGroup`/`ListControlBar`/`SavedFilters`/
  `SaveFiltersDialog` on `@harnessio/ui`. Fixed the thesis, version (0.0.4 →
  0.2.2), and the missing `@harnessio/ui` peer-dep note.
- **`feat/code-connect-badge-pilot`** — `@figma/code-connect` mappings for
  Tag/StatusBadge/CounterBadge, published under label `badge-pilot`, verified via
  the MCP handoff channel. Includes an `.npmrc` scope route (the tooling isn't in
  our CodeArtifact upstream) so CI/local install works. See
  [`CODE_CONNECT.md`](./CODE_CONNECT.md).

## Dropped

- **`docs/ui-component-boundaries`** — new "which component to use when"
  guidance. Correct content, but the trial showed zero measurable effect. Not
  worth the maintenance surface.

## Decisions we need

1. **`badge-pilot` Code Connect is live on the shared HDS file.** Leave it as the
   working demo, or unpublish and republish through CI on merge? Labeled and
   reversible (`figma connect unpublish --label badge-pilot`).
2. **Root cause worth a real fix:** DESIGN.md's token frontmatter is
   hand-maintained and has drifted from `core-design-system` (colors, radii,
   typography all had errors). We hand-fixed the agent-dangerous ones; the
   dark-gray primitives and type scale will re-drift. **Recommend generating the
   token section from source** rather than more hand-patching (pranesh.g's call).
3. **Two real code smells, not doc issues** (separate PRs): `input.tsx` and
   `inputs/base-input.tsx` both export `Input`/`InputProps`/`BaseInputProps`
   through the barrel — an ambiguous `export *` collision that may make those
   types unreachable; and portal `.mdx` docs still recommend `Sheet` (0 product
   uses) and `Drawer.Steps` (superseded per `stepper/DESIGN.md`) with no
   deprecation note.

## The reusable asset

The A/B harness. Before spending on any future AI-readiness work, we can measure
whether it changes agent output first. Propose that as the gate for this effort.

## Heads-up for whoever publishes Code Connect next

The Figma MCP context tool reports property keys with a `#nodeId` suffix (e.g.
`text#1444:4`) that the publish API **rejects** — use the plain name (`text`).
Cost us a failed publish. `figma connect create` generates the correct format.
