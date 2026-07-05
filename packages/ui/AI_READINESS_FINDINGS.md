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

## Fidelity investigation — where "looks like Harness" actually comes from

Motivating problem: prototypes built with `@harnessio/ui` in the platformUI /
kitchen-sink context look right; the same design built bare/out-of-context comes
out as an off-brand imitation. We ran three trials (Figma node → build a
component/page, file-parsed scoring, Opus 4.8, n=5 or 3 per arm) to find *what*
in the context actually drives fidelity. Results narrowed the cause twice:

1. **Figma-handoff, no repo (Code Connect on vs. off):** 0/5 → 5/5. With no code
   to read, Code Connect is the only thing that routes an agent to the real
   component; without it, every run hand-rolled a raw-hex imitation.

2. **Inside kitchen sink (Code Connect on vs. off):** 5/5 either way. Repo context
   substitutes for Code Connect — agents find the component by reading source.

3. **Ablation — kitchen sink WITH vs. WITHOUT the template/feature corpus**
   (stripped copy = package + token CSS + config, `src/features` removed via a
   real filesystem boundary):
   - *Single component:* stripped 5/5, corpus 3/3 → **the template corpus is NOT
     what drives single-component fidelity. The installed package + its token
     styles do.** Agents recover the right component from the package's own
     `.d.ts`/source.
   - *Full page (compose a list page):* both arms produced the full idiom —
     `Page` scaffold, `DataTable`, `NoData` (empty + filtered), `Skeleton`
     loading, `StatusBadge` — with zero hand-rolled layout. The package's **type
     definitions teach page assembly** better than expected. The corpus changed
     exactly one thing, consistently (3/3): search wiring. Corpus runs used
     `@harnessio/filters`' `FilterGroup` (the app's real list-page pattern) and
     mirrored the actual connectors page; stripped runs used a generic
     `SearchInput` — correct, but not the house convention, because they never
     discovered the separate `@harnessio/filters` package.

**What this means, precisely:** fidelity for AI prototyping comes from **the
installed package + its token CSS being present** (that's the platformUI /
kitchen-sink sweet spot). The template corpus is not the fidelity engine — it's a
**last-mile convention layer**: it surfaces cross-package / house conventions an
agent can't infer from `@harnessio/ui`'s types alone (e.g. "reach for
`@harnessio/filters` on list pages"). The `FilterGroup`-vs-`SearchInput` gap is
arguably a **discoverability** problem as much as a convention one — a cheaper fix
than maintaining a corpus is to make `@harnessio/ui` point at `@harnessio/filters`
for the patterns that need it.

Confidence: directional — one component + one page type, Opus 4.8, n≤5/arm.
"Templates aren't the engine" reproduced across two ablations; the convention
delta is one consistent finding on one page. Caveat: the composition test was
spec-driven (no full-page Figma frame available), so it isolates corpus-vs-none,
not Figma-handoff.

Do NOT act on this yet as a corpus-investment decision — the actionable read is
(a) keep the package trivially consumable in-context, (b) fix cross-package
discoverability, not (c) build/curate a template library. Route AI prototyping
through kitchen sink (it already provides the context that works).

Raw data: `CODE_CONNECT_TRIAL.md` (handoff + kitchen-sink); ablation + composition
scores in this session's trial dirs.

## The reusable asset

The A/B harness. Before spending on any future AI-readiness work, we can measure
whether it changes agent output first. Propose that as the gate for this effort.
It just did its job twice here — deflating "the template corpus is the fidelity
engine" before it became a costly investment.

## Heads-up for whoever publishes Code Connect next

The Figma MCP context tool reports property keys with a `#nodeId` suffix (e.g.
`text#1444:4`) that the publish API **rejects** — use the plain name (`text`).
Cost us a failed publish. `figma connect create` generates the correct format.
