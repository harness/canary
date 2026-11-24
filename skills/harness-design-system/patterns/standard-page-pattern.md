Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components`; check its props in
the component's `references/props.json` where one exists, otherwise in the installed
package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# Standard page

**Use when:** building a page that has no special layout need: a header (breadcrumbs, title,
actions) above one content area, such as a list, an overview or a form. It is the baseline the
other page layouts start from.

**Do not use when:** the page needs a different structure: [page with section
menu](./section-menu-page-pattern.md), [main and side columns](./main-and-side-columns-pattern.md),
[resizable split](./resizable-split-pattern.md) or [dashboard card
layout](./dashboard-card-layout-pattern.md).
TODO(designer): state the question that separates each one from the standard page.

The app shell (the navigation sidebar and the collapsed AI chat rail) is provided by the host
app. A page does not build it.

Every page uses `Page.HeaderV2`. There is no page without it.

**Anatomy, top to bottom:**

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
5. **Status footer** (optional) — only on full-height studio or editor pages. See Footer.

For a list of entities inside a settings area, with its empty state, see
[settings-list-pattern](./settings-list-pattern.md). It is the content that goes inside
`Page.Content`.

Stack the toolbar and the content with `Layout.Vertical gap="md"`. Do not add margin utilities
between them.

**Actions.** Buttons in the page header apply to the entire page and all its content.
- The header holds at most three action components, in any combination, ordered from right to
  left. An optional status indicator, such as "Unsaved changes", can sit with them and does not
  count toward the three.
- The primary action, the rightmost, can be a [split button](../split-button/SKILL.md).
- An outline action to the left of the primary can also be a split button: a dropdown menu
  button with a downward chevron.
- The accepted sets, each read from right to left, are:
  - primary action, outline action, overflow outline icon button (`...`);
  - outline action, outline action, overflow outline icon button (`...`).
- Pipeline Studio, Code Repository and the pages related to them are an exception to this
  limit. TODO(designer): state what they are allowed to hold, and which pages count as related.
- TODO(designer): which component renders the status indicator, and where it sits relative to
  the buttons.

Create and edit flows open a
drawer (see [edit-drawer-pattern](./edit-drawer-pattern.md)), so a page never needs a footer
for Cancel and Save.

**Header tabs.** Use header tabs to switch between related areas of the same subject. There is
no limit on the number of tabs. Header tabs use the underlined variant by default
(`tabsVariant="underlined"`); `ghost` is the other value.
- Each tab takes `label` and `value`, and optionally `icon`, `counter`, `badge`, `disabled`
  and `exact`.
- Without `contentTabs`, the tabs navigate between routes. With `contentTabs`, they switch
  content on the same page, and the header sits inside `Tabs.Root`.
- Each tab keeps the same page structure underneath: the header does not change between tabs.
- TODO(designer): when to choose route tabs and when to choose `contentTabs`, and when `ghost`
  is allowed.

**Footer.** There is no footer component in `@harnessio/ui`: `Page` exports only `Root`,
`Header`, `HeaderV2` and `Content`.
- Use a footer only on full-height studio or editor pages, such as the pipeline studio and
  the chaos experiment studio. Do not add one to list, overview or form pages.
- The footer holds status, not actions: problem counts, last edited time and author, or the
  current branch. Put the most important status on the left and metadata on the right.
- Keep primary actions in the header.
- The canvas fills the height and scrolls inside itself above the footer. Never the footer,
  and never the whole page.
- TODO(designer): how a consumer builds the footer without a component, within `rules.md`
  (no arbitrary values, no `style`). This needs a component or a stated recipe.

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
- ❌ Do not put actions in a footer.
- ❌ Do not add a footer to a list, overview or form page.
- TODO(designer): further rules. The portal doc states only the ones above.

## Accessibility

- A string `title` renders as the page's `h1`, so each page has one top-level heading. Pass a
  string unless the header needs custom title content.
- TODO(designer): breadcrumb and tab keyboard behaviour, and what a consumer must provide.

## Known gaps

- No footer component (see Footer).
- TODO(designer): whether the pattern needs a stated empty state and loading state for the
  content area.

Inherits everything in [rules.md](../rules.md).
