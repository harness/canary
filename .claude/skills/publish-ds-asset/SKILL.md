---
name: publish-ds-asset
description: Publish a new icon, logo, symbol or brand mark from the HDS Figma file into canary end-to-end — verify the Figma component, export the SVG, update the name map(s), branch, commit, then draft the Jira ticket and PR for approval. Use whenever someone wants to add, publish, export, ship, or "get into code" an icon or logo for canary / @harnessio/ui / IconV2 / LogoV2 / LogoSymbol — including "I've finished an icon in Figma, what now?", "add the <brand> logo", "this icon needs to go to dev", or questions about icons-to-dev / brands-to-dev, pnpm update:icons / update:logos, icon-name-map.ts or logo-name-map.ts.
---

# Publish an icon or logo to canary

Takes one approved Figma component to a pushed branch with a drafted Jira ticket and PR.

**Publish one asset per branch, ticket and PR.** The name maps change on every asset, so batching
guarantees merge conflicts.

**Hard stop before Jira and PR.** Everything up to and including the local commit is automatic.
Creating the ticket and opening the PR requires explicit user approval — a bad export must not
become a public PR and a real ticket someone has to clean up.

## Scope check first

This skill covers the **scripted** pipelines only:

| Asset | Figma export page | Covered |
|---|---|---|
| Icon | `icons-to-dev` | Yes |
| Logo / symbol | `brands-to-dev` | Yes |
| Empty-state illustration | — | **No.** Manual process, no export script. Stop and tell the user. |

This skill also assumes the design is **already approved and built** in Figma. It does not do
ideation, drawing, or design review. If the user has only an idea, say so and point them at the
ideation and Figma-structure playbooks before continuing.

## Step 0 — Pick the export route

Two routes produce the same result. Prefer A.

**Route A — Figma Desktop Bridge (`figma-console` MCP). No token of any kind.**
Exports your one component via `exportAsync`. Verified working. Because it touches exactly one
asset, the diff is inherently clean.

**Route B — `pnpm update:icons` / `pnpm update:logos`. Needs a Figma PAT.**
The documented upstream path. Re-downloads all 534 icons / 181 logos and regenerates the maps
wholesale, so it needs a manual diff-isolation cleanup afterwards. Use when the bridge is
unavailable, when the parity check fails, or when running headless.

Choose like this:

```
Call figma_get_status (probe: true).
  Connected?                                  → Route A
  Not connected, but packages/ui/.env has FIGMA_TOKEN  → Route B
  Neither → ask the user: open Figma Desktop (preferred), or create a PAT.
```

Never ask for a PAT if the bridge is available — it is strictly unnecessary there.

## Step 1 — Branch with a worktree

Do this before any export, so nothing lands in a dirty tree.

```bash
git -C <canary> fetch origin
git -C <canary> worktree add ../canary-<name>-<icon|logo> -b feat/<name>-<icon|logo> origin/main
cd ../canary-<name>-<icon|logo> && pnpm install
```

`pnpm install` is **required** — a fresh worktree has no `node_modules`, and every script here needs
`svgo` and `liquidjs` from `packages/ui`. Skipping it fails with `Cannot find package 'dotenv'` on
Route B, or a resolve error on Route A.

**`pnpm install` is not enough for `pnpm typecheck`.** It does not build sibling workspace packages,
so `packages/ui` cannot resolve their types and typecheck fails with errors that have nothing to do
with your asset — e.g. `Cannot find module '@harnessio/yaml-editor'` (verified: 5 such errors in a
fresh worktree, 0 in a clone where `packages/yaml-editor/dist` exists). Either run `pnpm build` from
the worktree root first, or expect the failure and verify it is pre-existing per Step 5.

Writing a sibling directory may need a one-time filesystem permission grant. Expected and safe.

**Fail fast:** Step 2's Figma verification is entirely read-only, and `pnpm install` in a fresh
worktree takes minutes. If the component might not be export-ready, run Step 2 **before** this step
— otherwise a rejected component means you built a worktree and installed dependencies for nothing.

If the main clone's tree is clean you can skip the worktree entirely and just branch in place
(`git checkout -b feat/<name>-icon origin/main`), which reuses the existing `node_modules`. The
worktree exists to protect unrelated in-flight work, so it only earns its cost when the tree is dirty.

## Step 2 — Verify the Figma component

Read `references/figma-spec.md` and check every box **before** exporting. A malformed component is
the most common cause of a broken export, and it is much cheaper to catch here.

Point the bridge at the icons file and inspect — note this is a *different* file from
`HDS | Components 3.0`, which is the one usually open:

```
figma_navigate  url: https://www.figma.com/design/NYeN8I4D3anR9it8ds0lyr/  lock: true
```

```js
// figma_execute — inspect the component against the spec
await figma.loadAllPagesAsync()
const PAGE = 'icons-to-dev'            // or 'brands-to-dev' for logos
const NAME = '.your-asset-name'        // dot-prefixed
const page = figma.root.children.find(p => p.name === PAGE)
if (!page) return { error: 'page not found', pages: figma.root.children.map(p => p.name) }
const node = page.findOne(n => n.type === 'COMPONENT' && n.name === NAME)
if (!node) return { error: 'component not found', hint: 'name must be dot-prefixed and type COMPONENT' }
return {
  type: node.type,
  size: [node.width, node.height],          // icons 16×16, logos 22×22
  description: node.description,            // logos: MUST be the brand hex
  childCount: node.children.length,
  children: node.children.map(c => ({
    name: c.name, type: c.type, isMask: c.isMask,
    fills: c.fills, strokes: c.strokes
  }))
}
```

Then run **Guard A** — the linter. It catches the whole class of malformed-component bugs
mechanically, which is cheaper and more reliable than eyeballing the output above. Dump the page to
JSON and lint it:

```js
// figma_execute — dump the export page for the linter
await figma.loadAllPagesAsync()
const PAGE = 'brands-to-dev'   // or 'icons-to-dev'
const TYPE = 'logo'            // or 'icon'
const page = figma.root.children.find(p => p.name === PAGE)
const hex = c => c ? '#' + [c.r,c.g,c.b].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('').toUpperCase() : null
const firstFill = ch => {
  let f = ch.fills
  // A vector with per-region fills reports node-level fills as figma.mixed. Fall
  // back to the first filled region, or the linter is blind to the mark colour
  // and cannot run its contrast check.
  if (f === figma.mixed && ch.vectorNetwork && ch.vectorNetwork.regions) {
    const r = ch.vectorNetwork.regions.find(r => (r.fills || []).length)
    f = r ? r.fills : null
  }
  if (!Array.isArray(f) || !f.length) return { fillHex: null, fillBound: null, fillType: null }
  const p = f.find(x => x.type === 'SOLID') || f[0]
  // fillType matters: a GRADIENT_* or IMAGE fill cannot ship. See the linter.
  return { fillHex: hex(p.color), fillType: p.type, fillBound: !!(p.boundVariables && p.boundVariables.color) }
}
// Outline icons are stroke-based and have no fill, so the gradient check needs
// the stroke paint too or it would never fire on an icon.
const firstStroke = ch => {
  const s = ch.strokes
  // figma.mixed is a Symbol and will crash JSON.stringify — normalise it.
  const safe = v => { try { return v === figma.mixed ? 'MIXED' : (typeof v === 'symbol' ? 'MIXED' : v) } catch { return null } }
  const caps = { strokeCap: safe(ch.strokeCap), strokeJoin: safe(ch.strokeJoin) }
  if (!Array.isArray(s) || !s.length) return { strokeHex: null, strokeType: null, ...caps }
  const p = s.find(x => x.type === 'SOLID') || s[0]
  return { strokeHex: hex(p.color), strokeType: p.type, ...caps }
}
const components = page.findAllWithCriteria({ types: ['COMPONENT'] }).map(c => ({
  name: c.name, type: c.type,
  width: Math.round(c.width), height: Math.round(c.height),
  description: c.description || '',
  children: c.children.map(ch => ({
    name: ch.name, type: ch.type, isMask: ch.isMask === true, ...firstFill(ch), ...firstStroke(ch)
  }))
}))
return JSON.stringify({ page: PAGE, type: TYPE, components })
```

Write that JSON to a file, then:

```bash
# lint just the asset you are shipping
node .claude/skills/publish-ds-asset/scripts/lint-page.mjs --in /tmp/page.json --only <name>

# or lint the whole page (also detects name collisions, which --only cannot)
node .claude/skills/publish-ds-asset/scripts/lint-page.mjs --in /tmp/page.json --quiet
```

Errors block shipping. Warnings are judgement calls — read them and decide.

Note the page may already carry pre-existing errors on *other* assets. Those are not yours to fix;
use `--only` to check your own, and report anything alarming rather than silently widening scope.

### Gradient marks always stop the automated path

If the mark has a **gradient** (or image) fill, it cannot be exported — HDS marks are single-colour.
The logo pipeline would preserve the gradient and ship it **silently**; the symbol pipeline would
flatten every sub-shape to one colour and can render the mark unreadable. The linter errors on any
non-`SOLID` fill.

Do not try to convert the gradient yourself. Tell the user a monochrome source is needed and walk
the escalation in order: **simpleicons.org** → **the brand's own guidelines / press kit** (look for
the mono or one-colour mark) → **redraw the vector by hand**. Full detail, including how to choose a
background hex for a gradient brand, is in `references/figma-spec.md` under "Gradient and
multi-colour marks".

Stop and report to the user if anything fails the spec. Do not "fix" their Figma component silently.

## Step 3 — Validate the name

`add-asset.mjs` enforces the rules that break the build (kebab-case, no leading digit, no dot). It
cannot judge the rules that need a human: noun-first word order, correct family prefix, and whether
a suffix or a wholly new name is right. Check those against `references/figma-spec.md` and confirm
with the user if ambiguous.

Always check for collisions and for the closest precedent to match:

```bash
grep -n "<proposed-name>" packages/ui/src/components/icon-v2/icon-name-map.ts
grep -n "<proposed-name>" packages/ui/src/components/logo-v2/logo-name-map.ts
grep -n "<proposed-name>" packages/ui/src/components/logo-v2/symbol-name-map.ts
```

A hit means either this concept already shipped — go look at it, you may have the wrong precedent —
or you need a more specific name.

## Step 4A — Export via the bridge

### First, run the parity check. Mandatory before the first asset in any session.

This is what makes Route A trustworthy. It exports an asset that is **already committed**, re-derives
it through the skill's replica pipeline, and asserts byte-identical output. That simultaneously
proves the replica matches `scripts/icons.js` *and* that `exportAsync` matches what the Figma REST
API returns.

```bash
cd packages/ui
# list committed assets, then pick one that is ALSO still on the Figma export page
node ../../.claude/skills/publish-ds-asset/scripts/parity-check.mjs --committed --type icon
```

Both export pages are permanent catalogues, so **any shipped asset works as a fixture** — no need to
cross-reference what is still on the page.

Export the fixture (same settings as the real export, below), then:

```bash
node ../../.claude/skills/publish-ds-asset/scripts/parity-check.mjs \
  --type icon --name <fixture> --raw /tmp/fixture.svg
# logos additionally need --hex '<brand hex from the component description>'
```

**If parity fails, stop and switch to Route B.** Do not ship from the bridge. The script prints the
likely causes ranked.

### Then export the real asset

```js
// figma_execute — export settings MUST match the Figma REST API defaults,
// or the output will not match the other assets in the repo.
await figma.loadAllPagesAsync()
const page = figma.root.children.find(p => p.name === 'icons-to-dev')
const node = page.findOne(n => n.type === 'COMPONENT' && n.name === '.your-asset-name')
const bytes = await node.exportAsync({
  format: 'SVG',
  svgOutlineText: true,
  svgIdAttribute: false,
  svgSimplifyStroke: true
})
let svg = ''
for (let i = 0; i < bytes.length; i += 4096) {
  svg += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 4096)))
}
return { svg, byteLength: bytes.length }
```

Write the returned `svg` verbatim to a temp file (e.g. `/tmp/<name>.svg`) — do not reformat or
pretty-print it — then:

```bash
cd packages/ui
node ../../.claude/skills/publish-ds-asset/scripts/add-asset.mjs \
  --type icon --name <name> --raw /tmp/<name>.svg

# logos (writes both logo and symbol SVGs and updates both maps):
node ../../.claude/skills/publish-ds-asset/scripts/add-asset.mjs \
  --type logo --name <name> --hex '#1F6FEB' --raw /tmp/<name>.svg
```

The script writes the processed SVG(s), inserts the import and map entry at the exact position a
future full regen would place them, and prints the precise paths to stage.

## Step 4B — Export via the PAT script

Only if Route A is unavailable. Create `packages/ui/.env` — in this worktree, since `.env` is
gitignored and does not carry over:

```
FIGMA_TOKEN=<token, File content: Read scope only>
FIGMA_FILE_ID=NYeN8I4D3anR9it8ds0lyr
FIGMA_PAGE_NAME=icons-to-dev          # icons
FIGMA_LOGO_PAGE_NAME=brands-to-dev    # logos
```

Never echo the token, never paste it into the conversation, and never set the page name to
`💠 all icons` (~2500 nodes → `414 Request-URI Too Large`) or `⭐ brand logos` (exports junk files
named like `sizexs.svg`). Confirm `git status --short` does not list `.env`.

```bash
cd packages/ui && pnpm update:icons    # or pnpm update:logos
```

Takes 60–90s. **The script catches its own errors and still exits 0 — read the output, not the exit
code.** Look for `Failed Downloads: 0` and a `Downloaded ... <name>.svg` line for your asset.

Then isolate your asset from the diff, which is the unavoidable cost of this route:

```bash
git status --short
git checkout origin/main -- packages/ui/src/components/icon-v2/icon-name-map.ts
rm <any stray .svg files that are not yours>
```

Re-add your own two lines with `add-asset.mjs` (it is idempotent and positions them correctly)
rather than hand-editing.

## Step 5 — Verify the local change

Run **Guard B** first — it catches damage the linter cannot see, like a hand-patched asset being
clobbered or an asset silently vanishing from a map. Mandatory on the PAT route, which regenerates
everything:

```bash
cd packages/ui
node ../../.claude/skills/publish-ds-asset/scripts/check-regressions.mjs --expect <name>
```

`--expect <name>` declares the one asset you intend to add, so any *other* new entry is reported as
an error rather than slipping through. Add `--ref origin/main` to check a whole branch instead of
uncommitted work.

```bash
cd packages/ui && pnpm typecheck          # see the caveat below before trusting a failure
cd <worktree root> && git status --short && git diff --stat
```

**Never pipe a command whose exit code matters.** `pnpm typecheck | tail` reports `tail`'s exit
status, so a failing typecheck looks like a pass. Redirect to a file and read `$?` instead:
`pnpm typecheck > /tmp/tc.log 2>&1; echo $?`.

**If typecheck fails, prove it is yours before chasing it.** In a fresh worktree it will almost
certainly fail on unbuilt sibling packages. Stash your change and re-run against pristine `main`:

```bash
git stash push -u packages/ui/src/components/icon-v2/    # or logo-v2
cd packages/ui && pnpm typecheck > /tmp/tc-main.log 2>&1; echo $?
git stash pop
```

Identical error counts before and after means the failure is pre-existing and not yours. Report it;
do not try to fix it inside an asset PR.

Expected, and nothing else:

| Asset | Files |
|---|---|
| Icon | `icons/<name>.svg` + `icon-name-map.ts` |
| Logo | `logos/<name>.svg`, `symbols/<name>.svg` + `logo-name-map.ts`, `symbol-name-map.ts` |

Each map should be a net +2 lines. A net +3/−1 is also correct when the asset sorts last — the
previously-final entry gains a trailing comma. Anything beyond that needs explaining before you
commit.

Sanity-check the content too: an icon must contain `currentColor` and no `width=`/`height=` on the
root `<svg>`; a logo must contain its brand hex; a symbol must contain `currentColor` and no
background rect.

## Step 6 — Commit

Stage by explicit path. Never `git add .`, so `.env` cannot slip in.

```bash
git add <the exact paths add-asset.mjs printed>
git commit -m "feat: [<TICKET-KEY>]: Add <name> <icon|logo>"
```

The ticket key is required by CI. If the ticket does not exist yet, this is the moment to stop —
go to the checkpoint, get the ticket created, then commit.

## ⛔ CHECKPOINT — get approval before anything leaves the machine

Present to the user, and wait:

1. `git diff --stat` plus the full map diff.
2. The rendered asset, if you can get it cheaply (a `figma_capture_screenshot` of the component, or
   the design-system preview app).
3. **Drafted Jira ticket** — do not create it yet:
   - Project: `UUI` ("Unified UI 3.0"), or `CODE` / `ENGOPS`. **`XD` is rejected by `messageCheck`.**
   - Type: **`Task`**.
   - Summary: **the same format as the PR title** —

     ```
     <type>: [<TICKET-KEY>]: <description>
     ```

     e.g. `feat: [UUI-4033]: Add ai-evals icon`. Same accepted types as the PR title
     (`feat` `fix` `techdebt` `hotfixpreqa` `chore`; **not** `docs`).
   - Description: one or two sentences naming the source, e.g. "Publish the `agent-dlc` icon from
     the HDS Figma `icons-to-dev` page into `@harnessio/ui` (icon-v2 set)." Name the approver.
   - Assignee: the user. Resolve their real account ID — never reuse an example ID.
   - **`FF Added` = `No`.** A required custom field. If empty, CI fails with
     `ERROR: The JIRA field 'FF Added' has not been updated`. Set it at creation time; do not wait
     for CI to fail.

   **The summary contains the ticket's own key, so creating it takes two steps.** You cannot know
   the key before the ticket exists:

   1. Create with the description-only summary (`Add ai-evals icon`) and `FF Added` set.
   2. Take the returned key and immediately edit the summary to the full
      `<type>: [<KEY>]: <description>` form.

   **Do not copy older icon tickets.** UUI-3837, UUI-3854 and UUI-3855 are type `Story` with bare
   summaries like `Add skills icon` — that is the old convention. Matching precedent here produces
   the wrong thing.
4. **Drafted PR title and description** — do not open it yet. Title format is strictly enforced:

   ```
   <type>: [<TICKET-KEY>]: <description>
   ```

   Accepted types: `feat` `fix` `techdebt` `hotfixpreqa` `chore`. **`docs` is rejected** — use
   `chore` for docs-only changes. Example: `feat: [UUI-3837]: Add prompt-repository icon`.

   Description: what was added, the Figma component link, the brand hex and mark colour for a logo,
   confirmation that only the expected files changed (paste the `git diff --stat`), the Jira link,
   and the design sign-off with date.

Only once the user approves: create the ticket, then push and open the PR.

## Step 7 — Push and open the PR

```bash
git push -u origin feat/<name>-<icon|logo>
```

**PRs go to the internal Harness remote only** (`git0.harness.io`, VPN required). Confirm with
`git remote -v` before pushing. Never push or open a PR against the `github.com/harness/canary`
mirror — it is a sync provider and the PR would never get the right checks or review.

The push output prints a "create a pull request" URL. Prefer the Harness MCP to open the PR; if it
returns 401 or empty results its credential is scoped to the wrong account — that is not fixable by
retrying. Fall back to handing the user the URL with the drafted title and description.

## Step 8 — CI and after merge

See `references/troubleshooting.md` for `messageCheck` failures, the `trigger messagecheck`
comment, the silent-no-rerun `core_template_access` trap, and name-map merge conflicts.

After merge:

- Move the ticket to its final state.
- `git worktree remove ../canary-<name>-<icon|logo>`
- Confirm it actually landed:
  `git show origin/main:packages/ui/src/components/icon-v2/icon-name-map.ts | grep <name>`
- Render it in the preview app (`pnpm dev` in `apps/design-system`) — verify it *renders*, not just
  that the file exists. For logos check `xs` and `lg`, and the symbol on light and dark surfaces.
- **Leave the component on its export page.** Both `brands-to-dev` and `icons-to-dev` are permanent
  catalogues: the maps are regenerated from whatever is on the page, so deleting a shipped component
  drops it from the map and breaks every consumer of it.

  Some older documentation claims icons are removed from `icons-to-dev` after merge. **That is
  wrong — do not do it.** Verified against the live file: all 534 mapped icons are still on the
  page, and the only component not in the map is the one icon awaiting publish.

## Files

| Path | Purpose |
|---|---|
| `scripts/names.mjs` | Name/sort rules, dependency-free so the linter runs anywhere |
| `scripts/lib.mjs` | Replica of the upstream SVGO pipelines and name-map templates |
| `scripts/add-asset.mjs` | Process one raw SVG → write asset(s) + insert map entries |
| `scripts/parity-check.mjs` | Prove the replica still matches upstream output |
| `scripts/lint-page.mjs` | **Guard A** — catch malformed Figma components before exporting |
| `scripts/check-regressions.mjs` | **Guard B** — catch clobbered or vanished assets after exporting |
| `references/figma-spec.md` | Figma component spec and naming rules to verify before export |
| `references/troubleshooting.md` | CI, Jira, export and merge-conflict failure modes |
