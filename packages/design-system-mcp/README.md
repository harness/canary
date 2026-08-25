# @harnessio/design-system-mcp

Local **stdio** MCP server that resolves intent to Canary package names, imports, examples, and icons. It is a Node child process, not a hosted service. React 17 does not apply (no UI).

Coding agents should import from `@harnessio/ui/components` and use `<IconV2 name="…" />`. This server exists so they stop generating shadcn, Lucide, and raw HTML.

## How it runs

```
node packages/design-system-mcp/bin/canary-mcp.js
```

The bin compiles `dist/` if it is missing and compiles the agent catalog if `packages/ui/catalog/generated/agent/` is missing, then speaks JSON-RPC on stdin/stdout. Do not point Cursor at `node dist/index.js` as the only entry: a fresh clone has no `dist/`. Do not use `pnpm --filter … exec` as the MCP command.

This repo starts the server from `.cursor/mcp.json`:

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

A fresh Cursor window on this repo should show **canary** connected with five tools. The Canary UI skill is `.cursor/skills/canary-ui/SKILL.md`.

## Rebuild

```bash
pnpm --filter @harnessio/ui catalog:generate && pnpm --filter @harnessio/design-system-mcp build
```

Generated agent JSON is gitignored. Two compiles of the same tree are byte-identical.

## Tools

| Tool | Use |
| --- | --- |
| `search_components` | Ranked Canary exports. Call before writing new JSX. |
| `get_component` | Budgeted record. **No example source.** |
| `get_example` | One snippet. The only code channel. |
| `validate_props` | Contract combinations. No constraints → `unknown`, not `supported`. |
| `search_icons` | IconV2 `name` keys. Never Lucide. |
| `get_tokens` | Semantic token ids + `cn-` usage note. |
| `get_guidelines` | Short foundation / growth-pattern page (≤ 12 bullets). |

## Resource

`canary://inventory` — compact `{ id, exportName, confidence, category }` for every searchable export.

## Confidence

| Value | Meaning |
| --- | --- |
| `stable` | Readable contract with `stable` or `piloting` lifecycle. |
| `fallback` | No usable contract file; Portal MDX exists. Use the Canary export; do not invent a parallel component. |
| `unreviewed` | Inventory only. Still use the Canary export. |

## Manual smoke (human, not CI)

Use these prompts in Cursor after the MCP is connected:

1. Add a Save button to a toolbar.
2. Open a confirmation modal.
3. Add a form field for the resource name.
4. Add a delete icon to the row action.
5. Navigate to settings.

Expected: Canary `Button`, `Dialog.Root`, `TextInput`, `<IconV2 name="trash" />`, and `Link` — not shadcn or `lucide-react`.
