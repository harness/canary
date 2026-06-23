import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'

import {
  Breadcrumb,
  Button,
  Card,
  DataTable,
  IconV2,
  Layout,
  Separator,
  StatusBadge,
  Text
} from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'

/**
 * BLESSED TEMPLATE — Dashboard (stat band + recent activity).
 *
 * A summary landing page: location chrome · a band of stat cards (the
 * at-a-glance numbers) · a recent-activity `DataTable`. This is a *page*, not the
 * full shell — reach for the app-shell template if you also need the persistent
 * nav and chat zones; this fills the body slot of one.
 *
 * NO CHARTS. `@harnessio/ui` ships no chart/graph component, so a dashboard here
 * is stat cards + tables, not visualizations. If you need a chart, that's a
 * one-off the system doesn't cover yet — flag it rather than hand-rolling one
 * (→ *default to the system*). Every component here is from `@harnessio/ui` /
 * `@harnessio/views` and verifies clean against the Canary component manifest.
 *
 * Renders at /view-preview/dashboard once copied into the Canary
 * `subjects/prototypes/` dir (auto-discovered — no registry edit).
 *
 * What to edit:
 *   - STATS   → your headline numbers (label · value · delta · icon)
 *   - the recent-activity table → your most-recent records
 */

// Direction (which way the arrow points) and sentiment (good/bad → color) are
// SEPARATE axes — a drop in failures is a down arrow but a *good* thing. Conflating
// them (down = red) misleads (→ *honest status* + *color is never the only signal*).
type Direction = 'up' | 'down' | 'flat'
type Sentiment = 'good' | 'bad' | 'neutral'

const STATS: {
  label: string
  value: string
  delta: string
  direction: Direction
  sentiment: Sentiment
  icon: string
}[] = [
  { label: 'Active services', value: '42', delta: '+3 this week', direction: 'up', sentiment: 'good', icon: 'view-grid' },
  { label: 'Deployments today', value: '18', delta: '+5 vs. yesterday', direction: 'up', sentiment: 'good', icon: 'refresh' },
  { label: 'Failed runs', value: '2', delta: '-1 vs. yesterday', direction: 'down', sentiment: 'good', icon: 'warning-triangle' },
  { label: 'Pending reviews', value: '7', delta: 'No change', direction: 'flat', sentiment: 'neutral', icon: 'clock' }
]

const ARROW: Record<Direction, string> = {
  up: 'arrow-up',
  down: 'arrow-down',
  flat: 'circle'
}

const SENTIMENT_COLOR: Record<Sentiment, 'success' | 'danger' | 'inherit'> = {
  good: 'success',
  bad: 'danger',
  neutral: 'inherit'
}

/** One headline stat. Four across read as a scannable summary band — earn the
 *  density by organizing it (→ *density is a feature*). */
function StatCard({
  label,
  value,
  delta,
  direction,
  sentiment,
  icon
}: {
  label: string
  value: string
  delta: string
  direction: Direction
  sentiment: Sentiment
  icon: string
}): JSX.Element {
  return (
    <Card.Root size="md" interactive={false} className="flex-1">
      <Card.Content>
        <Layout.Vertical gap="xs">
          <Layout.Horizontal gap="2xs" align="center">
            <IconV2 name={icon} size="xs" color="neutral" />
            <Text variant="caption-single-line-normal" color="foreground-3">
              {label}
            </Text>
          </Layout.Horizontal>
          <Text variant="heading-section" as="p" color="foreground-1">
            {value}
          </Text>
          {/* delta: arrow = direction, color = sentiment, label = the number —
              three signals, so color is never the only one. */}
          <Layout.Horizontal gap="2xs" align="center">
            <IconV2 name={ARROW[direction]} size="2xs" color={SENTIMENT_COLOR[sentiment]} />
            <Text variant="caption-single-line-normal" color="foreground-3">
              {delta}
            </Text>
          </Layout.Horizontal>
        </Layout.Vertical>
      </Card.Content>
    </Card.Root>
  )
}

type RunRow = {
  id: string
  name: string
  trigger: string
  status: 'succeeded' | 'failed' | 'running'
  time: string
}

const runs: RunRow[] = [
  { id: 'r1', name: 'api-gateway · deploy', trigger: 'dave.karow', status: 'succeeded', time: '2h ago' },
  { id: 'r2', name: 'billing-worker · build', trigger: 'CI', status: 'running', time: '5m ago' },
  { id: 'r3', name: 'legacy-exporter · job', trigger: 'schedule', status: 'failed', time: '1d ago' },
  { id: 'r4', name: 'search-indexer · deploy', trigger: 'jared.hawkins', status: 'succeeded', time: '1d ago' }
]

const RUN_STATE: Record<
  RunRow['status'],
  { label: string; theme: 'success' | 'danger' | 'info'; icon: string }
> = {
  succeeded: { label: 'Succeeded', theme: 'success', icon: 'check-circle' },
  failed: { label: 'Failed', theme: 'danger', icon: 'xmark-circle' },
  running: { label: 'Running', theme: 'info', icon: 'refresh' }
}

function makeRunColumns(): ColumnDef<RunRow>[] {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Run',
      enableSorting: true,
      cell: info => (
        <Text variant="body-single-line-strong" color="foreground-1">
          {info.row.original.name}
        </Text>
      )
    },
    {
      id: 'trigger',
      accessorKey: 'trigger',
      header: 'Triggered by',
      enableSorting: true,
      cell: info => (
        <Text variant="body-single-line-normal" color="foreground-2">
          {String(info.getValue())}
        </Text>
      )
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      cell: info => {
        const s = RUN_STATE[info.getValue() as RunRow['status']]
        return (
          <StatusBadge variant="secondary" theme={s.theme} size="sm" icon={s.icon}>
            {s.label}
          </StatusBadge>
        )
      }
    },
    {
      id: 'time',
      accessorKey: 'time',
      header: 'When',
      enableSorting: true,
      cell: info => (
        <Text variant="caption-single-line-normal" color="foreground-3">
          {String(info.getValue())}
        </Text>
      )
    }
  ]
}

export default function DashboardTemplate(): JSX.Element {
  const columns = useMemo(() => makeRunColumns(), [])

  return (
    <SandboxLayout.Main className="min-h-screen bg-cn-1">
      <SandboxLayout.Content className="py-cn-xl">
        <Layout.Vertical gap="xl">
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
                  <Breadcrumb.Page>Dashboard</Breadcrumb.Page>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
          </Layout.Horizontal>

          {/* Title row */}
          <Layout.Horizontal justify="between" align="center">
            <Text variant="heading-section" as="h1" color="foreground-1">
              Dashboard
            </Text>
            <Button variant="primary" size="md">
              <IconV2 name="plus" />
              New deployment
            </Button>
          </Layout.Horizontal>

          {/* Stat band */}
          <Layout.Horizontal gap="md" align="stretch">
            {STATS.map(s => (
              <StatCard key={s.label} {...s} />
            ))}
          </Layout.Horizontal>

          {/* Recent activity */}
          <Layout.Vertical gap="sm">
            <Text variant="heading-small" as="h2" color="foreground-1">
              Recent runs
            </Text>
            <DataTable<RunRow>
              columns={columns}
              data={runs}
              getRowId={row => row.id}
              size="compact"
              paginationProps={{
                currentPage: 1,
                pageSize: 25,
                totalItems: runs.length,
                goToPage: () => {}
              }}
            />
          </Layout.Vertical>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
