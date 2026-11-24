Module patterns describe how one product's pages differ from the page layouts. They add no new
components and no new tokens, and they state only what differs. Everything else follows the
layout they build on. Labels, copy, routing, and data fetching are the consuming app's
decision.

# Code repository pages

**Contents**

- [Pages](#pages)
- [Header actions](#header-actions)
- [Known gaps](#known-gaps)

**Use when:** building the repository summary, the pull request detail or the pull request
list. These pages build on the [standard page](../../patterns/page-layouts/standard-page-pattern.md) and
differ from it where this file says so.

## Pages

- Repository summary
- Pull request detail
- Pull request list

## Header actions

These pages are an exception to the standard page's rule of at most three header actions in
the accepted sets. So far they hold fewer header actions, or none, and put their page-level
buttons in a toolbar in the content. This is a pattern seen so far, not a hard rule.

## Known gaps

- What the repository pages may hold in the header is not stated.

Inherits everything in [rules.md](../../rules.md) and the
[standard page](../../patterns/page-layouts/standard-page-pattern.md).
