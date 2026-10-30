# Undefined CSS custom properties in `@harnessio/ui`

Triage of custom properties that `_ds_bundle.css` references (`var(--x)`) but no shipped stylesheet defines. Counted by `ds-bundle/**/*.css` scan: 285 (the validator's `TOKENS_MISSING` reports 219 with a narrower scan). Generated against `@harnessio/ui` 1.5.9.

## Not a gap (217)
- 202 runtime or vendor variables: `--vscode-*` (Monaco), `--radix-*`, `--cn-tw-*` (Tailwind filters), `--diff-view-*`, `--cols`/`--rows`/`--shimmer-spread`, `--cn-stepper-trunk-*`, `--cn-alert-min-h`, `--cn-sidebar-skeleton-width`. Set by a library or inline style at runtime.
- 15 third-party theme names with fallbacks (`--borderColor-*`, `--fgColor-*`, `--base-size-8`, `--separator-border`, `--block-height`, `--color-text-primary`) from the markdown and diff libraries.

## Canary gap (68): referenced, defined nowhere
These render unstyled wherever the shipped CSS is used alone. Unknown whether platformUI defines them elsewhere.

**Likely renames** (a sibling token exists; proposal only, not verified with design):
- `--cn-text-cn-2`/`-3` -> `--cn-text-2`/`-3` (`.cn-alert-info` icon colour)
- `--cn-rounded-cn-2` -> `--cn-rounded-2` (`.rounded`)
- `--cn-toast-max-width` -> `--cn-toast-width` (`.cn-toast`)
- `--cn-ring-error` -> `--cn-ring-danger` (`.shadow-cn-ring-error`)

**No obvious target** (need a design decision): `--cn-spacing-2xs`, `--cn-spacing-none` (Gauge gap), `--cn-state-disabled-text`/`-border` (MultiSelect placeholder), `--cn-icon-danger` (Stepper error), `--cn-chrome-25` (Button focus ring), `--cn-button-size-3xs` (file-tree folder trigger), `--cn-line-height-6-normal`/`-tight` (steppers), `--cn-outline-offset-tight`, `--cn-sticky-header-bg`/`-container-padding`, `--cn-inset-border-width`/`-layout-indent`, `--cn-comp-pipeline-card-canvas-1-bg`/`-2-bg`.

**47 `--cn-set-*`**: `*-solid-bg` for 14 colours (dropdown item indicators), `*-primary-border`/`*-secondary-border` for most colours, `danger|success|warning-soft-bg|soft-text`, `brand-soft-*`, `lime-*`, `*-outline-inner`. Defined siblings use `-primary-bg`/`-outline-border` naming; `solid`/`soft` families appear to be missing from the token build.

## Sync decision
No shim stylesheet. Defining these in the sync would make Claude Design render differently from the shipped components. Fix upstream in `packages/core-design-system` or the component CSS, then re-sync.
