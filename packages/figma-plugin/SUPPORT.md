# Support — Canary Copilot (internal)

Internal plugin for Harness / Canary designers. **Not** a Figma Community listing.

## Report incorrect check

If Check flags something that is actually on-catalog (false positive) or misses a real violation (false negative):

1. Note **file**, **page**, **node id**, **catalog id**, **finding code**, and a screenshot.
2. File an issue with the plugin maintainers (or paste **Copy handoff** + the finding).
3. Prefer a short repro: one instance with the unexpected prop value.

In-plugin: use **Propose** with type clarifying the contract mistake, or ask the DS maintainer to amend `packages/ui/catalog/contracts`.

## False-positive triage (dogfood)

Target before calling v1 done: **&lt;5%** of findings on Button/Badge pilot frames dismissed as wrong.

Common causes:

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| "Not in catalog" on `❖Button/…` | Missing `componentKey` / name | Update the component contract, then `pnpm catalogs:pack` ([CATALOG_AUTHORING](./docs/CATALOG_AUTHORING.md)) |
| Detached fail on a component in a library file | Local `COMPONENT` named like a catalog entry | Expected — the check runs on product files, not library sources |
| Illegal theme with emoji | Normalize miss | Extend `normalizeFigmaValue` fixtures |
| designOnly failed as unknown | Name `#id` suffix | Ensure `designOnly` / `figmaProperty` entries |
| Detached fail on local copy | Expected | Relink to library or ignore for explorations |

## Contact

- DS maintainer (catalog truth)
- Plugin eng (this folder)

See also [PRIVACY.md](./PRIVACY.md) and [docs/USER_GUIDE.md](./docs/USER_GUIDE.md).
