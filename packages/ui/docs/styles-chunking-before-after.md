# Styles chunking: before vs after

This document compares bundle size and behavior before and after splitting `@harnessio/ui` global styles into granular chunks for build optimization.

## Before

- **Single file**: All global styles lived in one `styles.css` (~773 lines of source), imported from `src/index.ts`.
- **Build output**: One `dist/styles.css` consumed as `@harnessio/ui/styles.css`.
- **Consumers**: Every app that used the UI library loaded the full stylesheet up front, regardless of which features (diff, Monaco editor, etc.) were used on the initial route.

### Before: size (representative build)

| File        | Raw size | Gzip size |
| ----------- | -------- | --------- |
| styles.css  | 3.07 MB  | 743 KB    |

---

## After

- **Source**: Styles are split into six domain-based chunks; `styles.css` only aggregates them via `@import`. The main build still emits one **full bundle** (same content as before), so existing imports keep working.
- **Build output**: In addition to `dist/styles.css`, the build emits six chunk files that can be imported separately for smaller initial payloads or better caching.
- **Consumers**: Can keep using `@harnessio/ui/styles.css` (unchanged) or import specific chunks (e.g. `@harnessio/ui/styles/base.css` + `@harnessio/ui/styles/diff.css` only when needed).

### After: full bundle (unchanged behavior)

| File        | Raw size | Gzip size | Notes                    |
| ----------- | -------- | --------- | ------------------------- |
| styles.css  | 3.07 MB  | 743 KB    | Same as before; backward compatible |

### After: granular chunks (optional use)

| Chunk            | File               | Raw size | Gzip size | Typical use              |
| ---------------- | ------------------ | -------- | --------- | ------------------------- |
| base             | styles-base.css    | 4.06 MB  | 849 KB    | Tailwind + design system + fonts; always needed when using chunks |
| utilities        | styles-utilities.css | 3.6 KB | 1.1 KB    | Shared utilities (cards, form, layers, radix select) |
| diff             | styles-diff.css    | 14.2 KB  | 3.0 KB    | Diff/PR views, highlight.js |
| monaco           | styles-monaco.css  | 1.3 KB   | 0.5 KB    | Code/YAML editor overrides |
| layout           | styles-layout.css  | 0.8 KB   | 0.4 KB    | Layout helpers (sidebar, repo files, etc.) |
| overrides        | styles-overrides.css | 1.5 KB | 0.7 KB  | Drawer, studio card      |

**Note:** `styles-base.css` is larger than the full `styles.css` when built as a standalone chunk because it includes the full Tailwind layer output (`@tailwind base/components/utilities`) in that single build. The full bundle is smaller because Tailwind is processed once across all chunks and deduplicated.

---

## Improvements

### 1. **Backward compatibility**

- Existing `import '@harnessio/ui/styles.css'` and MFE loading of the full stylesheet are unchanged.
- Full bundle size (raw and gzip) is the same as before.

### 2. **Caching**

- Granular chunks give better cache reuse: a change only in diff styles invalidates `styles-diff.css`, not the rest.
- Apps that use chunk imports can get smaller cache-invalidation payloads on updates.

### 3. **Lazy loading (optional)**

- Apps can reduce **initial** CSS by loading heavy or route-specific chunks on demand:
  - **diff.css** (~14 KB raw, ~3 KB gzip): load when entering diff/PR views.
  - **monaco.css** (~1.3 KB raw, ~0.5 KB gzip): load when opening code/YAML editor views.
- Example: main bundle imports `base` + `utilities` + `layout` + `overrides`; then dynamically import `diff.css` or `monaco.css` when the user navigates to those features.

### 4. **Build and maintenance**

- Styles are organized by domain (base, utilities, diff, monaco, layout, overrides), which makes it easier to find and change feature-specific CSS.
- Chunk build is automated: `pnpm build` (and `build:ci`) produce both the full bundle and the six chunk files.

---

## Benefits and performance gains

### Network and payload

- **Smaller initial transfer when lazy-loading**: Apps that load only the chunks needed for the first screen avoid downloading diff and Monaco styles up front. That’s ~15.5 KB raw (~3.5 KB gzip) less on the critical path for users who don’t open diff or editor on first load.
- **Parallel requests**: Browsers can fetch multiple smaller chunk files in parallel (within HTTP/2 limits), which can reduce total wall-clock time compared to one large file when combined with caching.
- **Conditional loading**: Routes that never use diff or the code editor can avoid loading `styles-diff.css` and `styles-monaco.css` at all, reducing total bytes and request count for those sessions.

### Caching and cache invalidation

- **Stable chunks**: When only diff styles change, only `styles-diff.css` gets a new hash/URL. Base, utilities, layout, monaco, and overrides stay cached, so repeat visitors re-download a small chunk (~14 KB) instead of the full bundle (~743 KB gzip).
- **Fewer full reloads**: Feature work (e.g. drawer or studio card) only touches `styles-overrides.css`; the rest of the stylesheet can stay cached. That improves effective load time after deployments.
- **Predictable invalidation**: Each chunk maps to a clear domain (diff, monaco, layout, etc.), so teams can reason about which URLs change for a given release.

### Parse time and main thread

- **Less CSS to parse on first paint (with lazy load)**: If diff and Monaco styles are loaded later, the browser parses and applies less CSS during initial load. That can slightly reduce main-thread work and help keep First Contentful Paint (FCP) and Time to Interactive (TTI) stable as the app grows.
- **Deferred work**: Loading `styles-diff.css` and `styles-monaco.css` when the user navigates to diff or editor spreads style parsing and application over time instead of doing it all up front.

### Core Web Vitals and perceived performance

- **LCP**: Delaying non-critical CSS (diff, Monaco) keeps the initial response smaller and can help the browser prioritize layout and render for above-the-fold content, which can support a better LCP.
- **INP / responsiveness**: Less CSS parsed and applied at startup can mean slightly less main-thread blocking during initial load, which can help input responsiveness (INP) on slower devices.
- **Perceived speed**: Users who land on list/detail views and only later open diff or editor get a faster-feeling first load; the extra chunks load in the background when they’re needed.

### Developer experience and maintainability

- **Easier debugging**: Smaller, domain-specific files (e.g. `diff.css`, `monaco.css`) make it easier to locate and fix style issues and to reason about which chunk affects which UI.
- **Safer changes**: Edits in one chunk are less likely to affect unrelated features; layout and overrides are isolated from diff and editor styles.
- **Clear ownership**: Chunk boundaries align with features (diff, Monaco, layout, drawer/studio), which helps with ownership and code reviews.

### Summary of performance gains (when using chunks + lazy load)

| Gain area              | Effect |
| ---------------------- | ------ |
| Initial CSS transfer   | ~3.5 KB gzip less when diff + Monaco are lazy-loaded |
| Cache invalidation     | Only changed chunk re-downloaded (e.g. ~14 KB for diff instead of ~743 KB full bundle) |
| Parse / main thread    | Less CSS parsed at startup when optional chunks are deferred |
| Repeat visit after deploy | Smaller re-download when only one chunk changed |
| Maintainability        | Smaller, domain-scoped files; clearer impact of changes |

These gains apply when apps **opt in** to granular chunk imports and lazy-load `diff.css` and `monaco.css`. Using the full `styles.css` bundle is unchanged in size and behavior.

---

## How to use granular chunks (optional)

**Full bundle (default, same as before):**

```ts
import '@harnessio/ui/styles.css'
```

**Chunk-based (e.g. for lazy-loading diff / Monaco):**

```ts
// Main bundle: base + utilities + layout + overrides
import '@harnessio/ui/styles/base.css'
import '@harnessio/ui/styles/utilities.css'
import '@harnessio/ui/styles/layout.css'
import '@harnessio/ui/styles/overrides.css'

// On route or when opening diff view:
import('@harnessio/ui/styles/diff.css')

// On route or when opening editor view:
import('@harnessio/ui/styles/monaco.css')
```

Package exports:

- `@harnessio/ui/styles.css` → full bundle
- `@harnessio/ui/styles/base.css`
- `@harnessio/ui/styles/utilities.css`
- `@harnessio/ui/styles/diff.css`
- `@harnessio/ui/styles/monaco.css`
- `@harnessio/ui/styles/layout.css`
- `@harnessio/ui/styles/overrides.css`

---

## Size comparison summary

| Metric              | Before   | After (full bundle) | After (chunks available)     |
| ------------------- | -------- | ------------------- | ----------------------------- |
| Full bundle raw     | 3.07 MB  | 3.07 MB (same)      | Same + 6 optional chunk files |
| Full bundle gzip    | 743 KB   | 743 KB (same)      | Same                          |
| Optional lazy load | —        | —                   | diff + monaco ≈ 15.5 KB raw (~3.5 KB gzip) saved on initial load when not needed |

Sizes are from a representative production build; run `pnpm build` in `packages/ui` and inspect `dist/styles*.css` (and gzip) for up-to-date numbers.
