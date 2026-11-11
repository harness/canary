# Drawer Pattern Guide

**Manifest ID:** `canary.drawer`
**Status:** stable
**Last Updated:** 2026-11-11

> **This file is hand-written judgment only.**
>
> Prop names, enum values, defaults, and tokens live in
> [`drawer.manifest.json`](./drawer.manifest.json) and are published to
> [`drawer.openapi.json`](./drawer.openapi.json), which is **generated**.
> Don't copy them here.

---

## Overview

A drawer is a panel that slides in over the page so the user can create, edit, or inspect one
thing without losing the list behind it. It is a namespace — `Drawer.Root`, `Drawer.Content`,
`Drawer.Header`, `Drawer.Body`, `Drawer.Footer` and a few specialised parts — and the parts
are not optional decoration: the header carries the dialog's accessible name and close
button, the body owns scrolling and padding, the footer pins the actions.

The full create-drawer anatomy, with the form inside it, is in
[`docs/system/page-patterns.md`](../docs/system/page-patterns.md). This file covers the
judgment calls around it.

## Drawer, dialog, or page

| The task                                           | Use                                       |
| -------------------------------------------------- | ----------------------------------------- |
| Confirm or cancel one decision                     | `Dialog` (`AlertDialog` when destructive) |
| Create or edit one entity from a list              | **Drawer**                                |
| Inspect a row's details beside the list            | **Drawer**, no footer                     |
| Several steps, its own URL, or back-button history | A page                                    |

## Do

- **Always build all three inner parts.** `Drawer.Header`, `Drawer.Body`, and (for anything
  with an action) `Drawer.Footer`, in that order inside `Drawer.Content`.
- **Name it with `title`.** The structured header uses the title as the dialog's accessible
  name and renders the close button for you.
- **Set width with `size`.** `sm` or `md` for forms. Pick the smallest size that fits the
  widest field.
- **One primary action in the footer,** inside `ButtonLayout`. Show `loading` on it while the
  request runs rather than disabling the whole drawer.
- **Control it.** Hold `open` in state and pass `onOpenChange`, so the list can close the
  drawer after a successful create and refresh itself.

## Do not

- **Do not set width, padding, or background through `className`.** `w-[480px]` or `p-4` on
  `Drawer.Content` breaks the stack animation and drifts from the tokens.
- **Do not put actions in the body.** A submit button that scrolls away with the form is
  easy to miss; the footer stays pinned.
- **Do not add a second close button.** The header already has one.
- **Do not change `direction`** for a form drawer. Every create/edit drawer opens from the
  right.

## Known gaps

See `knownGaps` in the manifest (DRW-001 to DRW-004). The two that matter most for agents:

- **DRW-002:** only `Drawer.Content`'s props are machine-checked. For `Root`, `Header`,
  `Body`, and `Footer`, read `composition` in the manifest and the shipped
  `dist/components.d.ts`.
- **DRW-004:** nothing enforces one primary button in the footer. Follow the convention.

## Consumer conventions

Button labels, whether a cancel button appears, and dirty-state gating on edit are the
consuming app's decisions. Check the app's own docs before choosing them; this file does not
set them.
