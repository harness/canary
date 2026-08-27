# Canary Design-System MCP Implementation Plan

> **For agentic workers:** Implement phase by phase. Phase 0 is the vertical slice and does not require new component contracts. Later phases add coverage and distribution. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give coding agents a local MCP process that resolves intent to Canary package names, import paths, examples, icons, and tokens — so they stop generating shadcn, Lucide, and raw HTML — without waiting for a contract on every export.

**Architecture:** Component contracts remain the canonical source of truth. A new compiler emits a prompt-sized **agent catalog**. The MCP server is a Node stdio process that reads that catalog and exposes tools. Unreviewed components fall back to inventory + Portal MDX + TypeScript exports, marked `fallback` or `unreviewed`. Canary Copilot stays the Figma consumer; this server is the agent consumer of the same catalog pipeline.

**Tech Stack:** Node.js ESM, TypeScript, Zod 4, `@modelcontextprotocol/sdk` (stdio), Vitest, pnpm. No React runtime in the MCP package (same exception as `@harnessio/figma-plugin`).

**Overview:** Cursor canvas `canary-mcp-overview.canvas.tsx`. Contracts spec: `docs/superpowers/specs/2026-08-14-generation-ready-component-contracts-design.md`.

---

## How it runs

The MCP “server” is a **local child process**, not a hosted service, in Phases 0–2.

```
Cursor / Claude Code (MCP client)
        │  JSON-RPC over stdin/stdout
        ▼
node packages/design-system-mcp/dist/index.js
        │  reads compiled JSON at startup
        ▼
packages/ui/catalog/generated/agent/*
```

When the IDE opens this repo, `.cursor/mcp.json` starts the process. Tool calls are answered from memory-loaded catalog files. Quitting the IDE kills the process. Nothing is deployed.

For `platformUI` and other consumers that do not clone Canary, Phase 3 publishes `@harnessio/design-system-mcp` with the catalog bundled, still started via `npx` stdio. A hosted HTTP endpoint is optional and last.

A Cursor **skill** is separate: markdown that tells the agent *when* to call these tools. The MCP process *is* the tools.

---

## Global constraints

- Contracts are not a gate. Phase 0 ships on Button (stable) plus fallbacks from inventory, Portal, and IconV2.
- Do not copy component source into consumer apps. Canary is `import { Button } from "@harnessio/ui/components"`.
- Do not dump raw `button.contract.json` (~1,200 lines) into tool results. Return a budgeted agent view.
- Do not generate or overwrite production React or published Figma artifacts.
- Do not author a second catalog by hand. Compiler output is generated and freshness-checked, same as Copilot’s pack.
- Mark every component result with `confidence`: `stable` | `fallback` | `unreviewed`.
- `validate_props` is only authoritative when constraints exist. Otherwise return `unknown` and point at TypeScript.
- Icon API is `<IconV2 name="plus" />`, never Lucide, never the contract’s stale `icon=` example.
- Payload budgets: search hit ≤ 400 tokens, `get_component` ≤ 1,500 tokens, examples one snippet at a time.
- React 17 does not apply to this package (Node process, no UI).

---

## Immediate value vs contract-gated value

| Job | Phase 0 (no new contracts) | Needs a contract |
| --- | --- | --- |
| Stop shadcn / Lucide | Yes | No |
| Correct Dialog / TextInput composition | Yes (Portal examples) | Only for illegal variants |
| Useful inside `platformUI` | Yes, once the package is published or path-linked | No |
| Button vs Link, rounded text, AI+danger | Partial (Button Portal + Button contract) | Yes for `validate_props` |
| Copilot Figma check / health scores | No (already a different product) | Yes |
| Generate new primitives | Out of scope | Out of scope |

Write new contracts where agents get rules wrong. Do not block the server on 74 contracts.

---

## Data model — agent catalog

Compiled, not authored. Three generated files under `packages/ui/catalog/generated/agent/`:

### `components.json`

One record per inventory export.

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
    code: string
  }>
  constraints?: {
    exhaustive: boolean
    dimensions: string[]
    combinations: Array<{
      id: string
      status: 'supported' | 'deprecated' | 'unsupported'
      conditions: Record<string, Array<string | boolean | number | null>>
      description: string
      migrationId?: string
    }>
  }
  migrations?: Array<{ id: string; instructions: string }>
  sourcePath: string
  portalPath?: string
  contractVersion?: string
}
```

**Fill rules**

- `stable`: compiled from a `stable` or `piloting` contract. Semantics, props, examples, constraints, do/don't come from the contract. React `import` from `surfaces.react.import`.
- `fallback`: inventory row has `portalDoc`. Summary and examples come from MDX (frontmatter description + fenced `tsx`/`typescript jsx` blocks). Props stay thin (export name + “see TypeScript”) unless a later extractor is added.
- `unreviewed`: inventory only. Summary is the export name and family. No fake do/don't.

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

Short pages compiled from Portal foundations + growth patterns + token registry ids.

```ts
type AgentFoundation = {
  id: string                    // color | typography | spacing | theming | icons | dual-pane-stepper
  title: string
  summary: string
  rules: string[]               // 5–12 bullets, not the full MDX
  examples?: string[]
}
```

All three files include `generatedAt`, `sourceInventoryCount`, and a content hash so `catalog:validate` can fail on staleness.

---

## Protocol surface (Phase 0)

Tools, not a kitchen sink. Each tool returns JSON. Errors are structured `{ error, hint }`.

| Tool | Input | Output |
| --- | --- | --- |
| `search_components` | `query: string`, optional `limit` (default 8) | Ranked `{ id, exportName, summary, confidence, score, why }` |
| `get_component` | `id` or `exportName` | Full `AgentComponent` minus `constraints.combinations` (include a `hasConstraints` flag and tell the agent to call `validate_props`) |
| `get_example` | `id`, optional `exampleId` | One snippet. Default = first `recommended` / first Portal fence |
| `validate_props` | `id`, `props: Record<string, unknown>` | `{ status: supported \| deprecated \| unsupported \| unknown \| invalid, ruleId?, message, migration? }` |
| `search_icons` | `query: string`, optional `limit` | `{ name, usage, synonyms }` |
| `get_tokens` | optional `query` or `componentId` | Semantic token ids + one-line description from `token-registry.json` and a short `cn-` usage note |
| `get_guidelines` | `id` (foundation/pattern) | The `AgentFoundation` record |

**Resource (optional Phase 0, required Phase 1):** `canary://inventory` — compact list of `{ id, exportName, confidence, category }` so agents can browse without searching.

**Prompt:** `Implement with Canary` — instructs: call `search_components` before writing JSX; never install shadcn or `lucide-react`; use `IconV2`; if `confidence` is not `stable`, still use the Canary export and do not invent a parallel component.

Search ranking: fuzzysort (already used in `@harnessio/ui`) over `exportName`, `aliases`, `summary`, `useWhen`, `family`, `category`. Boost `stable` then `fallback` over `unreviewed`.

---

## File map

### New package `@harnessio/design-system-mcp`

- Create `packages/design-system-mcp/` — private, `"type": "module"`, Node ≥ 18.17.1, no React.
- Create `packages/design-system-mcp/src/index.ts` — stdio entry; load catalog; register tools; `StdioServerTransport`.
- Create `packages/design-system-mcp/src/catalog.ts` — load and type the three JSON files (Zod).
- Create `packages/design-system-mcp/src/search.ts` — component and icon search.
- Create `packages/design-system-mcp/src/validate-props.ts` — constraint matcher for React prop maps. Reuse the Copilot combination rule (`exactly one match` when exhaustive). Do not import Figma types.
- Create `packages/design-system-mcp/src/tools/*.ts` — one file per tool.
- Create `packages/design-system-mcp/src/budgets.ts` — truncation helpers.
- Create `packages/design-system-mcp/bin/canary-mcp.js` — `#!/usr/bin/env node` → compiled entry.
- Create `packages/design-system-mcp/tests/` — catalog load, search ranking, Button validate_props, payload budgets, golden queries.
- Create `packages/design-system-mcp/README.md` — how it runs, Cursor config, what confidence means.

### Agent catalog compiler (lives next to existing catalog scripts)

- Create `packages/ui/scripts/compile-agent-catalog.mjs` — reads inventory, contracts, Portal MDX, IconNameMapV2 keys, token-registry, selected foundation MDX; writes `catalog/generated/agent/*.json`.
- Create `packages/ui/scripts/compile-agent-catalog.test.js` — Button projection matches contract semantics; Dialog is `fallback` with at least one example; icon list includes `trash`; freshness hash is stable.
- Modify `packages/ui/scripts/validate-component-contracts.mjs` (or a sibling `validate-agent-catalog.mjs`) — fail if agent catalog is stale.
- Modify `packages/ui/package.json` — `catalog:generate` also writes the agent catalog.

### IDE wiring

- Create `.cursor/mcp.json` — stdio command pointing at the workspace package. No secrets.
- Create `.cursor/skills/canary-ui/SKILL.md` — policy: search this MCP before writing UI; IconV2; `@harnessio/ui/components`; do not use shadcn.
- Modify `AGENTS.md` — add the package row and a one-paragraph “coding agents must use the Canary MCP”.

### Out of scope for the file map

- New `*.contract.json` files (parallel workstream; inventory already names Drawer, Select, StatusBadge, TextInput).
- HTTP transport, auth, Cursor marketplace listing.
- Extracting a shared `catalog-core` package (copy the 20-line matcher; extract later if both Copilot and MCP need the same module).

---

## Phase 0 — Prove the loop

**Done when:** In this repo, Cursor lists the Canary MCP tools, `get_component` for Button returns the `@harnessio/ui/components` import and do/don't list, `search_components("dialog")` returns Dialog as `fallback` with a Portal example, and a golden query “add a Save button” would import Canary Button rather than shadcn.

### Task 0.1: Agent catalog compiler

**Files:** `packages/ui/scripts/compile-agent-catalog.mjs`, test, `catalog/generated/agent/{components,icons,foundations}.json`

- [ ] **Step 1:** Write failing tests for Button `stable` projection, Dialog `fallback` with an import + fenced example, IconV2 `name` keys, and deterministic hashing.
- [ ] **Step 2:** Implement MDX extraction: frontmatter `title`/`description`; first 1–3 fenced `tsx` / `typescript jsx` / `typescript` blocks; skip import lines that reference `@/components`. Cap example code at ~40 lines.
- [ ] **Step 3:** Implement contract projection: identity, semantics, React import, props from canonical properties + React extensions, do/don't, examples (`references.code`), constraints, migrations.
- [ ] **Step 4:** Wire `pnpm --filter @harnessio/ui catalog:generate` and freshness validation. Check generated JSON in.

**Acceptance:** `pnpm --filter @harnessio/ui catalog:validate` fails if you edit Portal Button copy and forget to regenerate. Dialog appears even though it has no contract.

### Task 0.2: MCP package and stdio server

**Files:** `packages/design-system-mcp/**`

- [ ] **Step 1:** Scaffold package.json (private, ESM, `bin`, scripts: `build`, `start`, `test`, `typecheck`). Depend on `@modelcontextprotocol/sdk` and `zod`. Dev: `typescript`, `vitest`.
- [ ] **Step 2:** Load catalog via Zod. Server refuses to start if files are missing.
- [ ] **Step 3:** Register the seven tools. `validate_props` on Button `variant: "primary", theme: "danger", rounded: true, iconOnly: false` returns `deprecated` or `unsupported` per the live contract (TextRounded is deprecated). A legal primary md default returns `supported`. Dialog returns `unknown`.
- [ ] **Step 4:** Enforce payload budgets in tests.
- [ ] **Step 5:** `pnpm --filter @harnessio/design-system-mcp start` speaks stdio (smoke: list tools via the SDK’s test client or a small script).

**Acceptance:** Unit tests cover search ranking (query `delete` prefers a destructive-adjacent component if present; query `button` ranks `canary.button` first), icon query `trash` / `delete`, and Button constraint cases.

### Task 0.3: Cursor wiring and skill

**Files:** `.cursor/mcp.json`, `.cursor/skills/canary-ui/SKILL.md`, `AGENTS.md`, package README

```json
{
  "mcpServers": {
    "canary": {
      "command": "pnpm",
      "args": ["--filter", "@harnessio/design-system-mcp", "exec", "node", "dist/index.js"]
    }
  }
}
```

Use whatever command actually works after the package bin is defined; prefer `node ./packages/design-system-mcp/dist/index.js` if filter-exec is flaky. Document `pnpm --filter @harnessio/ui catalog:generate && pnpm --filter @harnessio/design-system-mcp build` as the rebuild path.

Skill must include:

- Always call `search_components` before writing or restyling UI.
- Import from `@harnessio/ui/components` (and hooks/utils as needed).
- Icons: `IconV2` with `name` from `search_icons`. Never `lucide-react`.
- Prefer Canary `Link` for navigation, `Button` for actions (from the Button contract).
- Treat `unreviewed` as “use this export, don’t invent a new one,” not as permission to copy shadcn.

**Acceptance:** A fresh Cursor window on this repo shows a Canary MCP server as connected. Manual smoke: “Add a Save button to a toolbar” uses Canary Button.

### Task 0.4: Golden queries

**Files:** `packages/design-system-mcp/tests/golden-queries.test.ts`

Fixed queries. Each asserts tool choice + required strings in the payload. No live LLM.

| Query | Must |
| --- | --- |
| `primary save button` | `canary.button`, import `@harnessio/ui/components`, snippet contains `<Button` |
| `modal dialog with form fields` | Dialog (fallback) and TextInput appear in search; Dialog example contains `Dialog.Root` |
| `delete icon` | `search_icons` → a real IconV2 `name`, usage uses `name=` |
| `navigate to settings` | search mentions `Link` / avoidWhen on Button if Button is returned |
| `rounded text button` | `validate_props` or get_component dont-list flags TextRounded deprecation |

**Acceptance:** `pnpm --filter @harnessio/design-system-mcp test` green. Manual Cursor note in the README for the same five prompts.

---

## Phase 1 — Foundations and the named pilots

**Done when:** Tokens, IconV2, and guidelines are good enough for a settings form, and the four named pilots have contracts *or* are explicitly deferred with owners. The MCP does not wait on those contracts to keep shipping; the contracts make `validate_props` real for those families.

### Task 1.1: Foundations index

Compile short `AgentFoundation` pages from:

- `apps/portal/src/content/docs/foundations/{colors,typography,spacings,layout,icons,variables}.mdx`
- `apps/portal/src/content/docs/design-system/{theming,color-system,usage}.mdx`
- `apps/portal/src/content/docs/getting-started/installation.mdx` (peer deps, `styles.css`, Tailwind)
- Growth patterns: `dual-pane-stepper`, `single-pane-stepper`, `apps/portal/src/content/docs/components/actions/button-layout.mdx`

Keep each page ≤ 12 bullets. Installation must state: `pnpm add @harnessio/ui`, peer React 17, import `@harnessio/ui/styles.css`.

### Task 1.2: Icon synonyms

Seed a small synonym map for high-confusion names (`trash`/`delete`/`remove`, `xmark`/`close`/`clear`, `gear`/`settings`, `magnifying-glass`/`search`). Do not invent a full thesaurus. Filename tokens (`arrow-left`) are already searchable.

### Task 1.3: `validate_props` shared with Copilot rules

Keep logic in the MCP package. Add tests copied from Button’s exhaustive matrix: AI+danger unsupported, rounded+text deprecated, icon-only rounded supported, focus not required as a Figma prop.

If duplication with `packages/figma-plugin/src/core/constraints.ts` becomes painful, extract a tiny `packages/catalog-eval` later — not in this task.

### Task 1.4: Pilot contracts (parallel, not MCP-blocking)

Inventory already points at missing files for Drawer, Select, StatusBadge, TextInput. Authoring follows `packages/ui/catalog/contracts/README.md`. After each contract is `stable`, regenerate the agent catalog; MCP picks it up with `confidence: "stable"` and constraints. No MCP code change required if Task 0.1 projection is complete.

---

## Phase 2 — Screens that compile

**Done when:** An agent can assemble a typical Harness screen (list + filters + dialog + form + toasts) using Canary names, and a review prompt can flag the worst Button mistakes.

### Task 2.1: High-priority fallback quality

For the 69 `priority: high` inventory rows, ensure Portal extraction is not empty (example or description). Where Portal is missing, add a one-line summary in inventory or a stub MDX — do not fake a contract.

### Task 2.2: Pattern recipes

`get_guidelines` / `get_pattern` (alias) for:

- Dialog + form + `ButtonLayout` footer (already in Dialog Portal)
- Filter bar
- Page header + primary/secondary actions
- Empty state (`NoData`)
- Dual-pane drawer

These are markdown-compiled recipes that name existing exports. They are not new components.

### Task 2.3: Review prompt

MCP prompt `Review Canary UI`: given a diff or file, call `search_components` / `validate_props` for Button (and any other stable contracts), flag Lucide imports, flag `@/components/ui` shadcn paths, flag `<button>` when Button exists.

This is advisory. It does not fail CI in Phase 2.

### Task 2.4: Contract coverage as a product goal

Track `stable` count in the generated catalog metadata. Do not require 74 contracts. Target: the components that appear in the golden screen (Button, Link, TextInput, Select, Dialog, Drawer, IconV2, ButtonLayout, StatusBadge, Alert).

---

## Phase 3 — Distribute

**Done when:** A `platformUI` engineer can add three lines of MCP config and get the same tools without cloning Canary.

### Task 3.1: Publish `@harnessio/design-system-mcp`

- Bundle `catalog/generated/agent/*.json` into the npm package (`files`).
- Public or Harness-private registry; match however `@harnessio/ui` is published.
- `bin` entry so `npx @harnessio/design-system-mcp` starts stdio.
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

Only if stdio+npx is not enough (browser agents, central auth, one pinned catalog for the company). Use Streamable HTTP from the same tool handlers. Auth is a Harness concern; do not invent it in Phase 0.

### Task 3.4: Eval harness beyond unit goldens

A checked-in prompt set run occasionally against a real model (Cursor or a scripted agent) scoring: Canary import present, no shadcn, no Lucide, Dialog compound components used. This is a quality gate for catalog changes, not a unit test.

---

## Testing strategy

- **Compiler:** fixtures for Button contract, a minimal Portal MDX, a truncated IconNameMap parse (or grep of keys). Snapshots of Button’s agent view; update snapshots only with contract changes.
- **Server:** in-process tool handlers, no MCP transport required for unit tests. One integration test that boots stdio and lists tools.
- **Constraints:** table-driven cases from the Button matrix.
- **Budgets:** oversize Portal example is truncated, not dropped.
- **Manual:** README smoke list (five prompts). Browser verification does not apply; the product is a Node process.

---

## Risks

| Risk | Mitigation |
| --- | --- |
| Agents still pick shadcn because training data is strong | Skill + MCP must be on by default in this repo; search must return hits for common English (“modal”, “input”, “dropdown”) |
| Portal examples go stale vs source | Freshness hash; `fallback` confidence; TypeScript remains the runtime authority |
| Button contract example uses `IconV2 icon=` | Compiler rewrites to `name=`; add a compiler test |
| Catalog too large for context | Search returns ids only; `get_component` is opt-in; never return all 193 full records |
| `pnpm filter exec` fails in Cursor spawn | Fall back to `node packages/design-system-mcp/dist/index.js` with `cwd` the repo root |
| People assume MCP requires 193 contracts | Phase 0 acceptance is Dialog-without-a-contract |

---

## Suggested implementation order

1. Compiler + Button/Dialog/icon fixtures (Task 0.1)
2. Package + tools + tests (Task 0.2)
3. Cursor config + skill (Task 0.3)
4. Golden queries (Task 0.4)
5. Foundations + synonyms (Phase 1.1–1.2)
6. Publish only after the local loop is boringly reliable (Phase 3)

Do not start Phase 3 or HTTP until Phase 0 goldens are green in Cursor, not just in Vitest.
