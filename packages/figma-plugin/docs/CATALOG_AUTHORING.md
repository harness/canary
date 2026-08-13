# Catalog authoring

How to extend the packs the plugin reads. The plugin is **never** a second source of truth — author contracts in `packages/ui/catalog/contracts`, then compile.

## Source of truth

```text
packages/ui/catalog/component-inventory.json (contractPath)
        ↓
packages/ui/catalog/contracts/*.contract.json
        ↓  pnpm catalogs:pack
packages/figma-plugin/catalogs/canary/
  manifest.json
  *.catalog.json
  canary.catalog.pack.json   # generated — one-file runtime artifact
```

`catalogs/` is gitignored. `pnpm build` / `pnpm test` run `catalogs:pack` first so the bundled import stays in sync.

Only inventory entries with `status: "mapped"`, a `figma` surface, and a valid `contractPath` are packed. Missing paths, ID mismatches, non-Figma contracts, and unreferenced Figma contract files fail compilation instead of silently becoming plugin policy. Each compiled entry includes the canonical repository path, schema version, contract version, and SHA-256 fingerprint shown in the Catalog tab. Add the next component by assigning its `contractPath`, advancing the inventory entry to `mapped`, and writing that contract next to Button; do not hand-edit plugin catalog JSON.

Validate and build the pack:

```sh
pnpm --filter @harnessio/figma-plugin catalogs:validate
pnpm --filter @harnessio/figma-plugin catalogs:pack
```

The compiler maps contract `properties.shared|designOnly|codeOnly` onto the plugin catalog schema, copies confirmed `componentKeys`, and derives `figmaNames` from the code export (`Button`, `❖Button`) so path-style sets like `❖Button/Sm/Text` still match.

## Manifest fields

- `version` — plugin package semver
- `system.id` / `displayName`
- `components[]` — `id`, `path`, optional `figmaNames`, `componentKeys`

Matching order in the plugin:

1. `componentKey` ∈ entry or manifest keys
2. `componentSetKey` ∈ those same keys — the set that owns the variant
3. Component-set name, then `mainComponentName`, against `figmaNames`:
   exact, then normalized (strip `❖`), then path prefix
   (`❖Button/Sm/Text` → catalog root `Button`)
4. Layer name — only for detached copies and for variant instances whose set
   could not be read, because designers rename instances

A variant's `mainComponentName` is its property combination
(`variant=primary, state=default`). It is never matched and never displayed.

## Catalog entry shape

Compiled from Canary `*.contract.json`: `id`, `status`, `code`, `figma`, `shared`, `designOnly`, `codeOnly`, optional `bindings`, `tokens`, `patterns`.

### Prop kinds

| Kind | Meaning |
|------|---------|
| `shared` | Legal Figma + React API |
| `designOnly` | Figma helpers; bind via `mapsTo` / `bindings` |
| `codeOnly` | Runtime only — Catalog tab, not Check failures |

### Figma value notes

Emoji-prefixed enums (`⚫ default`, `🟢 success`) are stripped by `normalizeFigmaValue`. Contract descriptions are copied onto `figmaNote`.

### componentKeys

Prefer published library **assetKey** / `mainComponent.key` values from HDS Components 3.0 — never invent. Capture via Figma Desktop Bridge dump or MCP `list_file_components_for_code_connect`. Regression: `tests/componentKeys.test.ts`.

`list_file_components_for_code_connect` returns the **component-set** key for anything with variants, while an instance reports its **variant's** key at runtime. Both are matched, so a set key is enough; record variant keys only if you have a live dump. When a real instance still lands in "Not in catalog", Copy handoff prints its `key` / `set key` / `set name` — paste those into the **contract**, not into a plugin catalog file.

## Adding a component

1. Confirm the real `@harnessio/ui` export (do not invent enums).
2. Add `packages/ui/catalog/contracts/<name>.contract.json` with a Figma surface.
3. Run `pnpm --filter @harnessio/ui catalog:validate`.
4. Run `pnpm --filter @harnessio/figma-plugin catalogs:pack` + `pnpm test`.
5. Dogfood Check on real library instances before marking the contract `stable`.

## Remote packs

Settings → Custom pack or manifest URL. Prefer publishing `<systemId>.catalog.pack.json` (one download). A manifest URL still works: the plugin tries the sibling pack first, then fetches components in parallel (bounded concurrency) and caches the last good pack for offline refresh.

Host must be allow-listed in plugin `manifest.json` `networkAccess`. Timeout is 10s; invalid JSON surfaces as humanized `CATALOG_INVALID`.
