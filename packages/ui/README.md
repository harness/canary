# Canary UI

Canary UI is Harness' Unified Component Library built on top of Shadcn/Radix and TailwindCSS.

## Packaged documentation

From the repository root, export Button, TextInput and Select without building the documentation site:

```sh
pnpm --filter @harnessio/ui guidance:build
node --test packages/ui/scripts/build-agent-guidance.test.mjs
```

Read the generated files in `packages/ui/agent/components/`. The UI build and `prepack` run the same generator; `agent/` is generated output included in the package, not a second documentation source.

Edit the existing pages under `apps/portal/src/content/docs/components/`. The exporter preserves ordinary Markdown, converts `DocsPage.ComponentExample` into code fences and `DocsPage.PropsTable` into tables, and preserves `Aside` notes. Unsupported MDX or dynamic expressions fail the export rather than disappear. No component example markers are required. The compact setup excerpt still uses the existing `package-guidance` markers in `design-system/usage.mdx`.

The manifest records package version, source hashes and coverage. Each page also supplies one standalone starter example, selected by its existing section (Button: “Default Button”; TextInput/Select: introduction). Exporting every snippet does not certify that every snippet compiles or behaves correctly. The Platform UI reviewer PoC retrieves the three documents and type-checks those three exact starter files against the packed package; it does not validate the remaining live examples.
