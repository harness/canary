# @harnessio/icons Bundle Size Results

## Tree-shaking test (single icon import)

- **Import**: `import { AccountIcon } from '@harnessio/icons'`
- **Raw JS**: 144 KB
- **Gzipped**: ~45 KB

## No tree-shaking test (all icons via `import *`)

- **Import**: `import * as Icons from '@harnessio/icons'`
- **Raw JS**: 484 KB
- **Gzipped**: ~125 KB

## Analysis

| Scenario | Raw | Gzip | Icons included |
|----------|-----|------|----------------|
| Single icon | 144 KB | 45 KB | 1 |
| All icons | 484 KB | 125 KB | ~640 |

Tree-shaking effectiveness: importing a single icon results in ~30% of the full bundle size.
The 144 KB baseline includes React + ReactDOM (~140 KB minified).

**Effective icon payload:**
- Single icon: ~4 KB raw (144 - 140 React overhead)
- All icons: ~344 KB raw (484 - 140 React overhead)

## Legacy IconV2 from @harnessio/ui (single icon usage)

- **Import**: `import { IconV2 } from '@harnessio/ui/components'` + `<IconV2 name="account" size="md" />`
- **Raw JS**: 1,202 KB (1.1 MB)
- **Gzipped**: ~295 KB

Note: IconV2 uses a runtime icon map — importing even one icon pulls in
the entire icon sprite sheet and the full component library dependency graph
(Radix UI, CVA, etc.).

## Summary Comparison

| Scenario | Raw | Gzip | Notes |
|----------|-----|------|-------|
| `@harnessio/icons` — 1 icon | 144 KB | 45 KB | Tree-shakes perfectly |
| `@harnessio/icons` — all icons | 484 KB | 125 KB | Full icon set |
| `@harnessio/ui` IconV2 — 1 icon | 1,202 KB | 295 KB | No tree-shaking, pulls full dep graph |

**Key takeaway**: Using the new `@harnessio/icons` package with a single icon is **8x smaller** (raw) than the legacy IconV2 approach. Even importing ALL icons from `@harnessio/icons` is **2.5x smaller** than a single IconV2 usage from `@harnessio/ui`.

Visualizer reports available:
- `stats-treeshake.html` — single icon import (@harnessio/icons)
- `stats-no-treeshake.html` — all icons import (@harnessio/icons)
- `stats-legacy-iconv2.html` — single IconV2 usage (@harnessio/ui)
