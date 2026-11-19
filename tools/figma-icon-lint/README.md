# HDS Icon & Logo Lint (Figma plugin)

Lints new icon/logo components before they are merged into the main HDS Icons 3.0 file. Designers
self-check on their branch; admins run it as the merge gate. See `figma-icon-lint-plugin-plan.md`.

## Rules: one source of truth

The rules live in `.claude/skills/publish-ds-icon-logo/scripts/lint-rules.mjs`. The CLI
(`lint-page.mjs`) and this plugin both import it. Do not put rule logic in `src/code.js`.

## Geometry checks

Two checks read the vector geometry that `src/plugin-logic.mjs` puts in the dump (`segments`, fill `regions`, `dashPattern`):

- **Error: closed shape with an open stroke.** A vector with a visible fill and stroke whose segments form one closed outline, but whose fill region skips an edge. It exports with a gap in the stroke. Fix: set the fill region to cover every segment. Open fill + stroke geometry is deliberate on 18 shipped icons and is never flagged.
- **Warning: dashed stroke.** Any node with a non-empty `dashPattern`. Figma's SVG export drops `stroke-dasharray` and outlines the dashes as separate segments.

Not yet verified inside Figma: after `npm run build`, re-import `manifest.json` and lint `solid-arrow-up`, `solid-arrow-down` (should pass) and `square-dashed` (should warn).

## Build and test

```bash
cd tools/figma-icon-lint
npm install        # esbuild only; this folder is not part of the pnpm workspace
npm run build      # regenerates src/shipped-names.json from the three name maps, bundles dist/
npm test           # same fixtures through the library and the CLI
```

## Try it

Figma desktop: Plugins > Development > Import plugin from manifest... > `manifest.json`.
Open a branch of the icons file, go to `icons-to-dev` or `brands-to-dev`, run the plugin.

- **Lint selection**: lints the selected component(s); also warns if the name already ships in code.
- **Lint whole page**: lints every component and detects name collisions.
- **About this plugin**: a plain-English explainer at the bottom of the panel, below the admin checklist (what it checks, how to use it, that it only reads the file). It stays visible after Refresh.
- **Refresh** (icon button, canary's `refresh` icon): appears after the first lint and clears the panel back to its blank, just-opened state (results, Copy summary, admin checklist and the shipped-warnings toggle). Use it between assets or after fixing things in Figma, then lint again.

## Styling (design tokens)

The panel uses real Harness tokens without bundling the component library. `npm run gen:tokens`
extracts only the variables the panel uses (about 2.5 KB, with their primitives) from
`packages/core-design-system/dist/styles` into `src/tokens.css`, and the build inlines that into
`dist/ui.html`. Dark mode follows Figma's theme (`themeColors`, `.figma-dark`). `src/tokens.css` is
committed; re-run `gen:tokens` (after building core-design-system) only when you add a token to the
seed list in `scripts/gen-tokens.mjs` or the design system changes.

## Admin review

This plugin replaces the old admin lint skill. An admin (Jared, Katie, Igor, Aaron) updates the
designer's branch from main, runs **Lint whole page** as the gate, ticks the "Review checklist"
list in the panel, then merges the branch in Figma. **Copy summary** puts the errors on the clipboard
to paste back to the designer.

No plugin available? Run the CLI on a page dump instead:
`node .claude/skills/publish-ds-icon-logo/scripts/lint-page.mjs --in page.json` (dump snippet in
`publish-ds-icon-logo/SKILL.md`, Step 2).

## Before publishing to the org

- `manifest.json` carries the plugin id Figma assigned when Jared published it to the Harness org. Keep it unchanged so updates publish to the same plugin.
- Rebuild before each publish so the shipped-names list is current; it is a second safety net, not
  the primary collision check.

## Branch staleness

The plugin API does not expose whether a branch is behind main, so **Lint whole page** uses a heuristic:
the export page is the permanent catalogue, so any shipped name missing from it means the branch is
behind main, or a component was deleted or renamed. The panel shows a (non-blocking) "Branch may be out
of date" warning listing the first few missing names, and Copy summary includes it. Selection runs skip it.
The "update from main first" workflow step is still the real fix.
