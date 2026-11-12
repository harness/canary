Page-level patterns compose existing components. They add no new components and no new
tokens. Every name below is a real export from `@harnessio/ui/components`; check its props in
the component's `references/props.json` where one exists, otherwise in the installed
package's `dist/components.d.ts`.

Labels, copy, routing, and data fetching are the consuming app's decision. This file fixes
structure and components, not wording.

# Settings list page

**Use when:** a settings area lists entities of one kind (for example flag sets, API keys,
webhooks) and the user can create more.

**Anatomy, top to bottom:**

1. **Header row** — `Layout.Horizontal justify="between" align="center"` holding:
   - the page title: `Text variant="heading-subsection"` (or `heading-section` when it is the
     only heading on the page);
   - one primary action: `Button variant="primary"` that opens the create drawer.
     Exactly one primary button per page. The `single-primary-button` check counts per file.
2. **List** — `Table.Root` with `Table.Header` / `Table.Row` / `Table.Head` and
   `Table.Body` / `Table.Row` / `Table.Cell`. Use `DataTable` instead when the list needs
   sorting, selection, or column visibility.
3. **Empty state** — when there are no rows, render `NoData` in place of the table, not
   inside it. Pass `title`, `description` (an array of strings), and `primaryButton` with the
   same action as the header button.

Stack the sections with `Layout.Vertical gap="md"` (or `lg` for looser pages). Do not add
margin utilities between them.

```tsx
<Layout.Vertical gap="md">
  <Layout.Horizontal justify="between" align="center">
    <Text variant="heading-subsection">Flag sets</Text>
    <Button variant="primary" onClick={() => setOpen(true)}>
      Create flag set
    </Button>
  </Layout.Horizontal>

  {rows.length === 0 ? (
    <NoData
      title="No flag sets yet"
      description={['Group flags so they can be targeted together.']}
      primaryButton={{ label: 'Create flag set', onClick: () => setOpen(true) }}
    />
  ) : (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Description</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map(row => (
          <Table.Row key={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.description}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )}
</Layout.Vertical>
```


Both patterns inherit everything in [rules.md](../rules.md).
