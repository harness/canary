import { useMemo, useState } from 'react'
import type { ColumnDef, OnChangeFn, SortingState } from '@tanstack/react-table'

import {
  Breadcrumb,
  Button,
  DataTable,
  IconV2,
  Layout,
  MoreActionsTooltip,
  NoData,
  SearchInput,
  Separator,
  StatusBadge,
  Table,
  Tag,
  Text
} from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'

/**
 * BLESSED TEMPLATE — List view (table + empty state).
 *
 * The Harness operational list: page chrome · search/filter toolbar · a sortable
 * `DataTable` of records, with a first-run `NoData` empty state wired underneath.
 * Delete every row in the live preview and the surface falls back to the empty
 * state — one template, two states. Every component is from `@harnessio/ui` /
 * `@harnessio/views` and verifies clean against the Canary component manifest.
 *
 * This is the page-content scaffold with a real table dropped into the body slot.
 * Renders at /view-preview/list-view once copied into the Canary
 * `subjects/prototypes/` dir (auto-discovered — no registry edit).
 *
 * What to edit:
 *   - ResourceRow / seed → your record shape + sample rows
 *   - makeColumns        → your columns (text · Tag · StatusBadge · row actions)
 *   - the toolbar + title → your section's labels and primary action
 */

type ResourceState = 'active' | 'paused' | 'failed' | 'pending'

type ResourceRow = {
  id: string
  name: string
  type: string
  tags: string[]
  status: ResourceState
}

/** State → label + StatusBadge theme + icon. Every colored state carries an icon
 *  so the cell never relies on hue alone (→ *color is never the only signal*).
 *  Icon names are verified against the IconV2 set. */
const STATE: Record<
  ResourceState,
  { label: string; theme: 'success' | 'warning' | 'danger' | 'muted'; icon: string }
> = {
  active: { label: 'Active', theme: 'success', icon: 'check-circle' },
  paused: { label: 'Paused', theme: 'muted', icon: 'pause' },
  failed: { label: 'Failed', theme: 'danger', icon: 'xmark-circle' },
  pending: { label: 'Pending', theme: 'warning', icon: 'circle' }
}

const seed: ResourceRow[] = [
  { id: 'api-gateway', name: 'api-gateway', type: 'Service', tags: ['Core'], status: 'active' },
  { id: 'billing-worker', name: 'billing-worker', type: 'Worker', tags: ['Platform'], status: 'active' },
  { id: 'search-indexer', name: 'search-indexer', type: 'Worker', tags: ['Backend'], status: 'paused' },
  { id: 'legacy-exporter', name: 'legacy-exporter', type: 'Job', tags: [], status: 'failed' },
  { id: 'image-resizer', name: 'image-resizer', type: 'Service', tags: ['Media'], status: 'pending' },
  { id: 'audit-log-shipper', name: 'audit-log-shipper', type: 'Worker', tags: ['Platform', 'Core'], status: 'active' }
]

const rowActions = [
  { title: 'Edit', iconName: 'edit-pencil' as const, onClick: () => {} },
  { title: 'Copy identifier', iconName: 'copy' as const, onClick: () => {} },
  { title: 'Delete', iconName: 'bin' as const, isDanger: true, onClick: () => {} }
]

const COLUMN_LABELS = ['Name', 'Type', 'Tags', 'Status'] as const

function makeColumns(): ColumnDef<ResourceRow>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      cell: info => (
        <Text variant="body-single-line-strong" color="foreground-1">
          {info.row.original.name}
        </Text>
      )
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Type',
      enableSorting: true,
      cell: info => (
        <Text variant="body-single-line-normal" color="foreground-2">
          {String(info.getValue())}
        </Text>
      )
    },
    {
      id: 'tags',
      accessorKey: 'tags',
      header: 'Tags',
      enableSorting: false,
      cell: info => {
        const tags = info.getValue() as string[]
        if (!tags.length) return null
        return (
          <Layout.Horizontal gap="2xs" wrap="wrap" align="center">
            {tags.map(t => (
              <Tag key={t} variant="secondary" theme="gray" size="sm" value={t} />
            ))}
          </Layout.Horizontal>
        )
      }
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      cell: info => {
        const s = STATE[info.getValue() as ResourceState]
        return (
          <StatusBadge variant="secondary" theme={s.theme} size="sm" icon={s.icon}>
            {s.label}
          </StatusBadge>
        )
      }
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      cell: () => (
        <Layout.Horizontal justify="end" align="center" className="w-full">
          <MoreActionsTooltip actions={rowActions} isInTable />
        </Layout.Horizontal>
      )
    }
  ]
}

/** First-run empty state: the column header stays (previews the populated shape)
 *  with a `NoData` in the body whose CTA creates the first record (→ *no dead
 *  ends* — first-run gets a create affordance, not a retry). */
function ListEmpty({ onCreate }: { onCreate: () => void }): JSX.Element {
  return (
    <Table.Root size="compact">
      <Table.Header>
        <Table.Row>
          {COLUMN_LABELS.map(col => (
            <Table.Head key={col}>{col}</Table.Head>
          ))}
          <Table.Head>
            <span className="sr-only">Actions</span>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan={COLUMN_LABELS.length + 1}>
            <NoData
              withBorder={false}
              imageName="no-data-cog"
              title="No resources yet"
              description={[
                'Resources you create will show up here, with their type, tags, and status.'
              ]}
              primaryButton={{ label: 'New resource', icon: 'plus', onClick: onCreate }}
            />
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  )
}

export default function ListViewTemplate(): JSX.Element {
  const [rows, setRows] = useState<ResourceRow[]>(seed)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])
  const columns = useMemo(() => makeColumns(), [])

  const handleSortingChange: OnChangeFn<SortingState> = updater => {
    setSorting(prev => (typeof updater === 'function' ? updater(prev) : updater))
  }

  const isEmpty = rows.length === 0

  return (
    // min-h-screen + bg-cn-1: themed surface fills the frame on a short list.
    <SandboxLayout.Main className="min-h-screen bg-cn-1">
      <SandboxLayout.Content className="py-cn-xl">
        <Layout.Vertical gap="lg">
          {/* Location row */}
          <Layout.Horizontal gap="2xs" align="center">
            <Button variant="ghost" size="sm" iconOnly tooltipProps={{ content: 'Toggle AI chat' }}>
              <IconV2 name="chat-bubble" />
            </Button>
            <Button variant="ghost" size="sm" iconOnly tooltipProps={{ content: 'Toggle panel' }}>
              <IconV2 name="expand-sidebar" />
            </Button>
            <Separator orientation="vertical" className="mx-cn-xs h-cn-md" />
            <Breadcrumb.Root>
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="/section">Section</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Page>Resources</Breadcrumb.Page>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
          </Layout.Horizontal>

          {/* Title row — one primary; demote to outline on the empty state so the
              in-body NoData carries the single filled CTA (→ *hierarchy*). */}
          <Layout.Horizontal justify="between" align="center">
            <Text variant="heading-section" as="h1" color="foreground-1">
              Resources
            </Text>
            <Button
              variant={isEmpty ? 'outline' : 'primary'}
              size="md"
              onClick={() => setRows(seed)}
            >
              <IconV2 name="plus" />
              New resource
            </Button>
          </Layout.Horizontal>

          {/* Toolbar */}
          <Layout.Horizontal gap="sm" align="center">
            <SearchInput placeholder="Search resources" inputContainerClassName="w-[360px]" />
            <Button variant="ghost" size="md">
              <IconV2 name="filter-list" />
              Add filter
            </Button>
          </Layout.Horizontal>

          {isEmpty ? (
            <ListEmpty onCreate={() => setRows(seed)} />
          ) : (
            <DataTable<ResourceRow>
              columns={columns}
              data={rows}
              getRowId={row => row.id}
              size="compact"
              currentSorting={sorting}
              onSortingChange={handleSortingChange}
              paginationProps={{
                currentPage: 1,
                pageSize: 25,
                totalItems: rows.length,
                goToPage: () => {}
              }}
            />
          )}
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
