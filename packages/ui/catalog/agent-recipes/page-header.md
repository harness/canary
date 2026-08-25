---
title: Page header actions
description: Page.Header with primary and secondary actions in ButtonLayout.
---

- Import `Page`, `Button`, `Link`, and `ButtonLayout` from `@harnessio/ui/components`.
- Use `Page.Root` and `Page.Header`. Pass `title` and an optional description.
- Put primary and secondary actions in the `actions` slot. `Page.Header` already wraps them in `ButtonLayout`.
- Secondary or outline `Button` first, primary `Button` last. Use `Link` for navigation, not Button.
- Optional `backLink` uses Canary `Link`. Optional `iconName` is an IconV2 name, never lucide-react.
- Use `Page.HeaderV2` only when the header needs tabs.
