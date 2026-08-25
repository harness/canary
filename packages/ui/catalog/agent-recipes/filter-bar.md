---
title: Filter bar
description: URL-driven filter bar from @harnessio/filters. There is no Canary FilterBar export.
---

- There is no `FilterBar` export in `@harnessio/ui`. Use `@harnessio/filters`.
- Import `createFilters` and parsers from `@harnessio/filters`. Wrap the tree with `RouterContextProvider`.
- `createFilters<T>()` returns a typed `Filters` root with `Filters.Content`, `Filters.Component`, and `Filters.Dropdown`.
- The package is headless: render Canary `TextInput`, `Select`, `Button`, and `IconV2` inside the render props.
- Keep filter values in the URL. Do not invent local-only filter state unless `persistInURL` is false.
- Peer React 17. Do not use React 18-only APIs.
