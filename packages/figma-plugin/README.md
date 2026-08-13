# DS Contracts — Figma plugin

Figma plugin that checks work against Canary component contracts (shared / designOnly / codeOnly) and drafts Path P proposals for gaps.

This package is private, Preact-based, and not published with `@harnessio/ui`. It consumes contracts from `packages/ui/catalog/contracts` at pack time — it is not a second source of truth.

Internal tool — not a Figma Community marketplace submission.

## Requirements

- Node ≥ 18.17.1
- pnpm
- Figma Desktop

## Setup

From the repository root:

```bash
pnpm install
pnpm --filter @harnessio/figma-plugin build
```

Or from this package:

```bash
pnpm install
pnpm build
```

`pnpm build` compiles Figma-governed `*.contract.json` files into `catalogs/canary/` (gitignored) and then builds the plugin.

## Load in Figma Desktop

1. `pnpm --filter @harnessio/figma-plugin build`
2. Open Figma Desktop → **Plugins → Development → Import plugin from manifest…**
3. Select `packages/figma-plugin/manifest.json`
4. Run **DS Contracts** from Development plugins

### Golden-path smoke (Button)

1. Open a file with Canary / HDS `❖Button` instances.
2. Select a Button → **Check selection** — expect Pass (or designOnly info for icon helpers).
3. Set an illegal variant if you can (or a local renamed prop) → Fail + **Propose**.
4. **Copy markdown** / **Copy handoff** for a ticket paste.
5. **Catalog** tab → browse Button shared enums.
6. First run shows the 3-slide onboarding; reset from Settings.

## Develop

```bash
# Rebuild UI + main on save (two watchers). Re-run catalogs:pack after contract edits.
pnpm dev:ui    # terminal 1
pnpm dev:main  # terminal 2
```

Then use **Plugins → Development → DS Contracts** and re-run after rebuilds.

### `documentAccess: "dynamic-page"` constraints

The manifest opts into dynamic page loading, so the sandbox thread must never
use the synchronous document APIs — they throw at runtime and unit tests with
plain-object mocks won't catch it:

| Don't | Do |
|-------|----|
| `instance.mainComponent` | `await instance.getMainComponentAsync()` |
| `figma.getNodeById(id)` | `await figma.getNodeByIdAsync(id)` |
| `figma.root.children`, `findAll` on the document | `await figma.loadAllPagesAsync()` first |
| `page.children` on a non-current page | `await page.loadAsync()` first |

`tests/collectTraverse.test.ts` models this: its instance mocks throw when the
sync `mainComponent` getter is read.

The main thread starts before the UI iframe, so anything posted at startup can
be dropped. The UI sends `UI_READY` and the main thread replies with
`plugin-ready` — that reply drives the header status pill.

## Tests & catalog validation

```bash
pnpm test
pnpm typecheck
pnpm catalogs:validate
pnpm catalogs:pack   # compiles contracts → catalogs/canary/*.json
```

## Privacy / network

v1 **allowedDomains** are GitHub and Harness issue hosts. Catalogs ship compiled from in-repo contracts. Remote manifest fetch is deferred until an explicit allow-listed host is configured in Settings.

## Layout

| Path | Role |
|------|------|
| `src/core/` | Pure check / proposal engine (unit-tested, no Figma API) |
| `src/schema/` | Zod catalog schema (compiled-pack shape) |
| `src/main.ts` | Figma sandbox thread |
| `src/ui.tsx` | Preact UI |
| `bin/compile-contracts.mjs` | Compiles `packages/ui/catalog/contracts` into the bundled pack |
| `catalogs/canary/` | Generated pack — do not edit |
| `docs/` | USER_GUIDE, CATALOG_AUTHORING, RELEASE_CHECKLIST |
| `assets/` | Harness plugin icon (`icon.png` / `icon.svg`, `harness-mark.*`) + empty-state SVG |

## Docs

- [User guide](./docs/USER_GUIDE.md)
- [Catalog authoring](./docs/CATALOG_AUTHORING.md)
- [Support](./SUPPORT.md)
- [Privacy](./PRIVACY.md)
- [Release checklist](./docs/RELEASE_CHECKLIST.md) (internal — not Community marketplace)
