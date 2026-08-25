---
name: canary-ui
description: Resolves Canary (@harnessio/ui) components, icons, and examples via the Canary MCP. Use when adding, swapping, or choosing UI components, buttons, dialogs, inputs, links, or icons in this repo. Do not use for restyling existing Canary markup with classes.
---

# Canary UI

Call the **canary** MCP before writing new JSX. Do not install shadcn or `lucide-react`. Do not copy component source into the app.

## When to call tools

- Adding, swapping, or choosing a component → `search_components` first.
- Restyling existing Canary markup with classes → no tool call.
- Snippets → `get_example` only. `get_component` has no example source.
- Unusual Button (or other `hasConstraints`) variants → `validate_props` before committing.
- Icons → `search_icons`, then `<IconV2 name="…" />`.

## Rules

- Import from `@harnessio/ui/components` (hooks/utils as needed).
- `Button` for actions. Canary `Link` for navigation.
- `unreviewed` / `fallback` means use that Canary export. Do not invent a parallel component.
- If `hasConstraints` is true, `validate_props` is authoritative. If it returns `unknown`, follow TypeScript and `get_example`.
