# Styles chunking: before vs after

Comparison of bundle size and behavior before and after splitting `@harnessio/ui` styles into optional chunks. Chunks live under `dist/styles/` (e.g. `dist/styles/base.css`). All sizes below are minified production builds.

---

## Before vs after

| Metric | Before (single file) | After (full bundle) | After (optional chunks) |
| ------ | -------------------- | -------------------- | ------------------------- |
| Full bundle raw | 3.07 MB | 3.07 MB (unchanged) | Same |
| Full bundle gzip | 743 KB | 743 KB (unchanged) | Same |
| Lazy load (diff + monaco deferred) | — | — | 15.5 KB raw / 3.5 KB gzip off initial |
| Cache invalidation (one file changed) | 743 KB | 743 KB | 0.4–849 KB (chunk only) |

**Before:** One `styles.css` (~773 lines source), one `dist/styles.css`. Every consumer loaded the full sheet up front.

**After:** Full bundle unchanged. Six optional chunks in `dist/styles/`: `base.css`, `utilities.css`, `diff.css`, `monaco.css`, `layout.css`, `overrides.css`. Consumers can keep using `@harnessio/ui/styles.css` or import specific chunks.

---

## Chunk sizes (gzip)

| Chunk | Raw | Gzip | % of full bundle |
| ----- | ----- | ------ | ------------------- |
| base | 4.06 MB | 849 KB | 114% |
| utilities | 3.6 KB | 1.1 KB | 0.15% |
| diff | 14.2 KB | 3.0 KB | 0.40% |
| monaco | 1.3 KB | 0.5 KB | 0.07% |
| layout | 0.8 KB | 0.4 KB | 0.05% |
| overrides | 1.5 KB | 0.7 KB | 0.09% |
| **Sum (all 6)** | **~4.08 MB** | **~857 KB** | — |

Full bundle is smaller than the chunk sum because Tailwind is built once and deduplicated; `base.css` as a standalone chunk includes full Tailwind layers.

---

## Cache invalidation (re-download gzip when only that chunk changes)

| Changed | Re-download |
| ------- | ----------- |
| Full bundle | 743 KB |
| base | 849 KB |
| utilities | 1.1 KB |
| diff | 3.0 KB |
| monaco | 0.5 KB |
| layout | 0.4 KB |
| overrides | 0.7 KB |

---

## Benefits (when using chunks)

- **Backward compatible:** `import '@harnessio/ui/styles.css'` and full-bundle size unchanged.
- **Lazy load:** Defer `diff.css` and `monaco.css` until diff/editor views; ~3.5 KB gzip off critical path.
- **Cache:** Only the changed chunk is re-downloaded (e.g. 3 KB for diff vs 743 KB full bundle).
- **Maintainability:** Domain-scoped files; easier to reason about impact of changes.

---

## Usage

**Full bundle (default):**

```ts
import '@harnessio/ui/styles.css'
```

**Chunks (e.g. lazy diff / Monaco):**

```ts
import '@harnessio/ui/styles/base.css'
import '@harnessio/ui/styles/utilities.css'
import '@harnessio/ui/styles/layout.css'
import '@harnessio/ui/styles/overrides.css'
// When entering diff view:
import('@harnessio/ui/styles/diff.css')
// When opening editor:
import('@harnessio/ui/styles/monaco.css')
```

**Exports:** `@harnessio/ui/styles.css` (full), `@harnessio/ui/styles/base.css`, `utilities.css`, `diff.css`, `monaco.css`, `layout.css`, `overrides.css`.

---

For up-to-date sizes: run `pnpm build` and the style-chunks script in `packages/ui`, then inspect `dist/styles.css` and `dist/styles/*.css`.
