---
title: Dialog with form
description: Modal that collects input with Dialog, TextInput, and a ButtonLayout footer.
---

- Import `Dialog`, `TextInput`, `Button`, and `ButtonLayout` from `@harnessio/ui/components`.
- Compose `Dialog.Root`, `Dialog.Trigger`, `Dialog.Content`, `Dialog.Header`, `Dialog.Body`, and `Dialog.Footer`.
- Put labeled `TextInput` fields in `Dialog.Body`. Do not invent a shadcn `Input`.
- Put footer actions in `ButtonLayout` inside `Dialog.Footer`: secondary or cancel first, primary last.
- Use `Dialog.Close` to dismiss. Use `Button` for the primary action.
- Do not use `Drawer` for a short confirmation or a small form; that is Dialog.
