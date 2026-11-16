# HDS Icon & Logo Lint (Figma plugin)

Lints new icon/logo components before they are merged into the main HDS Icons 3.0 file. Designers
self-check on their branch; admins run it as the merge gate. See `figma-icon-lint-plugin-plan.md`.

## Rules: one source of truth

The rules live in `.claude/skills/publish-ds-icon-logo/scripts/lint-rules.mjs`. The CLI
(`lint-page.mjs`) and this plugin both import it. Do not put rule logic in `src/code.js`.

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

## Admin review

This plugin replaces the old admin lint skill. An admin (Jared, Katie, Igor, Aaron) updates the
designer's branch from main, runs **Lint whole page** as the gate, ticks the "Admin review (by eye)"
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
