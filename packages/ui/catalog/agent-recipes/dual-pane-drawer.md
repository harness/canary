---
title: Dual-pane drawer
description: Multi-step slide-over using Drawer.DualPane, not DualPaneStepper.
---

- Import `Drawer` from `@harnessio/ui/components`. This is a drawer, not the full-page `DualPaneStepper`.
- Compose `Drawer.Root`, `Drawer.Content`, `Drawer.DualPane`, `Drawer.Rail`, and `Drawer.DualPaneMain`.
- Put `Drawer.Steps` and `Drawer.Step` in the rail. Put the active step body in `Drawer.DualPaneMain`.
- Control the active step with `Drawer.Steps` `value` and `onValueChange`.
- Footer actions use `ButtonLayout` inside `Drawer.Footer`.
- Use Dialog for short confirmations. Use DualPaneStepper for a full-page wizard.
