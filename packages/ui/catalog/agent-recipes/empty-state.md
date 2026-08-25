---
title: Empty state
description: Use NoData when a list or page has nothing to show.
---

- Import `NoData` from `@harnessio/ui/components`.
- Pass `title` and `description` (an array of strings). Optional `imageName` is a Canary illustration.
- Primary and secondary CTAs are `primaryButton` and `secondaryButton` with a `label`. Use `to` for navigation.
- Do not build a custom empty state from raw HTML, shadcn Card, or lucide-react.
- Set `isDialogTrigger` when the CTA should open a Dialog instead of navigating.
