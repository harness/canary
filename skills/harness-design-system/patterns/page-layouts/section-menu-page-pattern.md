Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components` unless a line says
otherwise; check its props in the component's `references/props.json` where one exists,
otherwise in the installed package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# Page with section menu

**Contents**

- [Anatomy](#anatomy)
- [Actions](#actions)
- [Guidelines](#guidelines)
- [Example](#example)
- [Do's and Don'ts](#dos-and-donts)
- [Accessibility](#accessibility)
- [Known gaps](#known-gaps)

**Use when:** one area has several related sections and the person moves between them, such as
repository or webhook settings. A vertical menu of grouped links sits on the left and the
selected section on the right.

**Do not use when:** the page has one content area (use the
[standard page](./standard-page-pattern.md)).

The section menu is not limited by count: use as many sections as the area needs. Tabs switch
between views of the same subject. A section menu moves between different areas that each
have their own content.

## Anatomy

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

## Actions

Where a button sits says what it applies to.
- Buttons in the page header apply to the entire page and all its content.
- Buttons in the section content, when a section menu is present, apply only to that section's
  content. Place them at the top right of the section content.
- A page can have both: page-level actions in the header and section actions in the section
  content.

## Guidelines
- Keep link labels short enough for one line: they are truncated, not wrapped.
- Keep destructive actions in their own section at the bottom, separated from regular
  settings.
- A maximum width for the section content is optional. The design system sets none, so
  whether to set one, and how wide, is the consumer's choice.
- TODO(designer): how this layout combines with header tabs. The portal shows the tabs
  switching top-level areas and the section menu navigating within the selected tab.

## Example

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
- ❌ Do not write long menu labels.
- TODO(designer): further rules. The portal doc states only the ones above.

## Accessibility

- The menu items are links rendered with the host router's `NavLink`, so they use the browser's
  normal link keyboard behaviour. How the active link is announced depends on the host router.
- TODO(designer): whether the menu needs a stated landmark or label. `ContentLayoutWithSidebar`
  adds none.

## Known gaps

- `ContentLayoutWithSidebar` lives in `@harnessio/views`, outside the package this skill
  documents.
- Loading: the menu does not wait for data, so it stays in place. Show a
  [Skeleton](../../skeleton/SKILL.md) in the section content, such as `Skeleton.Form` or
  `Skeleton.List`.
- Empty: show [NoData](../../no-data/SKILL.md) in the section content.

Inherits everything in [rules.md](../../rules.md).
