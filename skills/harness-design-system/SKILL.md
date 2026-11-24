---
name: harness-design-system
description: Rules and component guides for building UI with @harnessio/ui, the Harness design system. Use before writing or reviewing any page or component that imports @harnessio/ui, including questions about which components have usage guidance, their props and variants. Indexes the component guides, page patterns and foundations.
---

# Harness design system

Before writing code, read [rules.md](./rules.md). Then:

## Contents

### Components

[components.md](./components.md) lists every component that has a guide. Each guide lives in its own folder, for example [button/SKILL.md](./button/SKILL.md).

### Patterns

- [settings-list-pattern](./patterns/settings-list-pattern.md): list of entities inside a settings page
- [standard-page-pattern](./patterns/page-layouts/standard-page-pattern.md): standard page with header, tabs and content
- [section-menu-page-pattern](./patterns/page-layouts/section-menu-page-pattern.md): page with a section menu
- [main-and-side-columns-pattern](./patterns/page-layouts/main-and-side-columns-pattern.md): main column beside a side column
- [resizable-split-pattern](./patterns/page-layouts/resizable-split-pattern.md): two resizable panels
- [dashboard-card-layout-pattern](./patterns/page-layouts/dashboard-card-layout-pattern.md): cards on a 12-column grid
- [edit-drawer-pattern](./patterns/edit-drawer-pattern.md): create and edit drawer

Choosing a page layout:

- Standard page: the baseline, with header tabs to switch between views of the same subject.
- Section menu: the page moves between different areas that each have their own content.
- Main and side columns: one task is primary and supporting information stays visible beside it.
- Dashboard card layout: the page is a set of cards or widgets that are independent of each other.
- Resizable split: people should be able to drag the boundary between two areas to give one more room.

### Modules

Pages that differ from the page layouts in one product. Each builds on the layouts above and states only the differences.

- [pipelines](./modules/pipelines/overview.md): execution detail, executions list and Pipeline Studio
- [code-repository](./modules/code-repository/overview.md): repository summary and pull request pages

### Foundations

- [accessibility](./foundations/accessibility.md): WCAG 2.2 rules for interactive controls, focus indicators and status meaning
- [app-setup](./foundations/app-setup.md): what the host app must wire up before components render correctly
- [color-system](./foundations/color-system.md): semantic color tokens, color sets, and light and dark themes
- [shadows](./foundations/shadows.md): the 0 to 6 elevation scale and which layer gets which shadow
- [spacing](./foundations/spacing.md): the 4px-based scale, layout aliases, and padding, margin and gap usage
- [typography](./foundations/typography.md): font families, the type scale, text color hierarchy and truncation
- [visual-primitives](./foundations/visual-primitives.md): when and how to use icons, logos and illustrations
