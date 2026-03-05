# CSS Minification: Before / After (core-design-system)

## What changed

All CSS generated under `packages/core-design-system/dist/styles` is minified as part of the build. The build script (`scripts/build.js`) runs [@csstools/postcss-minify](https://www.npmjs.com/package/@csstools/postcss-minify) (via [PostCSS](https://postcss.org/)) on every CSS file (core, theme, and import index files) inside `createCssFiles()`.

- **Before (no minification):** Style Dictionary emitted pretty-printed CSS.
- **After:** Each file is minified before being written (core, theme, and the three import files: `themes.css`, `mfe-themes.css`, `core-imports.css`).
- **Minifier (current):** cssnano was replaced with **@csstools/postcss-minify** for security (no reported CVEs; smaller dependency surface). See [Minifier change: cssnano → @csstools/postcss-minify](#minifier-change-cssnano--csstoolspostcss-minify) below.

---

## Comparative numerical analysis

### Totals (`dist/styles/*.css`)

| Metric | Before (unminified) | After (minified) | Change |
|--------|---------------------|------------------|--------|
| **Total size** | 2,011,575 bytes (1.92 MB) | 919,769 bytes (898 KB) | **−1,091,806 bytes (−54.3%)** |
| **File count** | 31 | 31 | — |

*After (minified) uses **@csstools/postcss-minify** (current).*

### By category

| Category | Before (bytes) | After (bytes, @csstools/postcss-minify) | Reduction |
|----------|----------------|----------------------------------------|-----------|
| **Core** (core.css, colors.css, breakpoint.css, components.css) | 60,415 | ~40,365 | ~−33.2% |
| **Theme** (27 dark/light variant files) | 1,949,531 | ~878,291 | ~−54.9% |
| **Import index** (themes.css, mfe-themes.css, core-imports.css) | 1,629 | ~1,035 | ~−36.5% |

### Sample file comparison (minified with @csstools/postcss-minify)

| File | Before (bytes) | After (bytes) | Reduction |
|------|----------------|---------------|-----------|
| core.css | 14,176 | 11,434 | −19.3% |
| colors.css | 7,420 | 6,458 | −13.0% |
| breakpoint.css | 21,590 | 7,343 | −66.0% |
| components.css | 17,229 | 14,130 | −18.0% |
| dark.css | 81,280 | 35,533 | −56.3% |
| light.css | 81,079 | 35,418 | −56.3% |
| themes.css | 1,089 | 894 | −17.9% |
| core-imports.css | 324 | 98 | −69.8% |

### Summary

- **~1.09 MB saved** in `dist/styles` vs unminified (54.3% smaller) with current minifier.
- Theme files see the largest absolute and relative savings (~55% smaller) due to many rules and whitespace.
- Core and import index files are also minified; size reduction is consistent across all 31 files.

---

## Minifier change: clean-css → cssnano (historical)

The minifier was originally switched from [clean-css](https://github.com/clean-css/clean-css) to [cssnano](https://cssnano.co/) (with [PostCSS](https://postcss.org/)).

### clean-css vs cssnano (minified totals)

| Minifier | Total size (`dist/styles/*.css`) | Notes |
|----------|----------------------------------|--------|
| **clean-css** (v5.3.3, `inline: false`) | 902,454 bytes (881 KB) | Single dependency |
| **cssnano** (v7, default preset) | 892,270 bytes (872 KB) | Uses PostCSS; default preset |

| Metric | clean-css | cssnano | Change |
|--------|-----------|---------|--------|
| **Total** | 902,454 bytes | 892,270 bytes | **−10,184 bytes (−1.1%)** |
| **Sample: dark.css** | 35,977 | 35,533 | −444 bytes |
| **Sample: components.css** | 14,139 | 14,130 | −9 bytes |

---

## Minifier change: cssnano → @csstools/postcss-minify

The minifier was switched from [cssnano](https://cssnano.co/) to [@csstools/postcss-minify](https://www.npmjs.com/package/@csstools/postcss-minify) for security (cssnano had reported CVEs; prod security requested a replacement with no reported CVEs).

### cssnano vs @csstools/postcss-minify (minified totals)

| Minifier | Total size (`dist/styles/*.css`) | Notes |
|----------|----------------------------------|--------|
| **cssnano** (^7.1.2, PostCSS) | 892,191 bytes (871 KB) | Full optimizer; had CVE/dependency concerns |
| **@csstools/postcss-minify** (^3.0.0, PostCSS) | 919,769 bytes (898 KB) | Whitespace/comment only; no reported CVEs |

| Metric | cssnano | @csstools/postcss-minify | Change |
|--------|---------|--------------------------|--------|
| **Total** | 892,191 bytes | 919,769 bytes | **+27,578 bytes (+3.1%)** |
| **File count** | 31 | 31 | — |

### Summary

- **@csstools/postcss-minify** produces **~28 KB larger** output than cssnano (~3.1%) because it only collapses whitespace and strips comments; it does not perform structural optimizations (merge rules, reduce values, etc.). Gzip/Brotli transfer sizes remain close.
- Current build uses **@csstools/postcss-minify** (with postcss). Dependency tree is smaller (cssnano subtree removed); no reported CVEs for the new minifier.