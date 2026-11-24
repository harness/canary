Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components` unless a line says
otherwise; check its props in the component's `references/props.json` where one exists,
otherwise in the installed package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# Dashboard card layout

**Contents**

- [Anatomy](#anatomy)
- [Scope](#scope)
- [Guidelines](#guidelines)
- [Example](#example)
- [Do's and Don'ts](#dos-and-donts)
- [Accessibility](#accessibility)
- [Known gaps](#known-gaps)

**Use when:** the page is a set of cards: a dashboard, an analytics page or a summary page such
as billing. Cards sit on a 12-column grid.

**Do not use when:** the page is one list or one form (use the
[standard page](./standard-page-pattern.md)).

## Anatomy

1. **Page header** — `Page.HeaderV2` with breadcrumbs, title, description and the page actions
   (such as Refresh). Add tabs when the page has several areas.
2. **Filter bar** (optional) — time range and scope filters that apply to every card.
3. **Card grid** — `Layout.Grid columns={12} gap="sm"`. Cards span whole numbers of columns.

## Scope

This pattern covers the page structure: the header, the filter bar and the grid.
What goes inside a card is out of scope. Cards that show metrics, charts or graphs will have
their own pattern, so this file gives no guidance on card headers, subtitles, KPI cards or
chart sizes.

## Guidelines
- Spans of 3, 4, 6, 8 and 12 cover almost every layout.
- Use `gap="sm"` between cards so the grid reads as one surface.
- Keep page actions in the header, not inside cards. Card menus are for actions on that card.
- Put filters that apply to the whole page in the filter bar. Do not repeat them inside cards.
- Show loading, empty and error states inside the card, so one failed card does not break the
  page. Loading uses a [Skeleton](../../skeleton/SKILL.md).
- Each card's span and the row height are the consumer's choice. Any span is allowed as long
  as the cards sit on the 12-column grid.

## Example

```tsx
import { Breadcrumb, Button, Card, Layout, Page, Text } from '@harnessio/ui/components'

<Page.Root scrollable>
  <Page.HeaderV2
    breadcrumbs={
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/canary">canary</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Dashboard</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    }
    title="Dashboard"
    description="Pipeline health over the last 14 days."
    actions={<Button variant="outline">Refresh</Button>}
  />
  <Page.Content>
    <Layout.Grid columns={12} gap="sm">
      <Card.Root>
        <Card.Title>Card title</Card.Title>
        <Card.Content>
          <Text color="foreground-3">Card content</Text>
        </Card.Content>
      </Card.Root>
    </Layout.Grid>
  </Page.Content>
</Page.Root>
```

## Do's and Don'ts

- ✅ Keep page actions in the header.
- ✅ Put whole-page filters above the grid.
- ❌ Do not repeat page filters inside cards.
- ❌ Do not let one failed card break the page.
- TODO(designer): further rules. The portal doc states only the ones above.

## Accessibility

- TODO(designer): what a consumer must provide at the page level. Card contents are covered by
  the metrics and charts pattern, when it exists.

## Known gaps

- Card contents for metrics and charts are not covered here.
- TODO(designer): link the metrics and charts pattern once it exists.

Inherits everything in [rules.md](../../rules.md).
