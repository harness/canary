# Canary Design-System MCP Implementation Plan

> **For agentic workers:** Implement phase by phase. Phase 0 is the vertical slice and does not require new component contracts. Later phases add coverage and distribution. Steps use checkbox (`- [ ]`) syntax for tracking. CI goldens and human Cursor smoke are separate gates — do not treat one as the other.
>
> **Revised 24 Aug 2026** after two independent audits (product/architecture vs delivery/CI) and a third-agent judgment. Architecture from the original plan; catalog semantics and Phase 0 product from Auditor A; gitignore, stacking, and merge gates from Auditor B.

**Goal:** Give coding agents a local MCP process that resolves intent to Canary package names, import paths, examples, icons, and tokens — so they stop generating shadcn, Lucide, and raw HTML — without waiting for a contract on every export.

**Architecture:** Component contracts remain the canonical source of truth. A new compiler emits a prompt-sized **agent catalog**. The MCP server is a Node stdio process that reads that catalog and exposes tools. Unreviewed components fall back to inventory + Portal MDX + TypeScript exports, marked `fallback` or `unreviewed`. Canary Copilot stays the Figma consumer; this server is the agent consumer of the same contracts. Do not author a second source of truth.

**Tech Stack:** Node.js ESM, TypeScript, Zod 4, `@modelcontextprotocol/sdk` `^1` (stdio, pin the major), Vitest, pnpm, `fuzzysort` as a direct MCP dependency. No React runtime in the MCP package (same exception as `@harnessio/figma-plugin`). No `workspace:*` dependency on `@harnessio/ui`.

**Contracts spec:** `docs/superpowers/specs/2026-08-14-generation-ready-component-contracts-design.md`.

---

## How it runs

The MCP “server” is a **local child process**, not a hosted service, in Phases 0–2.

```
Cursor / Claude Code (MCP client)
        │  JSON-RPC over stdin/stdout
        ▼
node packages/design-system-mcp/bin/canary-mcp.js
        │  compile-if-missing (tsc + agent catalog), then stdio
        ▼
packages/ui/catalog/generated/agent/*    (gitignored, generated)
```

When the IDE opens this repo, `.cursor/mcp.json` starts `bin/canary-mcp.js` with `cwd` at the repo root. The bin compiles `dist/` if it is missing (root `.gitignore` ignores `dist/`) and compiles the agent catalog if `packages/ui/catalog/generated/agent/` is missing, then loads JSON into memory. Tool calls are answered from that in-memory catalog. Quitting the IDE kills the process. Nothing is deployed.

Do **not** point Cursor at `node dist/index.js` as the only entry: a fresh clone has no `dist/`. Do **not** use `pnpm --filter … exec` as the MCP command (known flake).

For `platformUI` and other consumers that do not clone Canary, Phase 3 publishes `@harnessio/design-system-mcp` with the catalog copied into the npm package, still started via `npx` stdio. A hosted HTTP endpoint is optional and last — not a Phase 0–2 gate.

A Cursor **skill** is separate: markdown that tells the agent *when* to call these tools. The MCP process *is* the tools.

---

## Global constraints

- Contracts are not a gate. Phase 0 ships on Button (stable) plus fallbacks from inventory, Portal, and IconV2.
- Do not copy component source into consumer apps. Canary is `import { Button } from "@harnessio/ui/components"`.
- Do not dump raw `button.contract.json` (~1,200 lines) into tool results. Return a budgeted agent view.
- Do not generate or overwrite production React or published Figma artifacts.
- Do not author a second catalog by hand. Compiler output is generated. The full agent JSON is **gitignored** (like `packages/figma-plugin/catalogs/`). Freshness is “two compiles are byte-identical,” not a committed blob and not a `generatedAt` clock.
- Mark every component result with `confidence`: `stable` | `fallback` | `unreviewed`. Never crash, never fake `stable`, when `contractPath` points at a missing file.
- `validate_props` is only authoritative when constraints exist. Otherwise return `unknown` and point at TypeScript. Do **not** copy Copilot’s “no constraints → `supported`.”
- Before matching Button (and any later exhaustive contract), fill omitted dimensions from documented contract defaults (`size: "md"`, `variant: "primary"`, `theme: "default"`, `rounded: false`, `iconOnly: false`). Then evaluate. Still-missing dimensions → `invalid`.
- Icon API is `<IconV2 name="plus" />`, never Lucide, never the contract’s stale `icon=` example.
- Payload budgets: search hit ≤ 400 tokens, `get_component` ≤ 1,500 tokens, examples one snippet at a time via `get_example` only.
- `get_component` must not include example source. `get_example` is the only code channel.
- React 17 does not apply to this package (Node process, no UI). Document that exception in `AGENTS.md` / `CLAUDE.md`.

---

## Immediate value vs contract-gated value

| Job | Phase 0 (no new contracts) | Needs a contract |
| --- | --- | --- |
| Stop shadcn / Lucide | Yes | No |
| Correct Dialog / TextInput composition | Yes (Portal `ComponentExample` + aliases) | Only for illegal variants |
| Useful inside `platformUI` | Yes, once the package is published or path-linked | No |
| Button vs Link, rounded text, AI+danger | Partial (Button Portal + Button contract + aliases) | Yes for `validate_props` on non-Button families |
| Copilot Figma check / health scores | No (already a different product) | Yes |
| Generate new primitives | Out of scope | Out of scope |

Write new contracts where agents get rules wrong. Do not block the server on 74 contracts. Track B is parallel and is **not** part of MCP Phase 0 done-when.

---

## Data model — agent catalog

Compiled, not authored. Three generated files under `packages/ui/catalog/generated/agent/` (**gitignored**; see File map).

### `components.json`

One record per *searchable* inventory export (exclude type/enum/map/context noise — see Search ranking).

```ts
type AgentConfidence = 'stable' | 'fallback' | 'unreviewed'

type AgentComponent = {
  id: string                    // canary.button
  exportName: string            // Button
  import: string                // import { Button } from "@harnessio/ui/components"
  package: '@harnessio/ui'
  family: string
  category?: string             // actions | form | overlays | … from Portal path
  aliases: string[]
  members?: string[]            // compound: ["Root", "Trigger", "Content", …]
  summary: string
  confidence: AgentConfidence
  useWhen: string[]
  avoidWhen: string[]
  related: string[]
  props: Array<{
    name: string
    type: string
    values?: string[]
    default?: string | boolean | number
    description?: string
  }>
  do: string[]
  dont: string[]
  examples: Array<{
    id: string
    name: string
    purpose: string
    recommended?: boolean
    // no `code` here — get_example is the only code channel
  }>
  constraints?: {
    exhaustive: boolean
    dimensions: string[]
    // combinations live in the catalog file for validate_props,
    // but get_component strips them and sets hasConstraints
  }
  migrations?: Array<{ id: string; instructions: string }>
  sourcePath: string
  portalPath?: string
  contractVersion?: string
}
```

Each generated file’s envelope (not a clock):

```ts
type AgentCatalogFile<T> = {
  formatVersion: number           // start at 1
  sourceInventoryCount: number
  sourceSha256: string            // hash of compiler inputs, not Date.now()
  records: T[]
}
```

Two compiles of the same tree must produce byte-identical JSON (pretty-printed with trailing newline, same helper style as `packages/ui/scripts/component-contract-artifacts.mjs` `json()`). No `generatedAt`.

**Fill rules**

- `stable`: a contract **file exists** and lifecycle is `stable` or `piloting`. Semantics, props, example metadata, constraints, do/don't come from the contract. React `import` from `surfaces.react.import`. Rewrite stale `IconV2 icon=` in any stored example source to `name=`.
- `fallback`: no usable contract file, but `portalDoc` exists on disk. Summary and example metadata come from MDX (frontmatter `title`/`description` + `DocsPage.ComponentExample` `code` props, then fenced `tsx` / `typescript jsx` / `typescript` blocks). Props stay thin (export name + “see TypeScript”) unless a later extractor is added. Compound `members` harvested from Portal examples (`Dialog.Root`) and/or `export const Dialog = { Root, … }`.
- `unreviewed`: inventory only. Summary is the export name and family. **No invented do/don't.**

**Missing `contractPath` (normative):** inventory currently names **12** `disposition: "contract"` rows whose files do not exist (`drawer.contract.json`, `select.contract.json`, `text-input.contract.json`, `status-badge.contract.json`, and others). Only `packages/ui/catalog/contracts/button.contract.json` exists; Button itself is `status: "mapped"`, not classified. The compiler **must not throw**. Classify as `fallback` if `portalDoc` exists on disk, else `unreviewed`. Never emit `stable` without a readable contract file. **Test Drawer** as the missing-file fallback (classified, `contractPath` missing, Portal MDX with `Drawer.Root` `ComponentExample`).

**IconV2 portal mapping:** inventory `canary.icon-v2` has no `portalDoc`. Compiler special-cases it to `apps/portal/src/content/docs/components/visual/icon.mdx` (ComponentExample: `<IconV2 name="check" size="lg" />`). Do not invent do/don't. `icons.json` still comes from `IconNameMapV2` keys. Foundations glyph page (`foundations/icons.mdx`) is A4 `get_guidelines` material, not the IconV2 component row.

**MDX extraction (normative):** parse `DocsPage.ComponentExample` `code={`...`}` props **first**, then fenced `tsx` / `typescript jsx` / `typescript` blocks. Button Portal is ComponentExample-first (fences exist later as Usage). Dialog has both a ComponentExample (`Dialog.Root` + `TextInput`) and later fences. Drawer is ComponentExample-only with `Drawer.Root`. Skip import lines that reference `@/components`. Cap example code at ~40 lines.

**Alias seed (checked-in, tiny, authored):** `packages/ui/catalog/agent-aliases.json` (or inlined map in the compiler). Minimum:

| Query tokens | Target `exportName` |
| --- | --- |
| modal, dialog overlay | Dialog |
| form field, text field, input | TextInput |
| navigate, navigation, link to | Link |
| dropdown, select menu | Select |
| drawer, slide-over, side panel | Drawer |

Aliases attach to the target `AgentComponent.aliases`. They are not a second catalog.

### `icons.json`

One record per `IconNameMapV2` key.

```ts
type AgentIcon = {
  name: string                  // trash
  import: 'import { IconV2 } from "@harnessio/ui/components"'
  usage: '<IconV2 name="trash" />'
  synonyms: string[]            // seeded allowlist + filename tokens (trash → delete is explicit)
}
```

### `foundations.json`

Short pages compiled from Portal foundations + growth patterns + token registry ids. **A1 may ship a thin stub** (installation one-pager + schema). Full pages are A4.

```ts
type AgentFoundation = {
  id: string                    // color | typography | spacing | theming | icons | dual-pane-stepper | installation
  title: string
  summary: string
  rules: string[]               // 5–12 bullets, not the full MDX
  examples?: string[]
}
```

---

## Protocol surface

Tools, not a kitchen sink. Each tool returns JSON. Errors are structured `{ error, hint }`.

### Phase 0 (PR A2) — five tools

| Tool | Input | Output |
| --- | --- | --- |
| `search_components` | `query: string`, optional `limit` (default 8) | Ranked `{ id, exportName, summary, confidence, score, why }` |
| `get_component` | `id` or `exportName` | `AgentComponent` **without** example `code` and **without** `constraints.combinations`. Include `hasConstraints`, `members`, and example ids/names/purposes only. Tell the agent to call `validate_props` / `get_example`. |
| `get_example` | `id`, optional `exampleId` | One snippet. Default = first `recommended` / first Portal `ComponentExample`. **Only code channel.** |
| `validate_props` | `id`, `props: Record<string, unknown>` | `{ status: supported \| deprecated \| unsupported \| unknown \| invalid, ruleId?, message, migration? }` |
| `search_icons` | `query: string`, optional `limit` | `{ name, usage, synonyms }` |

### Phase 1 (PR A4) — two more tools

| Tool | Input | Output |
| --- | --- | --- |
| `get_tokens` | optional `query` or `componentId` | Semantic token ids + one-line description from `token-registry.json` and a short `cn-` usage note |
| `get_guidelines` | `id` (foundation/pattern) | The `AgentFoundation` record |

**Resource (optional until A4, required with foundations):** `canary://inventory` — compact list of `{ id, exportName, confidence, category }` so agents can browse without searching.

**Prompt (A3 skill, not a sixth tool):** policy text in `.cursor/skills/canary-ui/SKILL.md` — call `search_components` when adding or swapping UI; never install shadcn or `lucide-react`; use `IconV2`; if `confidence` is not `stable`, still use the Canary export and do not invent a parallel component.

### Search ranking

1. **Exclude noise** from the searchable set: export names matching `/(Enum|Context|Map|Props|Type)$/`, `recommendedDisposition: "part-of-family"` without `portalDoc`, and inventory rows that are types/maps only (`IconNameMapV2`, `DiffModeEnum`, `FormWrapperContext`, …). They may still exist in the catalog file for completeness but must not outrank real components.
2. fuzzysort over `exportName`, `aliases`, `summary`, `useWhen`, `family`, `category`, `members`.
3. **Alias / exact exportName hit before confidence boost.** Otherwise `modal` ranks stable Button over fallback Dialog.
4. Then boost `stable` then `fallback` over `unreviewed`.

`fuzzysort` is already used in `@harnessio/ui` (`highlight-text.tsx`, `search-files.tsx`). Depend on `fuzzysort` **directly in the MCP package**; do not import it from `@harnessio/ui`.

### `validate_props` algorithm (MCP, not a Copilot copy)

Implement in `packages/design-system-mcp/src/validate-props.ts`. Copy only the **exactly-one-match-when-exhaustive** combination rule. Do not import Figma types. Do not extract `catalog-eval` in Phase 0.

1. Unknown id → `{ error, hint }`.
2. No `constraints` on the record → `{ status: "unknown", message, hint: "see TypeScript / get_example" }`. **Not** Copilot’s `supported`.
3. Fill omitted keys from that contract’s property defaults (Button: `variant` primary, `size` md, `theme` default, `rounded` false, `iconOnly` false). Extra unknown keys are ignored for matching.
4. After fill, if any `constraints.dimensions` entry is still `undefined` → `{ status: "invalid", message }` (cannot evaluate). This is Copilot’s missing-dimension behavior, applied only *after* defaults.
5. Filter combinations whose `conditions` all match. If `exhaustive` and match count ≠ 1 → `invalid`.
6. Return the matched rule’s `supported` | `deprecated` | `unsupported`, with migration text when present.

Button matrix dimensions in `button.contract.json` are `["variant", "size", "theme", "rounded", "iconOnly"]`. All five have defaults. A legal primary with omitted `size` must return `supported`, not `invalid`. The same map with explicit `size: "md"` must match. `variant: "primary", theme: "danger", rounded: true, iconOnly: false` (size filled to md) follows the live contract (TextRounded is deprecated). Dialog → `unknown`.

---

## File map

### New package `@harnessio/design-system-mcp`

- Create `packages/design-system-mcp/` — private, `"type": "module"`, Node ≥ 18.17.1, no React, no `workspace:*` on `@harnessio/ui`.
- Create `packages/design-system-mcp/src/index.ts` — stdio entry; load catalog; register tools; `StdioServerTransport`.
- Create `packages/design-system-mcp/src/catalog.ts` — resolve catalog path (see below); load and type the three JSON files (Zod).
- Create `packages/design-system-mcp/src/search.ts` — component and icon search.
- Create `packages/design-system-mcp/src/validate-props.ts` — constraint matcher for React prop maps.
- Create `packages/design-system-mcp/src/tools/*.ts` — one file per tool (five in A2; tokens/guidelines in A4).
- Create `packages/design-system-mcp/src/budgets.ts` — truncation helpers.
- Create `packages/design-system-mcp/bin/canary-mcp.js` — `#!/usr/bin/env node`; compile-if-missing `dist/` via `tsc`; compile-if-missing agent catalog by spawning `packages/ui` `catalog:generate` (or the agent compiler script); then `node dist/index.js`.
- Create `packages/design-system-mcp/tests/` — catalog load, search ranking, Button `validate_props` (defaults + explicit size), Drawer missing-contract fallback, payload budgets, golden queries. Tests **compile the agent catalog first** (same pattern as figma-plugin `pnpm catalogs:pack && vitest`).
- Create `packages/design-system-mcp/README.md` — how it runs, Cursor config, rebuild path, what confidence means, five manual prompts (human, not CI).
- Scripts: `build` (`tsc`), `start` (the bin), `test`, `typecheck`, `pretty` (`prettier --check ./src`) so `pnpm -r pretty` has a target. Do **not** add `lint` unless the package has an eslint config. Do **not** add `build:ci` (root `portal:build` skips missing `build:ci`).

**Catalog path resolution (in order):**

1. `CANARY_AGENT_CATALOG_DIR` if set.
2. Walk up from `cwd` / `import.meta.url` until `pnpm-workspace.yaml`, then `packages/ui/catalog/generated/agent`.
3. Workspace sibling: `../ui/catalog/generated/agent` from the MCP package root.
4. Published layout (A8): `catalog/` inside the npm package.

Missing catalog after compile-if-missing → refuse to start with a hint to run `pnpm --filter @harnessio/ui catalog:generate`. Missing individual `contractPath` files must already have been tolerated by the compiler; the server never sees them.

### Agent catalog compiler (lives next to existing catalog scripts)

- Create `packages/ui/scripts/compile-agent-catalog.mjs` — reads inventory, contracts, Portal MDX, IconNameMapV2 keys, token-registry, selected foundation MDX; writes `catalog/generated/agent/*.json`.
- Create `packages/ui/scripts/compile-agent-catalog.test.js` — Button projection; Dialog fallback with `ComponentExample` (not only fences); Drawer missing-contract fallback; icon list includes `trash`; two compiles byte-identical; `icon=` rewrite.
- Create `packages/ui/scripts/validate-agent-catalog.mjs` — **sibling**, do **not** change `validate-component-contracts.mjs`. That file’s CLI stdout is locked by `provides a successful command-line contract check` (`Validated 1 component contract: canary.button (stable)\n`).
- Modify `packages/ui/package.json`:
  - `catalog:generate` also writes the agent catalog (keep writing contract artifacts).
  - `catalog:validate` runs `node scripts/validate-component-contracts.mjs && node scripts/validate-agent-catalog.mjs`.
- Create `packages/ui/catalog/agent-aliases.json` (tiny, authored, checked in).
- Gitignore `packages/ui/catalog/generated/agent/` (root or `packages/ui/.gitignore`). Do **not** gitignore `packages/ui/catalog/generated/` wholesale — contract schema/types/reference/receipt stay checked in.
- Optional tiny `packages/ui/catalog/icon-synonyms.json` for `trash/delete/remove`, `xmark/close/clear`, `gear/settings`, `magnifying-glass/search`.

### IDE wiring (A3 only)

- Replace root `.gitignore` line `.cursor` with `.cursor/*` plus un-ignore exceptions. Un-ignoring children of an ignored parent is a no-op — **replace** the parent ignore.
- Create `.cursor/mcp.json` — `command: node`, `args: ["./packages/design-system-mcp/bin/canary-mcp.js"]`, `cwd` implied as repo root.
- Create `.cursor/skills/canary-ui/SKILL.md`.
- Modify `AGENTS.md` and `CLAUDE.md`.

### Out of scope for the file map

- New `*.contract.json` files (Track B; inventory already names Drawer, Select, StatusBadge, TextInput).
- HTTP transport, auth, Cursor marketplace listing.
- Extracting a shared `catalog-core` package (copy the matcher; extract later if Copilot and MCP need the same module).
- Live-model eval harness.
- Checking in `components.json`.

---

## Phase 0 — Prove the loop

**Done when (two gates, both required):**

1. **CI / Vitest (A1 + A2):** compiler tests green; MCP unit tests + golden queries green; stdio lists the five tools. No live LLM. No Cursor required to merge A1 or A2.
2. **Human Cursor smoke (A3):** a fresh Cursor window on this repo shows Canary MCP connected; manual “Add a Save button to a toolbar” uses Canary `Button` from `@harnessio/ui/components`. Documented in the MCP README, not asserted by Vitest.

Do not call Phase 0 complete at A2. Do not add HTTP, live-model eval, or 74 contracts as Phase 0 gates.

### Task 0.1: Agent catalog compiler

**Files:** `packages/ui/scripts/compile-agent-catalog.mjs`, test, `validate-agent-catalog.mjs`, aliases file, gitignore for `catalog/generated/agent/`

- [ ] **Step 1:** Write failing tests for Button `stable` projection, Dialog `fallback` with import + `ComponentExample` (`Dialog.Root`), Drawer missing-`contractPath` → `fallback` (does not throw, not `stable`), IconV2 `name` keys, alias `modal` → Dialog, two-compile byte identity.
- [ ] **Step 2:** Implement MDX extraction: frontmatter `title`/`description`; `DocsPage.ComponentExample` `code` props first; then fenced blocks; skip `@/components` imports; cap ~40 lines.
- [ ] **Step 3:** Implement contract projection: identity, semantics, React import, props from canonical properties + React extensions, do/don't, example metadata (`references.code` stored for `get_example`, not inlined on the search record), constraints, migrations. Rewrite `IconV2 icon=` → `name=`.
- [ ] **Step 4:** Missing contract files → fallback/unreviewed. Harvest `members` for Dialog/Drawer from examples and/or `export const X = { … }`.
- [ ] **Step 5:** Wire `catalog:generate` / `catalog:validate` via **sibling** validate script. Do not alter `validate-component-contracts.mjs` stdout. Gitignore generated agent JSON. Do not check it in.

**Acceptance:** `pnpm --filter @harnessio/ui catalog:validate` still prints the locked contract line from the existing CLI, then agent validation succeeds. Dialog and Drawer appear without contract files. Regenerating twice is byte-identical. Editing Portal Button copy changes `sourceSha256` after regenerate.

### Task 0.2: MCP package and stdio server

**Files:** `packages/design-system-mcp/**`

- [ ] **Step 1:** Scaffold package.json (private, ESM, `bin`, scripts: `build`, `start`, `test`, `typecheck`, `pretty`). Depend on `@modelcontextprotocol/sdk` `^1`, `zod` `^4`, `fuzzysort`. Dev: `typescript`, `vitest`. Pin the SDK major.
- [ ] **Step 2:** Load catalog via Zod. Path resolution as specified. Compile-if-missing in the bin. Server refuses to start if files are still missing after compile, with a hint — not a stack trace about `drawer.contract.json`.
- [ ] **Step 3:** Register the **five** tools. `validate_props` cases in Testing strategy. Dialog → `unknown`. Drawer `get_component` → `fallback`.
- [ ] **Step 4:** Enforce payload budgets in tests. `get_component` fixture must not contain example source (no `<Button` in the component payload; that string lives in `get_example`).
- [ ] **Step 5:** `pnpm --filter @harnessio/design-system-mcp start` speaks stdio (smoke: list tools via the SDK’s test client or a small script). `bin/canary-mcp.js` works when `dist/` is absent.

**Acceptance:** Unit tests cover search ranking (`modal` ranks Dialog via alias before stable-boost; `button` ranks `canary.button` first), icon query `trash` / `delete`, Button constraint cases including omitted `size`, Drawer fallback.

### Task 0.3: Cursor wiring and skill

**Files:** `.cursor/mcp.json`, `.cursor/skills/canary-ui/SKILL.md`, `AGENTS.md`, `CLAUDE.md`, package README, `.gitignore`

Replace the parent ignore (A3 — do not do this in A2):

```
#cursor
.cursor/*
!.cursor/mcp.json
!.cursor/skills/
!.cursor/skills/canary-ui/
!.cursor/skills/canary-ui/**
```

```json
{
  "mcpServers": {
    "canary": {
      "command": "node",
      "args": ["./packages/design-system-mcp/bin/canary-mcp.js"]
    }
  }
}
```

Skill policy (**cool**, not “always on every className tweak”):

- When **adding, swapping, or choosing** UI components, call `search_components` before writing JSX. Restyling existing Canary markup with classes does not require a tool call.
- Import from `@harnessio/ui/components` (and hooks/utils as needed). Never copy component source into the app.
- Icons: `IconV2` with `name` from `search_icons`. Never `lucide-react`.
- Prefer Canary `Link` for navigation, `Button` for actions (from the Button contract).
- Treat `unreviewed` / `fallback` as “use this export, don’t invent a new one,” not as permission to copy shadcn.
- If `hasConstraints` is true, call `validate_props` before committing unusual variant combinations. Call `get_example` for snippets, not `get_component`.

**Acceptance (human):** A fresh Cursor window on this repo shows a Canary MCP server as connected with five tools. Manual smoke: “Add a Save button to a toolbar” uses Canary Button. `git check-ignore -v .cursor/mcp.json` does not hide the file.

### Task 0.4: Golden queries

**Files:** `packages/design-system-mcp/tests/golden-queries.test.ts`

Fixed queries. Each asserts tool choice + required strings in the payload. No live LLM.

| Query | Must |
| --- | --- |
| `primary save button` | `search_components` → `canary.button`; `get_example` snippet contains `<Button` and import `@harnessio/ui/components`. `get_component` does **not** include that snippet. |
| `modal` | Dialog as `fallback` (alias before stable-boost); `get_example` contains `Dialog.Root`. Do **not** also require TextInput on this query. |
| `form field` | TextInput appears (alias). A1 must land aliases, so A2 expects it. |
| `delete icon` | `search_icons` → a real IconV2 `name`, usage uses `name=` |
| `navigate to settings` | search ranks `Link`; if Button is returned, `avoidWhen` mentions navigation |
| `rounded text button` | `validate_props` flags TextRounded deprecation (defaults filled so omitted `size` still hits the rule) |

**Acceptance:** `pnpm --filter @harnessio/design-system-mcp test` green. Manual Cursor note in the README for the same prompts (A3). Do not put TextInput on the `modal` golden.

---

## Phase 1 — Foundations and the named pilots

**Done when:** Tokens, IconV2, and guidelines are good enough for a settings form. Pilot contracts are **not** an MCP done-when. The MCP does not wait on those contracts to keep shipping; the contracts make `validate_props` real for those families.

### Task 1.1: Foundations index (A4)

Compile short `AgentFoundation` pages from:

- `apps/portal/src/content/docs/foundations/{colors,typography,spacings,layout,icons,variables}.mdx`
- `apps/portal/src/content/docs/design-system/{theming,color-system,usage}.mdx`
- `apps/portal/src/content/docs/getting-started/installation.mdx` (peer deps, `styles.css`, Tailwind)
- Growth patterns: `dual-pane-stepper`, `single-pane-stepper`, `apps/portal/src/content/docs/components/actions/button-layout.mdx`

Keep each page ≤ 12 bullets. Installation must state: `pnpm add @harnessio/ui`, peer React 17, import `@harnessio/ui/styles.css`. Register `get_tokens` and `get_guidelines`.

### Task 1.2: Icon synonyms (fold into A1)

Seed a small synonym map for high-confusion names (`trash`/`delete`/`remove`, `xmark`/`close`/`clear`, `gear`/`settings`, `magnifying-glass`/`search`). Do not invent a full thesaurus. Filename tokens (`arrow-left`) are already searchable.

### Task 1.3: Button constraint cases (fold into A2)

Keep logic in the MCP package. Tests:

- AI+danger unsupported
- rounded+text deprecated (omitted `size` **and** explicit `size: "md"`)
- icon-only rounded supported
- Dialog → `unknown`
- Legal primary with omitted size → `supported`

If duplication with `packages/figma-plugin/src/core/constraints.ts` becomes painful, extract a tiny `packages/catalog-eval` later — not in this task.

### Task 1.4: Pilot contracts (Track B, parallel, not MCP-blocking)

Inventory already points at missing files for Drawer, Select, StatusBadge, TextInput. Authoring follows `packages/ui/catalog/contracts/README.md`. After each contract is `stable`, the next `catalog:generate` flips `confidence` to `stable`. **No MCP code change** if Task 0.1 projection is complete. Because agent JSON is gitignored, contract PRs do **not** include `components.json`.

Agent-value order if only one author: **TextInput, Drawer, Select, StatusBadge**. **Link** (`canary.link`, high, Portal exists, no `contractPath` yet) is more useful to agents than StatusBadge — add it as B5 when free. Do not put Track B in Phase 0 done-when.

---

## Phase 2 — Screens that compile

**Done when:** An agent can assemble a typical Harness screen (list + filters + dialog + form + toasts) using Canary names, and a review prompt can flag the worst Button mistakes.

### Task 2.1: High-priority fallback quality (A5 — not a 69-row slog)

Do **not** one-shot all 69 `priority: high` inventory rows. Cap A5 at the golden-screen fallbacks that are still empty after A1: Link, TextInput, Select, Drawer, Alert, ButtonLayout, NoData (if Portal exists), IconV2 mapping. Prefer a one-line inventory summary over stub MDX. **Do not fake contracts.** Split by family only if the diff is huge; default is one small PR.

### Task 2.2: Pattern recipes (A6)

`get_guidelines` / `get_pattern` (alias) for:

- Dialog + form + `ButtonLayout` footer (already in Dialog Portal)
- Filter bar — name **`@harnessio/filters`** (`createFilters`, URL-driven, headless). Do **not** invent a Canary `FilterBar` export in `@harnessio/ui`.
- Page header + primary/secondary actions
- Empty state (`NoData`)
- Dual-pane drawer

These are markdown-compiled recipes that name existing exports. They are not new components.

### Task 2.3: Review prompt (A7)

MCP prompt `Review Canary UI`: given a diff or file, call `search_components` / `validate_props` for Button (and any other stable contracts), flag Lucide imports, flag `@/components/ui` shadcn paths, flag `<button>` when Button exists.

This is advisory. It does not fail CI in Phase 2.

### Task 2.4: Contract coverage as a product goal

Track `stable` count in catalog metadata. Do not require 74 contracts. Target for a later golden screen: Button, Link, TextInput, Select, Dialog, Drawer, IconV2, ButtonLayout, StatusBadge, Alert — **not** a Phase 0 gate.

---

## Phase 3 — Distribute

**Done when:** A `platformUI` engineer can add three lines of MCP config and get the same tools without cloning Canary.

### Task 3.1: Publish `@harnessio/design-system-mcp`

- **Copy** `catalog/generated/agent/*.json` into the npm package (`files`, e.g. `catalog/`). Generate as part of `prepublishOnly`. Gitignored workspace files will not pack themselves.
- Public or Harness-private registry; match however `@harnessio/ui` is published.
- `bin` entry so `npx @harnessio/design-system-mcp` starts stdio from **compiled** `dist/` (published tarball includes `dist` + catalog; no compile-if-missing required for npx).
- Version the catalog with the package. Stale catalog in an old npx cache is expected; document `npx` uncached refresh.

### Task 3.2: Consumer docs

README snippet for `platformUI` `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "canary": {
      "command": "npx",
      "args": ["-y", "@harnessio/design-system-mcp"]
    }
  }
}
```

Plus the skill, copied or published as a Cursor skill. Installation of `@harnessio/ui` remains the app’s job; the MCP does not run `pnpm add`.

### Task 3.3: Optional remote HTTP

Only if stdio+npx is not enough (browser agents, central auth, one pinned catalog for the company). Use Streamable HTTP from the same tool handlers. Auth is a Harness concern; do not invent it in Phase 0. **Not a Phase 0–2 gate.**

### Task 3.4: Eval harness beyond unit goldens

A checked-in prompt set run occasionally against a real model, scoring: Canary import present, no shadcn, no Lucide, Dialog compound components used. Quality gate for catalog changes, not a unit test, **not Phase 0**.

---

## Testing strategy

- **Compiler:** fixtures for Button contract, a minimal Portal MDX with `DocsPage.ComponentExample`, a truncated IconNameMap parse (or grep of keys). Assert Drawer missing file does not throw. Two `compile()` calls byte-equal. Do not snapshot a 193-row file into git.
- **Server:** in-process tool handlers, no MCP transport required for unit tests. Tests run `catalog:generate` (or the compiler) first. One integration test that boots stdio via the **bin** (not `dist/index.js` alone) and lists five tools, including when `dist/` was just produced.
- **Constraints:** table-driven cases from the Button matrix, including omitted defaults. Dialog `unknown`. Do not expect Copilot’s `supported` for missing constraints.
- **Budgets:** oversize Portal example is truncated, not dropped. `get_component` over-budget if example source leaks.
- **Validate CLI:** do not change `validate-component-contracts.mjs` stdout; the existing exact-match test stays green.
- **Manual (A3 only):** README smoke list. Browser verification does not apply; the product is a Node process.
- **CI:** this repo does not run package tests on GitHub Actions today (publish/storybook/changelog only). Do **not** add a new GHA workflow as a Phase 0 gate. Root `pnpm -r test` / `typecheck` / `pretty` pick up the package.

---

## Risks

| Risk | Mitigation |
| --- | --- |
| Agents still pick shadcn because training data is strong | Skill + MCP on by default in this repo; aliases for “modal”, “input”, “dropdown”; alias rank before stable-boost |
| Compiler looks only at fences and ships empty fallback examples | Extract `ComponentExample` `code` props first (Button/Drawer are ComponentExample-first) |
| Missing contractPath throws or fakes `stable` | Drawer test; classified-without-file → fallback/unreviewed |
| Copilot matcher copied blindly | Fill defaults; no constraints → `unknown`; tests for omitted `size` |
| `get_component` blows the budget with example source | Strip code; `get_example` only |
| Portal examples go stale vs source | `sourceSha256`; `fallback` confidence; TypeScript remains the runtime authority |
| Button contract example uses `IconV2 icon=` | Compiler rewrites to `name=`; compiler test |
| Catalog too large for context | Search returns ids only; `get_component` is opt-in; never return all 193 full records; exclude type/enum noise |
| Checked-in giant JSON rebase-wars with Portal and B1–B5 | Gitignore agent JSON; A8 copies at pack time |
| `node dist/index.js` fails on fresh clone | `bin/canary-mcp.js` compile-if-missing; `dist/` is gitignored at repo root |
| `.cursor` stay ignored despite `!` exceptions | Replace parent `.cursor` with `.cursor/*` in A3 |
| Extending validate CLI breaks exact stdout test | Sibling `validate-agent-catalog.mjs` |
| `pnpm filter exec` fails in Cursor spawn | Never use it; call the bin |
| People assume MCP requires 193 contracts | Phase 0 acceptance is Dialog- and Drawer-without-a-contract |
| Filter recipe invents a Canary component | A6 names `@harnessio/filters` |

---

## Pull request plan

Open these against **`codex/component-inventory`**, never `main`, until inventory lands. Catalog files and inventory do not exist on `main` today. Inventory PR: [canary#11305](https://harness0.harness.io/ng/account/l7B_kbSEQD2wjrM7PShm5w/module/code/orgs/PROD/projects/Harness_Commons/repos/canary/pulls/11305).

`feat/design-system-mcp` currently points at the same commit as inventory (plan-only). **Reuse it for PR A1 only.** Do **not** merge A1 into PR 11305. After 11305 hits `main`, retarget the MCP stack to `main`.

Two tracks: **MCP is stacked** for A1→A2→A3. **A4 bases on A2** (needs the MCP package) and may run **in parallel with A3**. **A5 bases on A1** (compiler/inventory only). **Pilot contracts are parallel** and must not gate A1–A3.

Do not start Phase 3 or HTTP until A3 human Cursor smoke is done, not just Vitest.

### Why these cuts

| Tempting merge | Why not |
| --- | --- |
| Compiler + MCP package in one PR | Different reviewers and failure modes. Compiler is `@harnessio/ui` catalog scripts; MCP is a new Node process. |
| Merge A3 (Cursor) into A2 | `.gitignore` / skill / `AGENTS.md` is policy, not a Node package. A2 must merge on Vitest alone. |
| Move `.cursor` into A2 | Same; keep A3 for IDE wiring. |
| Seven tools in A2 | Tokens/guidelines are A4; five tools prove the loop. |
| Check in `components.json` in A1 | Rebase-war with Portal and Track B; figma-plugin already gitignores compiled catalogs. |
| One mega-PR for Phase 0 | Too much for `packages/ui` plus a new `package.json` plus gitignore policy. |
| Contracts before MCP | Phase 0 acceptance is Dialog **and Drawer** without a contract file. |
| 69-row A5 | Empty summaries for the golden screen, not a slog. |

Fold **Task 1.2** (icon synonym seed + aliases) into A1 and **Task 1.3** (Button constraint cases) into A2.

### Reviewers (from `CODEOWNERS`)

GitHub `/packages/ui/*` does **not** match nested `packages/ui/scripts/` or `packages/ui/catalog/` (`*` does not cross `/`). List reviewers on the PR body; in A2 add explicit CODEOWNERS paths.

- **A1** (`packages/ui/scripts/*`, `packages/ui/catalog/*`): Abhinav Rastogi, Kevin Nagurski, Vardan Bansal, Pranesh G, Shaurya Kalia, Srdjan Arsic, Katie Grantier.
- **A2 `package.json` + `/packages/design-system-mcp/`:** Abhinav, Kevin, Vardan, Srdjan, Pranesh, Shaurya. Add `/packages/design-system-mcp/` to `CODEOWNERS` in A2 (same set as `packages/ui`, plus note: no React 17 constraint). Optionally add `/packages/ui/scripts/` and `/packages/ui/catalog/` so nested A1 files are owned.
- **A3** (`.gitignore`, `AGENTS.md`, `.cursor/`): same platform owners; Jared as design-system requester.
- **A5 if it edits Portal MDX** (`apps/portal/*`): Kevin, Pranesh, Abhinav, Vardan. Prefer inventory one-liners over new MDX.
- **Track B contracts**: same as A1, plus Figma review before `stable` (see `packages/ui/catalog/contracts/README.md`).

---

### Track A — MCP

```
codex/component-inventory
  └── A1 feat/design-system-mcp          agent catalog compiler
        ├── A2 feat/mcp-stdio-server     MCP package + 5 tools + goldens
        │     ├── A3 feat/mcp-cursor-skill   Cursor skill + mcp.json  ← Phase 0 human gate
        │     └── A4 feat/mcp-foundations    get_tokens + get_guidelines (parallel with A3)
        └── A5 feat/mcp-fallback-quality     small fallback summaries (parallel, from A1)
              └── A6 … A8
```

#### PR A1 — Compile the agent catalog

| | |
| --- | --- |
| **Branch** | `feat/design-system-mcp` |
| **Base** | `codex/component-inventory` (retarget to `main` after 11305 merges). **Not** a commit on 11305. |
| **Tasks** | 0.1, 1.2 (seed + aliases) |
| **Title** | `feat(ui): compile budgeted agent catalog for MCP` |

**Why this is first:** Independently useful. Copilot already consumes contracts; this is the slim agent view. No new package, no Cursor policy, **no checked-in giant JSON**.

**Files**

- Create `packages/ui/scripts/compile-agent-catalog.mjs`
- Create `packages/ui/scripts/compile-agent-catalog.test.js`
- Create `packages/ui/scripts/validate-agent-catalog.mjs` (sibling; do not edit `validate-component-contracts.mjs` stdout)
- Modify `packages/ui/package.json` — `catalog:generate` also writes the agent catalog; `catalog:validate` chains both CLIs
- Create `packages/ui/catalog/agent-aliases.json`
- Optional `packages/ui/catalog/icon-synonyms.json`
- Modify gitignore so `packages/ui/catalog/generated/agent/` is ignored (keep existing `catalog/generated/*.json` tracked)

**Must implement**

- Button → `confidence: "stable"` from `button.contract.json` (import `@harnessio/ui/components`, do/don't, props, constraints, migrations).
- Rewrite stale contract examples that use `IconV2 icon=` → `name=`.
- Dialog → `confidence: "fallback"` with Portal `ComponentExample` (`Dialog.Root`) even though there is no contract. `members` includes `Root`, `Trigger`, `Content`, …
- Drawer → missing `catalog/contracts/drawer.contract.json` → `fallback`, no throw, not `stable`. Example contains `Drawer.Root`.
- Other missing `contractPath` rows follow the same rule.
- Unreviewed exports → `confidence: "unreviewed"` with **no invented** do/don't.
- Alias seed as specified; `modal` attaches to Dialog.
- Icon list includes `trash`; `delete` resolves via the synonym seed. IconV2 mapped to `components/visual/icon.mdx`.
- Exclude type/enum/map/context noise from the searchable set.
- `foundations.json` may be **thin** (installation stub + schema). Full Portal foundations are A4.
- Deterministic bytes; no `generatedAt`.
- Cap example extraction (~40 lines); strip `@/components` import lines.

**Leave out:** `packages/design-system-mcp/`, `.cursor/`, `AGENTS.md`, new `*.contract.json`, Copilot/Figma plugin changes, checking in `catalog/generated/agent/*.json`.

**Test plan**

- [ ] `pnpm --filter @harnessio/ui catalog:generate && catalog:validate`
- [ ] Existing contract CLI stdout test still green (spawn of `validate-component-contracts.mjs` unchanged)
- [ ] Compiler tests: Button stable, Dialog ComponentExample + members, Drawer missing-file fallback, `trash` / `delete`, alias `modal`, hash/byte stability, `icon=` rewrite
- [ ] `git check-ignore -v packages/ui/catalog/generated/agent/components.json` reports ignored

**Merge when:** Dialog and Drawer are compiled without contract files; generate is deterministic; generated agent JSON is not in git.

---

#### PR A2 — MCP stdio server

| | |
| --- | --- |
| **Branch** | `feat/mcp-stdio-server` |
| **Base** | `feat/design-system-mcp` (A1) |
| **Tasks** | 0.2, 0.4, 1.3 |
| **Title** | `feat(mcp): add Canary design-system MCP server` |

**Why split here:** New private Node package. Root `pnpm -r test|typecheck|build|pretty` will pick it up. Keep it `tsc` (not Vite). No React. Same exception as `@harnessio/figma-plugin`. Tests compile the catalog first.

**Files**

- Create `packages/design-system-mcp/` — `package.json` (`private: true`, `"type": "module"`, `engines.node >= 18.17.1`, `bin`, scripts: `build`, `start`, `test`, `typecheck`, `pretty`). Pin `@modelcontextprotocol/sdk` to `^1`. Direct deps: `zod`, `fuzzysort`. No `@harnessio/ui`.
- Create `src/index.ts`, `catalog.ts`, `search.ts`, `validate-props.ts`, `budgets.ts`, `tools/*.ts`, `bin/canary-mcp.js` (compile-if-missing)
- Create `tests/` including `golden-queries.test.ts`
- Create `README.md` (how it runs, rebuild path, confidence meaning, five **manual** prompts)
- Modify `pnpm-lock.yaml`
- Modify `CODEOWNERS` — `/packages/design-system-mcp/` and, if touching ownership, `/packages/ui/scripts/` `/packages/ui/catalog/`
- Modify `AGENTS.md` **package table only** (name, path, Node/no-React-17 exception). The “must use MCP” paragraph waits for A3

**Tools (five):** `search_components`, `get_component`, `get_example`, `validate_props`, `search_icons`.

**Must implement**

- Bin compile-if-missing for `dist/` and agent catalog. Fresh tree without `dist/` still starts.
- Button `variant: "primary", theme: "danger", rounded: true, iconOnly: false` (size omitted) → `deprecated` or `unsupported` per live contract (TextRounded). Same with explicit `size: "md"`. Legal primary with omitted size → `supported`. Dialog → `unknown`.
- Search: `button` ranks `canary.button` first; `modal` ranks Dialog (alias before stable-boost).
- `get_component` has no example source; `get_example` does.
- Payload budgets in tests.
- Goldens as in Task 0.4.

**Leave out:** `.cursor/mcp.json`, skill, replacing `.cursor` gitignore, `get_tokens`, `get_guidelines`, HTTP, publishing (`private` stays true), `build:ci`.

**Test plan**

- [ ] `pnpm --filter @harnessio/design-system-mcp test` (unit + goldens + budgets + bin list-tools smoke, catalog compiled first)
- [ ] `pnpm --filter @harnessio/design-system-mcp typecheck`
- [ ] Delete `packages/design-system-mcp/dist` and confirm the bin still starts
- [ ] Confirm `pnpm -r build` from repo root still succeeds (cheap `tsc` here)

**Merge when:** Goldens green in Vitest. Cursor wiring is A3. This is **not** Phase 0 complete.

---

#### PR A3 — Cursor skill and repo MCP config

| | |
| --- | --- |
| **Branch** | `feat/mcp-cursor-skill` |
| **Base** | `feat/mcp-stdio-server` (A2) |
| **Tasks** | 0.3 |
| **Title** | `feat(mcp): wire Canary MCP into Cursor and agent guides` |

**Files**

- Modify `.gitignore` — **replace** `.cursor` with `.cursor/*` + un-ignores (see Task 0.3)
- Create `.cursor/mcp.json` pointing at the bin
- Create `.cursor/skills/canary-ui/SKILL.md` (cool policy)
- Modify `AGENTS.md` and `CLAUDE.md` — package row (if not in A2) + one paragraph: coding agents must call this MCP when adding/swapping UI; React 17 does not apply to `@harnessio/design-system-mcp`
- Modify `packages/design-system-mcp/README.md` — rebuild path: `pnpm --filter @harnessio/ui catalog:generate && pnpm --filter @harnessio/design-system-mcp build`; human smoke list

**Leave out:** Publishing, platformUI repo changes, HTTP.

**Test plan**

- [ ] Fresh Cursor window: Canary MCP connected, **five** tools listed (human)
- [ ] Manual: “Add a Save button to a toolbar” → Canary `Button`
- [ ] `git check-ignore -v` does not hide `.cursor/mcp.json` or the skill

**Merge when:** Phase 0 **human** gate is done. Stop here before A4 unless foundations are blocking a real agent task. A4 may already be in flight from A2.

---

#### PR A4 — Foundations index + remaining tools

| | |
| --- | --- |
| **Branch** | `feat/mcp-foundations` |
| **Base** | **A2** (not A3 — unstack from Cursor policy) |
| **Tasks** | 1.1 |
| **Title** | `feat(mcp): compile agent foundations and add guidelines/tokens tools` |

Expand `foundations.json` from Portal foundations, design-system, installation, and growth patterns. Each page ≤ 12 bullets. Installation must state `pnpm add @harnessio/ui`, peer React 17, `@harnessio/ui/styles.css`. Add MCP tools `get_tokens` and `get_guidelines` (and optional `canary://inventory` resource). Tests for `installation` and `theming`. No new contracts.

---

#### PR A5 — High-priority fallback quality (capped)

| | |
| --- | --- |
| **Branch** | `feat/mcp-fallback-quality` |
| **Base** | **A1** |
| **Tasks** | 2.1 |
| **Title** | `feat(catalog): fill golden-screen agent fallback summaries` |

Only the golden-screen fallbacks listed in Task 2.1. Prefer inventory one-liners. **Do not fake contracts.** Avoid Portal MDX churn unless a page is empty.

---

#### PR A6 — Pattern recipes

| | |
| --- | --- |
| **Branch** | `feat/mcp-pattern-recipes` |
| **Base** | A4 (needs `get_guidelines`) |
| **Tasks** | 2.2 |
| **Title** | `feat(mcp): add screen pattern recipes to agent guidelines` |

Compile recipes (not new components): Dialog + form + `ButtonLayout`; filter bar via **`@harnessio/filters`**; page header actions; `NoData`; dual-pane drawer. Expose via `get_guidelines` / `get_pattern` alias. Markdown sources live next to the compiler, not as hand-authored catalog JSON.

---

#### PR A7 — Review prompt

| | |
| --- | --- |
| **Branch** | `feat/mcp-review-prompt` |
| **Base** | A6 |
| **Tasks** | 2.3 |
| **Title** | `feat(mcp): add Review Canary UI prompt` |

Advisory MCP prompt: flag Lucide, `@/components/ui` shadcn paths, raw `<button>` when Button exists, Button `validate_props` failures. **Does not fail CI.**

---

#### PR A8 — Publish the package

| | |
| --- | --- |
| **Branch** | `feat/mcp-publish` |
| **Base** | A7 (after the local loop is boring) |
| **Tasks** | 3.1, 3.2 (Canary-side docs only) |
| **Title** | `feat(mcp): publish @harnessio/design-system-mcp with bundled catalog` |

`prepublishOnly` generates the agent catalog and copies JSON into the package `files` list (gitignored workspace output will not pack otherwise). Match `@harnessio/ui` registry. `bin` so `npx @harnessio/design-system-mcp` starts stdio from published `dist/`. Document uncached `npx` refresh. **Leave HTTP (3.3) and live-model eval (3.4) out** unless a follow-up asks.

**Not in this repo:** `platformUI` `.cursor/mcp.json` — separate PR in `frontend/platformUI`.

---

### Track B — Pilot contracts (parallel, not MCP-blocking)

Each PR follows `packages/ui/catalog/contracts/README.md`. Inventory already points at missing files. After `stable`, regenerate locally; MCP picks it up on next compile. **Do not** commit agent JSON in these PRs.

| PR | Branch | Title | Inventory | Agent notes |
| --- | --- | --- | --- | --- |
| B1 | `feat/contract-text-input` | `feat(contracts): add TextInput contract` | `canary.text-input` — classified, file missing, Portal exists | Highest agent value of the named pilots |
| B2 | `feat/contract-drawer` | `feat(contracts): add Drawer contract` | `canary.drawer` — classified, file missing, Portal + Code Connect exist | Phase 0 already serves this as `fallback` |
| B3 | `feat/contract-select` | `feat(contracts): add Select contract` | `canary.select` — same pattern | Alias `dropdown` already points here |
| B4 | `feat/contract-status-badge` | `feat(contracts): add StatusBadge contract` | `canary.status-badge` | Lower agent value than Link |
| B5 | `feat/contract-link` | `feat(contracts): add Link contract` | `canary.link` — high, Portal exists, **no** `contractPath` yet | Prefer this over B4 if only one author |

**Base for each:** `codex/component-inventory` (or `main` once inventory has merged). **Do not** stack these on A1–A3.

**Each contract PR includes:** contract JSON, evidence, `catalog:generate` + `catalog:validate` (contract artifacts only need to stay byte-fresh), Figma plugin pack compile, Figma review before `stable`. Out of scope: MCP server files, agent `components.json`.

---

### Suggested implementation order

1. **A1** compiler (start here)
2. **A2** package + five tools + goldens
3. **A3** Cursor skill — Phase 0 complete (human gate), in parallel with **A4** from A2
4. **A5** capped fallbacks from A1, whenever free
5. **B1–B5** in parallel whenever authors are free (TextInput first; Link before StatusBadge)
6. **A6–A7** as catalog quality work
7. **A8** publish only after A3 is reliable in Cursor

Do not start A8, HTTP, or a live-model eval harness until Phase 0 goldens are green in Vitest **and** the A3 Cursor smoke has been done. Do not treat Track B, 74 contracts, or tokens/guidelines as Phase 0 gates.
