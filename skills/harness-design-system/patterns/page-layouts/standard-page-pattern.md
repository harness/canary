Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components`; check its props in
the component's `references/props.json` where one exists, otherwise in the installed
package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# Standard page

**Contents**

- [Anatomy](#anatomy)
- [Actions](#actions)
- [Header tabs](#header-tabs)
- [Example](#example)
- [Do's and Don'ts](#dos-and-donts)
- [Accessibility](#accessibility)
- [Known gaps](#known-gaps)

**Use when:** building a page that has no special layout need: a header (breadcrumbs, title,
actions) above one content area, such as a list, an overview or a form. It is the baseline the
other page layouts start from.

**Do not use when:** the page needs a different structure: [page with section
menu](./section-menu-page-pattern.md), [main and side columns](./main-and-side-columns-pattern.md),
[resizable split](./resizable-split-pattern.md) or [dashboard card
layout](./dashboard-card-layout-pattern.md).

Use header tabs on the standard page to switch between views of the same subject.

The app shell (the navigation sidebar and the collapsed AI chat rail) is provided by the host
app. A page does not build it.

Every page uses `Page.HeaderV2`. There is no page without it.

## Anatomy

1. **`Page.Root`** — wraps the page. Props: `scrollable`, `maxWidth`.
   - Set `scrollable` so the whole page scrolls and the header sticks to the top.
   - `maxWidth` is `'full'` (the default, fills the width) or `'page'` (centered at the page
     width). Tables and dashboards usually use `'full'`; forms and reading content use
     `'page'`.
2. **`Page.HeaderV2`** — the page header. Holds, in this order:
   - `breadcrumbs`: a `Breadcrumb.Root`.
   - `title`: a string renders as the page's `h1`.
   - `description` (optional): one short line under the title.
   - `actions` (optional): the page's actions, at the end of the title row. See Actions.
   - `tabs` (optional): see Header tabs.
3. **`Page.Content`** — the content area. It fills the width under the header and holds a
   `Table.Root`, a list or a set of cards.
4. **Toolbar** (optional) — search and filters above the content, aligned to the content
   edges.

For a list of entities inside a settings area, with its empty state, see
[settings-list-pattern](../settings-list-pattern.md). It is the content that goes inside
`Page.Content`.

Stack the toolbar and the content with `Layout.Vertical gap="md"`. Do not add margin utilities
between them.

## Actions

Buttons in the page header apply to the entire page and all its content.
- The header holds at most three action components, in any combination, ordered from right to
  left. An optional status indicator, such as "Unsaved changes", can sit with them and does not
  count toward the three.
- The primary action, the rightmost, can be a [split button](../../split-button/SKILL.md).
- An outline action to the left of the primary can also be a split button: a dropdown menu
  button with a downward chevron.
- The accepted sets, each read from right to left, are:
  - primary action, outline action, overflow outline icon button (`...`);
  - outline action, outline action, overflow outline icon button (`...`).
- Pipeline pages and code repository pages are an exception to this set. See
  [pipeline pages](../../modules/pipelines/overview.md) and
  [code repository pages](../../modules/code-repository/overview.md).
- The status indicator is a [StatusBadge](../../status-badge/SKILL.md), usually with
  `variant="status"`. It sits to the left of all the action buttons.

## Header tabs

Use header tabs to switch between views of the same subject. There is
no limit on the number of tabs. The header's own tabs stay underlined
(`tabsVariant="underlined"`, the default). The one exception is on
[Pipeline Studio](../../modules/pipelines/overview.md#pipeline-studio).
- Each tab takes `label` and `value`, and optionally `icon`, `counter`, `badge`, `disabled`
  and `exact`.
- Without `contentTabs`, the tabs navigate between routes. With `contentTabs`, they switch
  content on the same page, and the header sits inside `Tabs.Root`.
- Each tab keeps the same page structure underneath: the header does not change between tabs.
- Choosing route tabs or `contentTabs` is up to the consumer.
- If the page already has header tabs and needs a second set, build the second set as a
  separate [Tabs](../../tabs/SKILL.md) in the page content, with `variant="ghost"` on
  `Tabs.List`.

## Example

```tsx
import {
  Breadcrumb,
  Button,
  Layout,
  Page,
  SearchInput,
  StatusBadge,
  Table,
  Text
} from '@harnessio/ui/components'

<Page.Root scrollable maxWidth="full">
  <Page.HeaderV2
    breadcrumbs={
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/canary">canary</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Pipelines</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    }
    title="Pipelines"
    description="Build, test and deploy this repository."
    actions={<Button variant="primary">Create pipeline</Button>}
  />
  <Page.Content>
    <Layout.Vertical gap="md">
      <Layout.Horizontal justify="between" align="center">
        <SearchInput placeholder="Search pipelines" />
        <Text color="foreground-3">175 pipelines</Text>
      </Layout.Horizontal>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>build-and-test</Table.Cell>
            <Table.Cell>
              <StatusBadge variant="outline" theme="success">
                Succeeded
              </StatusBadge>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Layout.Vertical>
  </Page.Content>
</Page.Root>
```

## Do's and Don'ts

- ✅ Set `scrollable` on `Page.Root` unless the page is a full-height studio.
- ✅ Put actions that apply to the whole page in the header, at most three, from right to left.
- ✅ Put filters and search in a toolbar above the content, not inside it.
- TODO(designer): further rules. The portal doc states only the ones above.

## Accessibility

- A string `title` renders as the page's `h1`, so each page has one top-level heading. Pass a
  string unless the header needs custom title content. Content below the header should start
  at a lower heading level.
- Keyboard behaviour for breadcrumbs and tabs comes from the
  [Breadcrumb](../../breadcrumb/SKILL.md) and [Tabs](../../tabs/SKILL.md) components.

## Known gaps

- Loading: show a [Skeleton](../../skeleton/SKILL.md) in the content area. The header stays.
- Empty: show [NoData](../../no-data/SKILL.md) in the content area. See
  [settings-list-pattern](../settings-list-pattern.md) for an example.

Inherits everything in [rules.md](../../rules.md).
