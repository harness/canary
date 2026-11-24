Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components` unless a line says
otherwise; check its props in the component's `references/props.json` where one exists,
otherwise in the installed package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# Page with section menu

**Use when:** one area has several related sections and the person moves between them, such as
repository or webhook settings. A vertical menu of grouped links sits on the left and the
selected section on the right.

**Do not use when:** the page has one content area (use the [standard page](./standard-page-pattern.md)).
Neither the section menu nor header tabs is limited by count: use as many sections or tabs as
the area needs.
TODO(designer): state the question that decides between header tabs and a section menu. The
portal doc's "four or more" threshold is not a rule.

**Anatomy, top to bottom:**

1. **Page header** — `Page.HeaderV2` with breadcrumbs, title and description, as in the
   [standard page](./standard-page-pattern.md).
2. **Back link** (optional) — above the menu, returns to the parent list. Use it when the area
   was opened from a list, such as a single webhook.
3. **Section menu** — a fixed 228px column of links. The active link is bold with a hover
   background. Related links are grouped, groups are divided by a separator, and a group can
   have a small title. The menu stays in view while the section content scrolls.
4. **Section content** — fills the remaining width. Each section starts with a subsection
   heading, and sections are divided by separators.

The menu is `ContentLayoutWithSidebar`, exported from `@harnessio/views`, not from
`@harnessio/ui/components`. It takes `sidebarMenu` (groups of `{ id, title, to }` items),
`showBackButton`, `backButtonLabel` and `backButtonTo`, and renders `children` beside the menu.
It needs the host's router context for its links.

**Actions.** Where a button sits says what it applies to.
- Buttons in the page header apply to the entire page and all its content.
- Buttons in the section content, when a section menu is present, apply only to that section's
  content. Place them at the top right of the section content.
- A page can have both: page-level actions in the header and section actions in the section
  content.

**Guidelines.**
- Keep link labels short enough for one line: they are truncated, not wrapped.
- Keep destructive actions in their own section at the bottom, separated from regular
  settings.
- Section content has a maximum width so forms stay readable. Empty space to its right is
  intentional: do not stretch fields to fill the page.
- TODO(designer): how a consumer sets that maximum width within `rules.md` (no arbitrary
  values, no `style`). The portal example uses 640px.
- TODO(designer): how this layout combines with header tabs. The portal shows the tabs
  switching top-level areas and the section menu navigating within the selected tab.

```tsx
import { Breadcrumb, Layout, Page, Text } from '@harnessio/ui/components'
import { ContentLayoutWithSidebar } from '@harnessio/views'

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
            <Breadcrumb.Page>Settings</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    }
    title="Settings"
    description="Manage this repository."
  />
  <ContentLayoutWithSidebar
    showBackButton
    backButtonLabel="Back to repositories"
    backButtonTo={() => '/repos'}
    sidebarMenu={[
      { groupId: 'general', items: [{ id: 'general', title: 'General', to: 'general' }] },
      {
        groupId: 'access',
        title: 'Access',
        items: [
          { id: 'rules', title: 'Branch rules', to: 'rules' },
          { id: 'webhooks', title: 'Webhooks', to: 'webhooks' }
        ]
      }
    ]}
  >
    <Layout.Vertical gap="lg">
      <Text variant="heading-subsection">General</Text>
    </Layout.Vertical>
  </ContentLayoutWithSidebar>
</Page.Root>
```

## Do's and Don'ts

- ✅ Group related links and divide the groups with the menu's own separators.
- ✅ Put destructive actions in the last section.
- ✅ Place an action in the header only if it applies to the whole page, and in the section
  content if it applies to that section.
- ❌ Do not stretch form fields across the whole content area.
- ❌ Do not write long menu labels.
- TODO(designer): further rules. The portal doc states only the ones above.

## Accessibility

- TODO(designer): menu keyboard behaviour, current-page announcement, and what a consumer must
  provide.

## Known gaps

- `ContentLayoutWithSidebar` lives in `@harnessio/views`, outside the package this skill
  documents.
- TODO(designer): empty and loading states for the section content.

Inherits everything in [rules.md](../rules.md).
