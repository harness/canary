# Figma Code Connect — Badge Family Pilot

This package contains a Code Connect pilot mapping the badge family (`Tag`,
`StatusBadge`, `CounterBadge`) in `@harnessio/ui` to their components in the
Figma **HDS | Components 3.0** library. Code Connect makes the Figma → code
handoff deterministic: when a designer selects a badge in Dev Mode (or an agent
reads a frame via Figma MCP), it surfaces the real `@harnessio/ui` component and
props instead of a generic guess.

## Why this family

The AI-readiness trials showed agents reliably pick the right component when a
**code** reference exists to copy. The one path with no code to read is the
**Figma-handoff** path — starting from a design frame. Code Connect is the
binding for exactly that path. The badge family is the pilot because its Figma
variants map 1:1 onto the code `cva` config (verified), so the mappings are
high-confidence.

## Files

| File | Figma node | Code component |
|------|-----------|----------------|
| `src/components/tag.figma.tsx` | `1444:10547` (`❖ tag / default`) | `Tag` |
| `src/components/status-badge/status-badge.figma.tsx` | `1293:5995` (`❖ StatusBadge`) | `StatusBadge` |
| `src/components/counter-badge.figma.tsx` | `1782:29559` (`❖ CounterBadge`) | `CounterBadge` |
| `figma.config.json` | — | Code Connect config (React parser) |

Figma `theme` variant options carry an emoji prefix (e.g. `⚫ muted`); each
mapping's `figma.enum` strips it to the code theme name (`muted`).

## Activation — two infra steps this pilot does NOT include

This branch declares `@figma/code-connect` as a devDependency and authors the
mappings, but **cannot install or publish** from a clean solo environment. Two
gated steps remain, both owned by the team:

1. **Registry allow-list.** `pnpm install` currently 401s: `@figma/code-connect`
   is not available through the repo's AWS CodeArtifact upstream
   (`npm-fme`). It must be allow-listed there, or the repo `.npmrc` must permit
   installing it from public npm (`registry.npmjs.org` has `1.4.8`). Until then
   `pnpm --filter @harnessio/ui install` will fail on this dep.

2. **Figma access token + publish.** Publishing uploads mappings to the shared
   HDS Components 3.0 file (not branch-scoped). With `FIGMA_ACCESS_TOKEN` set:
   - `pnpm --filter @harnessio/ui figma:check` — validate mappings (dry run, no upload)
   - `pnpm --filter @harnessio/ui figma:publish` — publish to the Figma file
   - `figma connect publish --label badge-pilot` — publish under a named label
     that coexists with existing mappings (recommended for the pilot; reversible
     via `figma connect unpublish --label badge-pilot`)

## Verifying the benefit (the trial this enables)

Once published, re-run the design-handoff trial: give an agent a Figma badge
frame (no code reference) via Figma MCP and check whether Code Connect steers it
to the correct `@harnessio/ui` component + props. That measures the one path the
earlier doc/code trials could not.
