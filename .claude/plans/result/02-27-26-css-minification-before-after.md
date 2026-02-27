# CSS Minification: Before / After (core-design-system)

## What changed

All CSS generated under `packages/core-design-system/dist/styles` is now minified as part of the build. The build script (`scripts/build.js`) runs [clean-css](https://github.com/clean-css/clean-css) with `inline: false` on every CSS file (core, theme, and import index files) inside `createCssFiles()`.

- **Before:** Style Dictionary emitted pretty-printed CSS; no minification.
- **After:** Each file is minified before being written (core, theme, and the three import files: `themes.css`, `mfe-themes.css`, `core-imports.css`).

---

## Comparative numerical analysis

### Totals (`dist/styles/*.css`)

| Metric | Before (unminified) | After (minified) | Change |
|--------|---------------------|------------------|--------|
| **Total size** | 2,011,575 bytes (1.92 MB) | 902,454 bytes (881 KB) | **−1,109,121 bytes (−55.1%)** |
| **File count** | 34 | 34 | — |

### By category

| Category | Before (bytes) | After (bytes) | Reduction |
|----------|----------------|---------------|-----------|
| **Core** (core.css, colors.css, breakpoint.css, components.css) | 60,415 | 39,374 | −34.8% |
| **Theme** (27 dark/light variant files) | 1,949,531 | 862,015 | −55.8% |
| **Import index** (themes.css, mfe-themes.css, core-imports.css) | 1,629 | 1,065 | −34.6% |

### Sample file comparison

| File | Before (bytes) | After (bytes) | Reduction |
|------|----------------|---------------|-----------|
| core.css | 14,176 | 11,434 | −19.3% |
| colors.css | 7,420 | 6,458 | −13.0% |
| breakpoint.css | 21,590 | 7,343 | −66.0% |
| components.css | 17,229 | 14,139 | −17.9% |
| dark.css | 81,280 | 35,977 | −55.7% |
| light.css | 81,079 | 35,822 | −55.8% |
| themes.css | 1,089 | 918 | −15.7% |
| core-imports.css | 324 | 102 | −68.5% |

### Summary

- **~1.11 MB saved** in `dist/styles` (55% smaller).
- Theme files see the largest absolute and relative savings (~51% smaller) due to many rules and whitespace.
- Core and import index files are also minified; size reduction is consistent across all 34 files.