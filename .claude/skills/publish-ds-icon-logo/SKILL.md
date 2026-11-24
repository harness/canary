---
name: publish-ds-icon-logo
description: Publish an EXISTING, already-built icon, logo, symbol or brand mark from the HDS Figma file into canary end-to-end — verify the Figma component, export the SVG, update the name map(s), branch, commit, then draft the Jira ticket and PR for approval. Use whenever someone wants to publish, export, ship, or "get into code" an icon or logo that is already built/approved in Figma for canary / @harnessio/ui / IconV2 / LogoV2 / LogoSymbol — including "I've finished an icon in Figma, what now?", "publish the <brand> logo", "this icon needs to go to dev", or questions about icons-to-dev / brands-to-dev, pnpm update:icons / update:logos, icon-name-map.ts or logo-name-map.ts. If the asset does NOT exist yet and must be drawn, sourced, or created in Figma first, that is create-ds-asset, not this.
---

# Publish an icon or logo to canary

Takes one approved Figma component to a pushed branch with a drafted Jira ticket and PR.

**Publish one asset per branch, ticket and PR.** The name maps change on every asset, so batching
guarantees merge conflicts.

**Prerequisite: the component is already on the MAIN Figma file.** Designers build on a Figma branch,
an admin (Jared, Katie, Igor or Aaron) lints and reviews it and merges it into main, and only then does
this skill run. It reads main, read-only, so a view-only designer can run it and no merge-ordering gate
is needed. If the component is not on main yet, stop and ask an admin to merge the branch.

For the human steps end to end (Figma branch, lint plugin, admin review, approvals, merge), see
`references/designer-guide.md`. This file is the agent runbook; keep the two consistent.

## Portability (Claude Code, any agent that reads SKILL.md)

This skill is plain Markdown plus Node scripts, so it does not depend on one tool. Everything the scripts
do is `node` and `git`, run from the repo. The only tool-specific parts are the MCP calls, so read the
tool names in this file as **capabilities**, and use whatever your client calls them (MCP tools are often
prefixed differently per client, for example `mcp__figma__get_metadata` vs `get_metadata`):

| Capability | Used for | Tool (name varies by client) |
| --- | --- | --- |
| Figma read | Route M: find the node, export SVG, screenshot | official Figma MCP: `get_metadata`, `download_assets`, `get_screenshot` |
| Figma bridge | Route A only (editors) | `figma-console` MCP: `figma_execute`, `figma_navigate`, ... |
| Harness Code + Jira | create the Jira ticket and open the PR, after approval | Harness MCP (`harness_*`), Atlassian MCP |
| Shell + git + node | all scripts, commits, push | the client's terminal tool |

Rules that hold in every client:
- Run scripts from the paths shown (repo-relative, `.claude/skills/publish-ds-icon-logo/scripts/...`); do not
  copy them into a client-specific folder. If your client only scans its own skills folder, point it at
  this folder with a symlink or a one-line skill that says "follow
  `.claude/skills/publish-ds-icon-logo/SKILL.md`".
- Ask for the approval at the checkpoint **in chat** and wait for a plain yes. Do not rely on a
  client-specific question or plan tool.
- If a needed MCP is not connected, stop and say which one; never ask for a PAT while Route M or A works.
- If you cannot open the PR through an MCP, push the branch and give the user the compare URL that
  `git push` prints.

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

Three routes produce the same result. Prefer M.

**Route M — official Figma MCP (`get_metadata`, `download_assets`, `get_screenshot`). No token, no plugin.**
Read-only against the main file, so it works with view access. This is the route for designers.
Verified byte-identical to committed output for an icon (`ai`) and a logo (`slack`) once the
component's own background rect is stripped, which `--mcp` does.

**Route A — Figma Desktop Bridge (`figma-console` MCP). No token, needs edit access.**
Exports your one component via `exportAsync`. Needs the plugin, which Figma blocks in view-only
files, so this is for editors and admins.

**Route B — `pnpm update:icons` / `pnpm update:logos`. Needs a Figma PAT.**
The documented upstream path. Re-downloads every icon and logo and regenerates the maps
wholesale, so it needs a manual diff-isolation cleanup. Use only when M and A are unavailable or
their parity check fails.

```
Official Figma MCP tools available (get_metadata / download_assets)?  -> Route M
Else figma_get_status (probe: true) connected?                        -> Route A
Else packages/ui/.env has FIGMA_TOKEN                                 -> Route B
None -> ask the user to connect the Figma MCP (preferred), or create a PAT.
```

Never ask for a PAT if Route M or A is available.

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

### Always read the MAIN file

The file key is `NYeN8I4D3anR9it8ds0lyr` (HDS Icons 3.0). Never publish from a Figma branch: the design
branch must already have been merged by an admin, and the name maps are regenerated from main.

**Route M:** call `create_session` for that file key, then `get_metadata` on `2777:186` (`icons-to-dev`)
or `2943:581` (`brands-to-dev`). It lists components as `<symbol id=... name=".name">`; the output is
large, so if it is saved to a file, `grep` for yours. **No `.<name>` there means it is not on main yet:
stop and ask an admin to merge the Figma branch.** Do not fall back to a branch.

The lint (Guard A) and the stroke-survival check need a plugin page dump, so on Route M the admin did
them before merging (with the HDS Icon & Logo Lint Figma plugin). `add-asset.mjs` warns when it skips the stroke check. If
you are on Route M, skip the rest of this step.

The rest of this step is the **bridge route (Route A)**.

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
// Paints that actually render (Figma keeps hidden / 0-opacity paints in the array).
const shows = p => p.visible !== false && (p.opacity === undefined || p.opacity > 0)
// Dashes: Figma's SVG export drops stroke-dasharray, so the linter warns on any dashPattern.
const dashOf = ch => (Array.isArray(ch.dashPattern) && ch.dashPattern.length ? [...ch.dashPattern] : null)
// Geometry for the open-stroke rule: segment endpoints + each fill region's loops (segment indexes).
const vectorGeometry = ch => {
  if (ch.type !== 'VECTOR') return {}
  const out = {
    fillVisible: Array.isArray(ch.fills) ? ch.fills.some(shows) : ch.fills === figma.mixed,
    strokeVisible: Array.isArray(ch.strokes) && ch.strokes.some(shows)
  }
  try {
    const n = ch.vectorNetwork
    out.segments = n.segments.map(s => [s.start, s.end])
    out.regions = (n.regions || []).map(r => (r.loops || []).map(l => [...l]))
  } catch (e) { /* unreadable: the rule skips this node */ }
  return out
}
const components = page.findAllWithCriteria({ types: ['COMPONENT'] }).map(c => ({
  name: c.name, type: c.type,
  width: Math.round(c.width), height: Math.round(c.height),
  description: c.description || '',
  children: c.children.map(ch => ({
    name: ch.name, type: ch.type, isMask: ch.isMask === true, ...firstFill(ch), ...firstStroke(ch),
    dashPattern: dashOf(ch), ...vectorGeometry(ch)
  }))
}))
return JSON.stringify({ page: PAGE, type: TYPE, components })
```

Write that JSON to a file, then:

```bash
# lint just the asset you are shipping
node .claude/skills/publish-ds-icon-logo/scripts/lint-page.mjs --in /tmp/page.json --only <name>

# or lint the whole page (also detects name collisions, which --only cannot)
node .claude/skills/publish-ds-icon-logo/scripts/lint-page.mjs --in /tmp/page.json --quiet
```

Two checks come from geometry in that dump: an **error** for a closed shape with fill + stroke
whose fill region skips an edge (it exports with an open stroke; fix by setting the fill region to
cover every segment), and a **warning** for any dashed stroke (the export drops `stroke-dasharray`).
Open fill + stroke geometry is deliberate on 18 shipped icons and is not flagged.

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

## Step 4M — Export via the official Figma MCP

```
download_assets  fileKey: NYeN8I4D3anR9it8ds0lyr  nodeId: <component node id>  defaultFormat: svg
get_screenshot   fileKey: NYeN8I4D3anR9it8ds0lyr  nodeId: <component node id>  maxDimension: 512
```

Use the `export` URL (the whole 16x16 / 22x22 frame), **not** `svgAssets`, which are cropped to the vector
bounds. Download both URLs with `curl` (short-lived, treat as secrets). Save the SVG verbatim to
`/tmp/<name>.svg` and the PNG to `/tmp/<name>.png` for the PR and ticket.

The export carries the component's own orange background `<rect>`, which committed assets do not.
`--mcp` strips it (only a first-child rect the same size as the root, with no rounded corners).

```bash
cd packages/ui
# mandatory once per session: any shipped asset as the fixture
node ../../.claude/skills/publish-ds-icon-logo/scripts/parity-check.mjs --mcp --type icon --name <fixture> --raw /tmp/fixture.svg
# then the real asset
node ../../.claude/skills/publish-ds-icon-logo/scripts/add-asset.mjs --mcp \
  --type icon --name <name> --raw /tmp/<name>.svg
# logos: --type logo --hex '#RRGGBB' (the brand hex from the component description)
```

If parity fails, stop and switch to Route A or B.

## Step 4A — Export via the bridge

### First, run the parity check. Mandatory before the first asset in any session.

This is what makes Route A trustworthy. It covers **both halves** of the replica:

| Half | What it does | Fixture needed |
|---|---|---|
| **SVG pipelines** | Re-derives an already-committed asset from a fresh Figma export and asserts byte-identity. Proves the replica matches `scripts/{icons,logos}.js` *and* that `exportAsync` matches the Figma REST API. | Yes — an export |
| **Name-map templates + sort** | Re-renders each committed map from its own filename list and asserts byte-identity. Proves the LiquidJS templates, the `localeCompare` sort and the import-line format still match. | No |

The map half matters independently: a template or sort change upstream would sail past the SVG
check, `add-asset.mjs` would insert at the wrong position or format, and the next full regen would
reorder every entry in the map. It runs automatically on every `parity-check.mjs` invocation, and
standalone — no Figma needed, so it costs nothing to run first:

```bash
cd packages/ui
node ../../.claude/skills/publish-ds-icon-logo/scripts/parity-check.mjs --maps

# then list committed assets to pick an SVG fixture
node ../../.claude/skills/publish-ds-icon-logo/scripts/parity-check.mjs --committed --type icon
```

Both export pages are permanent catalogues, so **any shipped asset works as a fixture** — no need to
cross-reference what is still on the page.

Export the fixture (same settings as the real export, below), then:

```bash
node ../../.claude/skills/publish-ds-icon-logo/scripts/parity-check.mjs \
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

### Verify the stroke survived the export

**`add-asset.mjs` now enforces this automatically** when you pass `--figma-dump` (below) — it is the
authoritative check that a stroke was not silently baked into a filled outline, and it beats
inspecting Figma properties. Pass the same page JSON you linted in Step 2 and the script applies the
rule and hard-stops on a violation; the logic it runs is:

```
IF the Figma component has any child with strokes
AND the exported SVG contains no `stroke=` attribute
THEN the stroke was outlined into a fill — STOP.
```

An outlined stroke renders correctly at 16px but ignores the `stroke-width` set by the
`cn-icon-*` size classes, so it will not thin out at `md`/`lg`/`xl` like its siblings. Fix by
setting the vector's cap and join uniformly to ROUND in Figma, then re-export and re-check.

Do **not** decide this from `strokeCap`/`strokeJoin` alone — `MIXED` there does not reliably mean
outlined. Measured on two real icons:

| Icon | cap | join | Exported as |
|---|---|---|---|
| `.ai-evals` (before fix) | MIXED | MIXED | ❌ filled outline |
| `.ai-verify` (shipped, correct) | MIXED | ROUND | ✅ stroke preserved |

`.ai-verify` is a legitimate mixed fill+stroke icon, so the linter only *warns* on MIXED. The
export is what settles it.

A genuinely solid/filled icon has no strokes in Figma at all, so the condition above never fires
for one — which is why it is phrased around the Figma component having strokes.

Write the returned `svg` verbatim to a temp file (e.g. `/tmp/<name>.svg`) — do not reformat or
pretty-print it — then:

```bash
cd packages/ui
node ../../.claude/skills/publish-ds-icon-logo/scripts/add-asset.mjs \
  --type icon --name <name> --raw /tmp/<name>.svg --figma-dump /tmp/page.json

# logos (writes both logo and symbol SVGs and updates both maps):
node ../../.claude/skills/publish-ds-icon-logo/scripts/add-asset.mjs \
  --type logo --name <name> --hex '#1F6FEB' --raw /tmp/<name>.svg
```

`--figma-dump` is the page JSON you linted in Step 2; passing it runs the stroke-survival check
above automatically. Without it the script still works but skips that check with a warning, since an
outlined stroke cannot be detected without the Figma side.

The script writes the processed SVG(s), inserts the import and map entry at the exact position a
future full regen would place them, and prints the precise paths to stage. It also hard-stops if the
processed output is missing `currentColor` or carries a width/height on its root `<svg>` (which would
defeat the size classes).

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
node ../../.claude/skills/publish-ds-icon-logo/scripts/check-regressions.mjs --expect <name>
```

`--expect <name>` declares the one asset you intend to add, so any *other* new entry is reported as
an error rather than slipping through. Add `--ref origin/main` to check a whole branch instead of
uncommitted work.

Then typecheck. Instead of running `pnpm typecheck` by hand and eyeballing the result, use the
wrapper — it runs the typecheck and, **only if it fails**, proves whether the failure is yours:

```bash
cd packages/ui
node ../../.claude/skills/publish-ds-icon-logo/scripts/check-typecheck.mjs --type icon   # or logo
cd <worktree root> && git status --short && git diff --stat
```

In a fresh worktree `tsc -b` almost certainly fails on unbuilt sibling packages, which has nothing to
do with your asset. `check-typecheck.mjs` stashes just your asset paths, re-runs against pristine
`main`, and diffs the actual `error TS…` signatures: it exits 0 if every failure is pre-existing
(report those; do not fix them inside an asset PR), and exits 1 listing only the errors your change
actually introduced. It restores your change from the stash on the way out, and refuses to pop a
stash that is not the one it pushed.

**Never pipe a command whose exit code matters.** `pnpm typecheck | tail` reports `tail`'s exit
status, so a failing typecheck looks like a pass. The wrapper reads the exit code for you; if you do
run `pnpm typecheck` directly, redirect to a file and read `$?` instead:
`pnpm typecheck > /tmp/tc.log 2>&1; echo $?`.

Expected, and nothing else:

| Asset | Files |
|---|---|
| Icon | `icons/<name>.svg` + `icon-name-map.ts` |
| Logo | `logos/<name>.svg`, `symbols/<name>.svg` + `logo-name-map.ts`, `symbol-name-map.ts` |

Step 6 also adds `packages/ui/package.json` (the version bump), so expect that one extra file in the
final commit.

Each map should be a net +2 lines. A net +3/−1 is also correct when the asset sorts last — the
previously-final entry gains a trailing comma. Anything beyond that needs explaining before you
commit.

Content sanity is now mostly enforced by `add-asset.mjs`, which hard-stops if an icon or symbol is
missing `currentColor`, a logo is missing its brand hex, or any processed output carries a
`width=`/`height=` on its root `<svg>`. The one check it **cannot** do reliably is a symbol's
**background rect**: SVGO rewrites the rect into a full-frame `<path>` and themifies it to
`currentColor`, so there is no dependable string signal — eyeball the symbol to confirm it is the
mark alone on a transparent field, with no solid block behind the glyph.

`add-asset.mjs` also warns if a processed SVG exceeds **5 KB**. No icon currently ships above 2.6 KB,
so a flagged icon is a genuine outlier — a too-complex glyph that should be simplified, or a
candidate for an optimised PNG (there is no PNG pipeline yet, so raise it with a human). A few
intricate brand marks legitimately run larger, so for logos this is advisory, not a blocker.

## Fixing an EXISTING icon

Use this when a shipped icon is wrong (for example an open stroke or a lost dasharray) and the
fix is already made in the main Figma file. Use **Route A (bridge)** with `add-asset.mjs --force`:

1. Export **only that icon** with `exportAsync`. Never run a full export.
2. Re-run it through `add-asset.mjs --force` so only that SVG is replaced:
   `node ../../.claude/skills/publish-ds-icon-logo/scripts/add-asset.mjs ... --force`
3. Confirm with `git status` that exactly one SVG changed, then run
   `node ../../.claude/skills/publish-ds-icon-logo/scripts/check-regressions.mjs --expect <name>`.

Do not use the old `pnpm update:icons` route for this. It overwrote every icon, so one fix could
silently rewrite hundreds of unrelated files, which is why it is not a good path.

## Step 6 — Commit

Bump the `@harnessio/ui` **minor** version first. Every asset PR ships a new package version, and the
script computes it from `origin/main` rather than the working tree, so re-running it is safe and a
rebase onto a newer `main` just needs one more run:

```bash
node .claude/skills/publish-ds-icon-logo/scripts/bump-ui-version.mjs   # e.g. 1.7.1 -> 1.8.0
```

If it cannot read `origin/main`, run `git fetch origin` (VPN required). Do this automatically; do not
ask the user whether to bump.

Stage by explicit path. Never `git add .`, so `.env` cannot slip in.

```bash
git add <the exact paths add-asset.mjs printed> packages/ui/package.json
git commit -m "feat: [<TICKET-KEY>]: Add <name> <icon|logo>"
```

The ticket key is required by CI. If the ticket does not exist yet, this is the moment to stop —
go to the checkpoint, get the ticket created, then commit.

## ⛔ CHECKPOINT — get approval before anything leaves the machine

**Draft the ticket and PR with `prepare-submission.mjs` rather than by hand** — it validates the
title against the accepted types and project rules (the ones `messageCheck` enforces), lays out the
Jira pre-flight including the two-step summary and `FF Added = No`, and assembles the PR body from
the `git diff --stat`, Figma source and preview. It never creates or
opens anything; that stays behind the approval below and goes through the Harness MCP.

```bash
node .claude/skills/publish-ds-icon-logo/scripts/prepare-submission.mjs \
  --type feat --ticket <KEY|PENDING> --desc "Add <name> <icon|logo>" \
  --asset-type <icon|logo> --name <name> \
  --figma-file-key <key> --figma-file-name "<file>" --figma-link "<component url>" \
  --screenshot /tmp/<name>.png --approver "<name>" --jira-link "<url>" --assignee <real account id>
# logos add --hex '#RRGGBB'
```

Exit 1 means the draft would be rejected downstream — fix it before presenting. Then present to the
user, and wait:

1. `git diff --stat` plus the full map diff.
2. The rendered asset: the `get_screenshot` PNG from Step 4M (or `figma_capture_screenshot` on the
   bridge route). Attach it to the Jira ticket and the PR.
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

   **Always record the Figma source**: the file name and key (the main file), so a reviewer can trace
   the asset back. There is no merge gate: the Figma branch was merged before this skill ran.

   **Who does what:** an admin merges the Figma branch (after linting it); a canary code reviewer approves
   the PR; the **PR author** (usually the designer) merges it.

   **Do not add reviewers or post chaser comments.** Canary automatically adds the design lead as a
   PR reviewer, and chasing that review is the author's job, not the skill's. Adding reviewers
   programmatically would duplicate repo configuration and create noise.

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
  wrong — do not do it.** Verified against the live file (at the time of writing): every mapped icon is still on the
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
| `scripts/check-typecheck.mjs` | Run typecheck and prove any failure is pre-existing, not yours |
| `scripts/bump-ui-version.mjs` | Minor-bump `@harnessio/ui` relative to `origin/main` (idempotent) |
| `scripts/prepare-submission.mjs` | Draft + validate the Jira ticket and PR title/body (never submits) |
| `references/figma-spec.md` | Figma component spec and naming rules to verify before export |
| `references/troubleshooting.md` | CI, Jira, export and merge-conflict failure modes |
