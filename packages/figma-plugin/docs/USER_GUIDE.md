# Canary Copilot — User guide

Check Figma work against the Canary catalog. Flag illegal shared values, explain designOnly controls, and draft a proposal when something is missing.

**Audience:** Product designers using Figma Desktop with the **Canary Copilot** plugin (Canary / Harness).
**Plugin folder:** `packages/figma-plugin/` in the Canary repo.

## What each tab is for

| Tab | Purpose |
|-----|---------|
| **Check** | Scan the **selection** or **current page**. Finds illegal shared values, unknown props, and detached or local copies of library components. designOnly controls show as info. |
| **Propose** | Draft a Path P proposal from a Check failure, or start blank. Copy markdown or open an issue link. |
| **Catalog** | Browse legal **shared**, **designOnly**, and **codeOnly** for packed contracts (currently Button). |
| **Settings** | Catalog source, Jira issue destination, author defaults, strict `❖` unmapped mode, reset onboarding. |

## Shared vs designOnly

- **shared** — Prop names/values that exist in both Figma and React (`@harnessio/ui`). Illegal values here are real gaps or mistakes.
- **designOnly** — Canvas helpers (e.g. icon on/off, button text). Not React props. Check shows them as info with a **binding** hint (“compose IconV2 as child”). Do not implement designOnly as a fake React API.
- **codeOnly** — Runtime-only (`onClick`, `loading`, …). Listed in Catalog for awareness; never failed as missing Figma props.

## How to Check

1. Select Canary library instances (or leave selection empty and use **Check page**).
2. Open **Canary Copilot** → **Check selection** or **Check page**.
3. Read summary chips (Pass / Fail / Warn / Info / Not in catalog).
4. **Select** jumps to the layer; **Propose** opens Path P with defaults.
5. **Copy handoff** pastes a markdown Standards Check summary for tickets/PRs.

### What the results mean

- **Pass** — checked against the catalog, nothing wrong.
- **Fail** — an illegal shared value, an uncatalogued prop, or a component that is not a library instance. A Button that was detached and re-made locally reads: *"Button" is a local component, not the ❖Button library instance. Replace it from HDS | Components 3.0.*
- **Not in catalog** — nothing to check it against, so nothing is claimed: *Not in catalog — can’t verify "X".* Never counted as a pass. Turn on strict `❖` mode in Settings to fail these instead.
- Icon slots and other inner parts of a component the report already covers are folded into it, so one button is one finding.

Large pages yield progress every ~50 instances (see `scripts/gen-stress-notes.md`).

## How to Propose (Path P)

1. From a failure, click **Propose**, or open the Propose tab blank.
2. Fill **Title**, **Type**, **Problem**, **Attempted workaround**, **Requested change** (required).
3. **Copy markdown** — always works; paste into Jira or `PROPOSAL.md`.
4. Optional: **Open Jira issue** using the destination configured in Settings.

### Maintainer responses (plugin does not auto-merge)

| Response | Meaning |
|----------|---------|
| **Accept** | Will implement via code → catalog → Figma |
| **Amend** | Accepted with renamed/narrowed API |
| **Defer** | Valid later; use stated workaround |
| **Reject** | Will not add; use stated alternative |

## Network behavior

- **Default checks:** no network. The bundled catalog is resolved from `packages/ui/catalog/component-inventory.json` and compiled from mapped contracts at plugin build time.
- **Optional remote:** Settings → Custom manifest URL. Requires updating `manifest.json` `networkAccess.allowedDomains` first. On failure, the plugin falls back to bundled Canary with a clear message.
- **No analytics SDK** in v1.

## Install (Figma Desktop)

```bash
pnpm --filter @harnessio/figma-plugin build
```

Plugins → Development → **Import plugin from manifest…** → `packages/figma-plugin/manifest.json`.
