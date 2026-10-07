# Figma component spec and naming rules

Verify every box before exporting. A malformed component is the single most common cause of a
rejected or broken export, and catching it here costs minutes instead of a PR round-trip.

Figma file (HDS Icons 3.0, holds both icons and logos): `NYeN8I4D3anR9it8ds0lyr`

**Always work on a Figma branch**, never the main DS file. The main file is deliberately protected.

**You can export from the branch — but the Figma branch must be merged before the canary PR
merges.** The ordering that works:

```
Figma branch → build → design approval → run the skill FROM THE BRANCH
  → Jira + PR → review → merge the Figma branch → merge the canary PR
```

Running the skill from the branch is deliberate: the linter catches masks, mixed stroke caps, an
empty description hex and invisible marks, and you want those fixed **on the branch**, not on main
after the fact.

The gate is the other end. The name maps are regenerated from **main's** export page, so if the
canary PR merges while the component exists only on a branch, the asset is in code but absent from
main — and the next full regen drops it from the map and breaks every consumer. The skill adds an
unticked checklist item to the PR for exactly this.

Three caveats:
- **Designers can edit branches but cannot merge them.** Only a few design leads have merge rights
  on the main file, and on the Figma side the **approver is the merger** — the person who signs off
  the design is the one with admin rights to merge it. So the Figma merge is a handoff the asset
  author cannot complete themselves; name the approver in the PR gate.

  The **canary PR** is the opposite: its **author** is responsible for getting approval and for
  clicking merge. Canary auto-adds the design lead as a reviewer, so chasing that review is a human
  task, not something the skill should automate.
- **The fallback PAT route cannot see a branch at all.** It reads the main file by ID, so on that
  route the Figma branch genuinely must be merged first.
- **Branching requires edit access.** A view-only user cannot create a Figma branch, and Figma also
  restricts plugins in view-only files — so a view-only user cannot use the bridge route either.
  Their path is the PAT route, which needs only read access.

The Figma branch is unrelated to the git branch and need not share its name.

---

## Icons

Page `icons-to-dev` is the only page the icon export reads. It is the **permanent catalogue** of
every shipped icon — **never delete a shipped component from it.** The map is regenerated from
whatever is on the page, so removing a component drops it from the map and breaks every consumer.

> Older documentation (including `icon-playbook-02-figma-structure.md`) says the page "only holds
> new/pending icons — icons already shipped to code are removed from it once merged." **That is
> incorrect.** Verified against the live file: 535 components on the page, 534 entries in the map,
> **zero** mapped icons missing from the page, and exactly one component not yet in the map (the
> icon awaiting publish). It behaves identically to `brands-to-dev`.

The designer-facing page `💠 all icons` is never read by the export.

| Requirement | Value |
|---|---|
| Node type | `COMPONENT` — not a frame, group, or bare vector |
| Size | 16×16 (`sm`) |
| Masks | Removed — `isMask = false`, raw vector kept in the master component |
| Layers | One coherent glyph: a single stroke path, or a small set of filled paths for a solid icon |
| Colour | `#000000` stroke (or fill, for solid icons) — the export converts it to `currentColor` |
| Name | Dot-prefixed kebab-case, e.g. `.agent-dlc` |

Stroke width is controlled in code, not baked into the component.

### Design language

- Icons are **single, flattened, stroke-based glyphs** read in one pass — not nested or layered
  compositions, and not multiple stacked shapes.
- Combining two existing icons means extracting only the sub-path you need and **boolean-union**ing
  it onto the base. The result must be one flattened path, not two overlaid icons.
- Solid variants are drawn as filled paths rather than strokes. That is an established pattern, not
  a deviation — the stroke rule describes the outline family. The "single flattened glyph" rule
  still applies as strictly.
- Content sits within a consistent inset area, roughly a 12–13px content box inside the 16px frame.
  An icon that fills the frame edge-to-edge reads heavier than its siblings even at identical
  stroke width. Measure against 2–3 neighbours.

### Multi-size sets

Only relevant if the icon also needs a full `xs`/`sm`/`md`/`lg`/`xl` set on `💠 all icons`. Bind each
variant's width, height and stroke-weight to the **same shared tokens** a neighbouring shipped icon
uses — do not invent tokens and do not type raw pixel values. A set built with unbound values looks
right today and silently drifts the next time the shared tokens change.

Smaller sizes use thicker strokes. Dark theme uses thinner strokes at `md`/`lg`/`xl` to compensate
for halation.

---

## Logos

Page `brands-to-dev` is the only page the logo export reads, and unlike `icons-to-dev` it is the
**permanent catalog** of every shipped logo. Never remove a shipped component from it — the next
export would drop that logo. Never rename a shipped component — that breaks every consumer.

Two sections: **Brands** (third-party brands and security/STO scanner tools) and **Platform**
(internal Harness marks).

| Requirement | Value |
|---|---|
| Node type | `COMPONENT` |
| Size | 22×22 |
| Masks | None. simpleicons.org SVGs are a single path with no mask — re-import if yours has one |
| Layers | Exactly one child, a single vector |
| Fill | Bound to a **variable** (`pure/white`, or the near-black one `.connector` uses) — not a raw hex |
| Name | Dot-prefixed kebab-case, e.g. `.acme-cloud` |
| **Description** | The brand hex as plain text, e.g. `#1F6FEB` — no variable, no extra spaces |

The description field is load-bearing: the export reads it to build the background rect. If it is
empty the script still emits an SVG, but with no background and no border, and `LogoV2` renders as a
broken-looking blank.

Put the raw mark in at full size — it should touch or nearly touch the frame edges like its
neighbours. **Do not pre-shrink it**; the export scales the mark to 70% and centres it.

### Sourcing the mark

Use the official mark. Never redraw a third-party mark from memory or generate one with AI.

1. [simpleicons.org](https://simpleicons.org) — gives both the SVG and the brand hex.
2. Failing that, the brand's own guidelines or press kit.
3. Compare against the brand's live website. Do not ship a retired mark.
4. Use the glyph, not a wordmark, unless the brand only has a wordmark. It must stay legible at 20px.

Platform marks are drawn by Harness, so those can be sketched and iterated.

### Gradient and multi-colour marks — always need hand intervention

**A gradient fill can never be exported as-is.** HDS marks are single-colour by construction: one
flat mark on a brand-hex background, and a `currentColor` version for the symbol. Plenty of modern
brands ship only a gradient mark, so this comes up regularly — and the export will *not* stop you.

Measured behaviour of the pipelines, so you know exactly what goes wrong:

| Pipeline | What happens to `fill="url(#g)"` | Consequence |
|---|---|---|
| Logo | **Preserved verbatim**, gradient def and all | Ships **silently**. A gradient mark sits among ~180 flat ones, visibly wrong, with no error anywhere |
| Symbol | Rewritten to `currentColor` | Every sub-shape becomes the same colour. Anything that relied on **colour** for separation merges into its neighbour and the mark can become an unreadable silhouette |
| Icon | Rewritten to `currentColor` | Same collapse |

Both forms also leave an **orphaned `<linearGradient>` def** in the output — dead bytes nothing
references.

There are currently **zero** gradient fills across all committed logos, symbols and icons. That is
the convention holding, and it should stay that way.

`lint-page.mjs` fails with an error on any non-`SOLID` fill, so this is caught before export rather
than discovered in review.

#### What to do instead, in order

1. **Check [simpleicons.org](https://simpleicons.org) first.** Its marks are already a single path
   in a single colour — exactly the shape HDS needs. This resolves most cases outright, and it also
   gives you the brand hex for the component description.
2. **If the brand isn't there, go to the company's own website** and find their brand guidelines,
   brand assets, or press-kit page. Look specifically for a **monochrome / one-colour / "mono"**
   version of the mark — most brands with a gradient logo publish one precisely for small and
   single-colour contexts. Use that, and honour any stated rules about how the mono mark may be
   used.
3. **If both fail, redraw the vector by hand** as a single flattened path, matching the gradient
   mark's silhouette. Keep the shape readable at 20px and check its weight against 2–3 sibling
   logos. Flatten to one path before you finish — do not leave the colour-separated sub-shapes that
   the original gradient artwork relied on, because the symbol pipeline will merge them.

For the background hex, a gradient brand has no single colour. Pick the dominant or primary stop
from the brand guidelines rather than averaging the gradient, and get it signed off in review along
with the mark.

### Colours

Background is the brand hex, copied exactly. Mark is white on a dark background, near-black on a
light one. Platform logos use background `#F6F6F7` and mark `#08090D`.

Reject the logo if the mark disappears into its background, looks tiny after the 70% scale, or loses
detail at 20px. Logos render at 20, 24, 32 and 44px — check it at those sizes on both light and dark
surfaces.

### Designer page (optional, does not affect shipping)

`⭐ brand logos` is browse-only for designers; the export never reads it. If you add sets there,
duplicate a shipped one (`logo / default / github`) rather than building from scratch, keep the `bg`
and mark layer names exactly, swap the mark instance, and leave every size-variant binding alone.
Brands and security tools get both a `default` and a `symbol` set; platform logos get one set and no
symbol set.

---

## Naming

One name is used everywhere: the Figma component (dot-prefixed), the SVG filename(s), the PascalCase
import, the map key, and the `name` prop in code. **A name cannot change after it ships** — renaming
is a breaking change for every consumer.

The dot prefix is a Figma-only marker meaning "export-ready". It is stripped by the pipeline and
never appears in the filename, the map key, or code.

### Rules the scripts enforce

Lowercase letters, digits and single dashes only, and no leading digit. A dot in the name (`node.js`)
or a leading digit (`1password`) produces an invalid TypeScript import identifier and typecheck
fails — use `nodejs`, `onepassword`.

### Rules only a human can judge

**Icons: noun-first.** The core subject comes first, the modifier after.

- Good: `pipeline-step`, `pipeline-chained`, `prompt-repository`, `agent-dlc`, `skills`
- Bad: `chained-pipeline` (modifier first), `repository-prompt` (wrong noun order)

Icon variant suffixes, when extending an existing family — match the family prefix
character-for-character (`agent-dlc-cycle`, never `agentdlc-cycle`):

| Pattern | Example | Meaning |
|---|---|---|
| `<family>-<subtype>` | `agent-dlc-cycle-arrow` | Distinct concepts in one visual family |
| `<name>-solid` | `check-circle-solid` | Filled counterpart of an existing outline icon |
| `<name>-badge[-<modifier>]` | `agent-dlc-infinity-badge-mini` | Badge-context adaptation |

Use a suffix only for a genuine *variant* of an existing concept — same subject, different rendering.
A different concept gets its own noun-first name, even if visually related.

**Logos: the brand or product name**, lowercase with dashes. `github`, `aws-ec2`, `github-copilot`,
and `<product>-<action>` for platform marks (`sql-rollback`). No `logo-` prefix. **No `-solid`,
`-badge` or `-outline` suffixes** — those are icon conventions.

Extending a brand family copies the prefix exactly: `aws-lambda`, not `awslambda` or
`amazon-lambda`. Use `<brand>-<product>` only when the mark really is that brand's product; a
different company gets its own name.

### Collisions

Both export scripts rebuild their maps from the whole export page, so a duplicate name is a **silent
overwrite, not an error**. Two Figma names that sanitize to the same text (`.Acme-Cloud` and
`.acme-cloud`) overwrite each other too.

```bash
grep -n "<name>" packages/ui/src/components/icon-v2/icon-name-map.ts
grep -n "<name>" packages/ui/src/components/logo-v2/logo-name-map.ts
grep -n "<name>" packages/ui/src/components/logo-v2/symbol-name-map.ts
```

All must print nothing. Also search the name on the Figma export page — someone else may be
mid-publishing it.

Note that the repo carries SVGs on disk that are **absent from the maps** — orphans left when an
asset was removed from the export page but its file was never deleted. So a file existing does not
by itself mean the asset shipped. Check the map, which is the real source of truth for what consumers
can use.
