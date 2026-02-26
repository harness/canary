# Split global CSS: main.css + diff.css

Numerical comparison only. Chunks: `dist/styles/main.css`, `dist/styles/diff.css`. Minified production builds.

**Source:** `src/styles/main.css` (design system, Tailwind, fonts, utilities, Monaco, layout, overrides) and `src/styles/diff.css` (diff-styles, highlight.js, diff wrapper, view blocks). Entry `styles.css` imports both. No separate base/utilities/monaco/layout/overrides files.

**Exports:** `@harnessio/ui/styles.css` (full), `@harnessio/ui/styles/main.css`, `@harnessio/ui/styles/diff.css`.

## Before vs after

| Metric                        | Before  | Full bundle | Optional chunks                     |
| ----------------------------- | ------- | ----------- | ----------------------------------- |
| Full bundle raw               | 3.07 MB | 3.07 MB     | Same                                |
| Full bundle gzip              | 743 KB  | 743 KB      | Same                                |
| Lazy load (diff deferred)     | —       | —           | ~14 KB raw / ~3 KB gzip off initial |
| Cache invalidation (one file) | 743 KB  | 743 KB      | ~3 KB (diff) or ~851 KB (main)      |

## Chunk sizes

| Chunk   | Raw          | Gzip        |
| ------- | ------------ | ----------- |
| main    | ~4.06 MB     | ~851 KB     |
| diff    | ~14 KB       | ~3 KB       |
| **Sum** | **~4.07 MB** | **~854 KB** |

Full bundle (3.07 MB / 743 KB) is smaller than chunk sum: Tailwind dedup in single build.

## Cache invalidation (re-download gzip)

| Changed     | Re-download |
| ----------- | ----------- |
| Full bundle | 743 KB      |
| main        | ~851 KB     |
| diff        | ~3 KB       |
