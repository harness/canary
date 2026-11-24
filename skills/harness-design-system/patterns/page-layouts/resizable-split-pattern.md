Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components` unless a line says
otherwise; check its props in the component's `references/props.json` where one exists,
otherwise in the installed package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# Resizable split

**Use when:** two panels both hold working content and the right balance depends on the task,
such as an editor beside its results or a request beside its response. People drag a handle to
adjust the space between them.

**Do not use when:** one area is primary and the other is supporting detail (use
[main and side columns](./main-and-side-columns-pattern.md)).

**Anatomy:**

1. **`Resizable.PanelGroup`** — `direction="horizontal"` for side-by-side panels. It needs a
   height (a fixed height, a minimum height, or a parent that fills the height), otherwise the
   panels collapse.
2. **`Resizable.Panel`** — each takes `defaultSize` and `minSize` as percentages. The sizes in
   one group add up to 100.
3. **`Resizable.Handle`** — between the panels. `withHandle` shows a grip so the drag target is
   easy to find. See the [Resizable guide](../../resizable/SKILL.md).
4. **Panel content** — each panel fills its area and scrolls on its own, so long content
   scrolls inside the panel and not the page.

**Guidelines.**
- Set `minSize` on every panel, typically 25 to 35, so neither can be dragged shut.
- Give the panel people work in most the larger share: 55 / 45 for a builder and its output,
  40 / 60 for an editor beside results.
- Use `withHandle` when the group is framed or dense. Use the plain handle when a border
  already separates the panels.
- Give each panel its own header with a title and actions, so the split reads as two tools.
- Split only when both panels are useful at the same time.
- Make a panel scroll on its own with `min-h-0 overflow-auto` on `Resizable.Panel`.
- The group needs a height, otherwise the panels collapse. How tall it is, is the consumer's
  choice.

```tsx
import { Breadcrumb, Layout, Page, Resizable, Text } from '@harnessio/ui/components'

<Page.Root>
  <Page.HeaderV2
    breadcrumbs={
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/canary">canary</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Rule editor</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    }
    title="Rule editor"
  />
  <Page.Content>
    <Resizable.PanelGroup direction="horizontal">
      <Resizable.Panel defaultSize={40} minSize={25}>
        <Layout.Vertical gap="md">
          <Text variant="heading-subsection">Rule</Text>
        </Layout.Vertical>
      </Resizable.Panel>
      <Resizable.Handle withHandle />
      <Resizable.Panel defaultSize={60} minSize={25}>
        <Layout.Vertical gap="md">
          <Text variant="heading-subsection">Test results</Text>
        </Layout.Vertical>
      </Resizable.Panel>
    </Resizable.PanelGroup>
  </Page.Content>
</Page.Root>
```

## Do's and Don'ts

- ✅ Set `minSize` on every panel.
- ✅ Give the working panel the larger share.
- ❌ Do not split when one panel is only supporting detail.
- ❌ Do not let a panel's content scroll the page.
- TODO(designer): further rules. The portal doc states only the ones above.

## Accessibility

- The handle takes keyboard focus and shows a focus ring (from the component source).
  TODO(designer): keyboard resize behaviour and what a consumer must provide.

## Known gaps

- `Resizable.Panel` and `PanelGroup` props come from `react-resizable-panels`, not from the
  design system's own props file (the Resizable guide lists only `withHandle`).

Inherits everything in [rules.md](../../rules.md).
