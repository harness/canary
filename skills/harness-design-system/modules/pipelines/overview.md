Module patterns describe how one product's pages differ from the page layouts. They add no new
components and no new tokens, and they state only what differs. Everything else follows the
layout they build on. Labels, copy, routing, and data fetching are the consuming app's
decision.

# Pipeline pages

**Contents**

- [Pages](#pages)
- [Header actions](#header-actions)
- [Pipeline Studio](#pipeline-studio)
- [Known gaps](#known-gaps)

**Use when:** building the pipeline execution detail page, the executions list or Pipeline
Studio. These pages build on the [standard page](../../patterns/page-layouts/standard-page-pattern.md) and
differ from it where this file says so.

## Pages

- Execution detail
- Executions list
- Pipeline Studio

## Header actions

These pages are an exception to the standard page's rule of at most three header actions in
the accepted sets. What they hold in the header is a pattern seen so far, not a hard rule.

## Pipeline Studio

Pipeline Studio is a full-height studio page. It differs from the standard page in three ways.

- **Tabs.** It is the only place where the header tabs sit inline in the title row, with
  `tabsVariant="ghost"`. Everywhere else the header tabs stay underlined.
- **Canvas.** The canvas fills the height and scrolls inside itself above the footer. Neither
  the footer nor the whole page scrolls.
- **Footer.** There is no footer component in `@harnessio/ui`. The reference is
  `UnifiedPipelineStudioFooter` in `@harnessio/views`: a bar below the canvas with a top
  border. Problem counts and the branch are on the left, and the last edited time and author are
  on the right. The footer holds status, not actions.

## Known gaps

- What the pipeline pages may hold in the header is not stated.
- There is no `Page` footer component, and no recipe for building the footer from
  `@harnessio/ui/components` within `rules.md`.

Inherits everything in [rules.md](../../rules.md) and the
[standard page](../../patterns/page-layouts/standard-page-pattern.md).
