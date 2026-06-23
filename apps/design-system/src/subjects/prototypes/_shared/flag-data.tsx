import type { ColumnDef } from '@tanstack/react-table'

import {
  IconV2,
  Layout,
  MoreActionsTooltip,
  NoData,
  StatusBadge,
  Table,
  Tag,
  Text
} from '@harnessio/ui/components'

/**
 * FME → Feature Flag List — shared data + cell rendering.
 *
 * One module so the interactive flow (fme-flag-list-flow) and the rich populated
 * list (fme-flag-list) render rows IDENTICALLY — the column defs, the Tag-vs-
 * StatusBadge split, and the empty state all live here, not duplicated per file.
 */

export type TrafficType = 'user' | 'account'

export type RolloutState =
  | 'pre-production'
  | 'zero-in-production'
  | 'killed'
  | 'internal-testing'
  | 'external-beta'
  | 'ramping'
  | 'released'
  | 'experimenting'
  | 'remove-from-code'

export type FlagRow = {
  id: string
  name: string
  traffic: TrafficType
  tags: string[]
  status: RolloutState
  pinned?: boolean
}

/** State → label + StatusBadge theme + icon. Icon is mandatory on every colored
 *  state so the cell never relies on hue alone (→ *color is never the only signal*).
 *  Icon names verified against the IconV2 SVG set (flag/signal are NOT glyphs —
 *  feature-flags/atom are). */
export const ROLLOUT: Record<
  RolloutState,
  { label: string; theme: 'muted' | 'success' | 'warning' | 'danger' | 'info'; icon: string }
> = {
  'pre-production': { label: 'Pre-production', theme: 'muted', icon: 'circle' },
  'zero-in-production': { label: '0% in Production', theme: 'muted', icon: 'pause' },
  killed: { label: 'Killed', theme: 'danger', icon: 'xmark-circle' },
  'internal-testing': { label: 'Internal Testing', theme: 'info', icon: 'code' },
  'external-beta': { label: 'External Beta', theme: 'info', icon: 'feature-flags' },
  ramping: { label: 'Ramping', theme: 'warning', icon: 'arrow-up' },
  released: { label: '100% Released', theme: 'success', icon: 'check-circle' },
  experimenting: { label: 'Experimenting', theme: 'info', icon: 'atom' },
  'remove-from-code': { label: 'Remove from Code', theme: 'warning', icon: 'warning-triangle' }
}

/** The realistic operational list — the rich reviewable state (all 9 status variants). */
export const seedFlags: FlagRow[] = [
  { id: 'ai-tone-of-voice', name: 'ai-tone-of-voice', traffic: 'user', tags: ['Core'], status: 'pre-production', pinned: true },
  { id: 'new-checkout-flow-v2', name: 'new-checkout-flow-v2', traffic: 'user', tags: [], status: 'zero-in-production', pinned: true },
  { id: 'customer-rewards-beta', name: 'customer-rewards-beta', traffic: 'user', tags: ['Core'], status: 'killed' },
  { id: 'payment-retry-logic', name: 'payment-retry-logic', traffic: 'user', tags: [], status: 'internal-testing' },
  { id: 'enhanced-search-algorithm', name: 'enhanced-search-algorithm', traffic: 'user', tags: ['Backend', 'Core'], status: 'external-beta' },
  { id: 'mobile-push-notifications', name: 'mobile-push-notifications', traffic: 'user', tags: ['Backend'], status: 'external-beta', pinned: true },
  { id: 'a-b-test-pricing-page', name: 'a-b-test-pricing-page', traffic: 'user', tags: ['Marketing'], status: 'ramping' },
  { id: 'multi-currency-support', name: 'multi-currency-support', traffic: 'user', tags: ['Platform'], status: 'released' },
  { id: 'real-time-inventory-sync', name: 'real-time-inventory-sync', traffic: 'user', tags: ['Core'], status: 'experimenting' },
  { id: 'user-onboarding-wizard', name: 'user-onboarding-wizard', traffic: 'user', tags: ['Design'], status: 'remove-from-code' },
  { id: 'api-rate-limiting', name: 'api-rate-limiting', traffic: 'user', tags: ['Platform'], status: 'pre-production' },
  { id: 'fraud-detection-rules', name: 'fraud-detection-rules', traffic: 'account', tags: [], status: 'pre-production' },
  { id: 'session-timeout-extension', name: 'session-timeout-extension', traffic: 'account', tags: ['Core'], status: 'zero-in-production' }
]

const rowActions = [
  { title: 'Edit', iconName: 'edit-pencil' as const, onClick: () => {} },
  { title: 'Copy identifier', iconName: 'copy' as const, onClick: () => {} },
  { title: 'Delete', iconName: 'bin' as const, isDanger: true, onClick: () => {} }
]

export const FLAG_COLUMNS = ['Name', 'Traffic Type', 'Tags', 'Rollout Status'] as const

/** DataTable column defs for the populated list. Wrap in useMemo in the consumer. */
export function makeFlagColumns(): ColumnDef<FlagRow>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      cell: info => {
        const row = info.row.original
        return (
          <Layout.Horizontal gap="2xs" align="center">
            <Text variant="body-single-line-strong" color="foreground-1">
              {row.name}
            </Text>
            {row.pinned ? <IconV2 name="pin" size="xs" color="neutral" /> : null}
          </Layout.Horizontal>
        )
      }
    },
    {
      id: 'traffic',
      accessorKey: 'traffic',
      header: 'Traffic Type',
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
      header: 'Rollout Status',
      enableSorting: true,
      cell: info => {
        const s = ROLLOUT[info.getValue() as RolloutState]
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

/**
 * Empty / first-run state: the column header stays visible (previews the shape of
 * the populated table) with a first-run NoData in the body. The CTA opens the
 * create drawer — first-run gets a create affordance, not a retry (→ *no dead ends*).
 */
export function FlagListEmpty({ onCreate }: { onCreate: () => void }): JSX.Element {
  return (
    <Table.Root size="compact">
      <Table.Header>
        <Table.Row>
          {FLAG_COLUMNS.map(col => (
            <Table.Head key={col}>{col}</Table.Head>
          ))}
          <Table.Head>
            <span className="sr-only">Actions</span>
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan={FLAG_COLUMNS.length + 1}>
            <NoData
              withBorder={false}
              imageName="feature-flags"
              title="Get started with Feature Flags"
              description={[
                'Feature flags allow you to manage and experiment on features in your product.'
              ]}
              primaryButton={{ label: 'New Feature Flag', icon: 'plus', onClick: onCreate }}
            />
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  )
}
