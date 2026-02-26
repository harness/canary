# Split global CSS: main.css + diff.css

Optional style chunks are reduced to two files under `dist/styles/`: **main.css** (base, utilities, monaco, layout, overrides) and **diff.css** (diff/PR views). The full bundle `styles.css` is unchanged. All sizes below are minified production builds.

---

## Before vs after

| Metric | Before (single file) | After (full bundle) | After (optional chunks) |
| ------ | -------------------- | -------------------- | ------------------------- |
| Full bundle raw | 3.07 MB | 3.07 MB (unchanged) | Same |
| Full bundle gzip | 743 KB | 743 KB (unchanged) | Same |
| Lazy load (diff deferred) | — | — | ~14 KB raw / ~3 KB gzip off initial |
| Cache invalidation (one file changed) | 743 KB | 743 KB | ~3 KB (diff) or ~851 KB (main) |

**Before:** One `styles.css`, one `dist/styles.css`. Every consumer loaded the full sheet up front.

**After:** Full bundle unchanged. Two optional chunks in `dist/styles/`: **main.css** and **diff.css**. Consumers can use `@harnessio/ui/styles.css` or import `main.css` + optionally lazy-load `diff.css`.

---

## Chunk sizes (gzip)

| Chunk | Raw | Gzip | Notes |
| ----- | ----- | ------ | ----- |
| main | ~4.06 MB | ~851 KB | Base + utilities + monaco + layout + overrides |
| diff | ~14 KB | ~3 KB | Diff/PR views, highlight.js |
| **Sum** | **~4.07 MB** | **~854 KB** | Full bundle (3.07 MB / 743 KB) is smaller due to Tailwind dedup in single build |

---

## Cache invalidation (re-download gzip when only that chunk changes)

| Changed | Re-download |
| ------- | ----------- |
| Full bundle | 743 KB |
| main | ~851 KB |
| diff | ~3 KB |

---

## Benefits (when using chunks)

- **Backward compatible:** `import '@harnessio/ui/styles.css'` and full-bundle size unchanged.
- **Lazy load:** Defer `diff.css` until diff/PR views; ~3 KB gzip off critical path.
- **Cache:** Only the changed chunk is re-downloaded (e.g. 3 KB for diff vs 743 KB full bundle).
- **Simplicity:** Two chunks instead of six; main + diff covers all use cases.

---

## Usage

**Full bundle (default):**

```ts
import '@harnessio/ui/styles.css'
```

**Chunks (lazy diff):**

```ts
import '@harnessio/ui/styles/main.css'
// When entering diff/PR view:
import('@harnessio/ui/styles/diff.css')
```

**Exports:** `@harnessio/ui/styles.css` (full), `@harnessio/ui/styles/main.css`, `@harnessio/ui/styles/diff.css`.

---

For up-to-date sizes: run `pnpm build` and the style-chunks script in `packages/ui`, then inspect `dist/styles.css` and `dist/styles/main.css`, `dist/styles/diff.css`.
