import {
  Accordion,
  Breadcrumb,
  Button,
  IconV2,
  Layout,
  Link,
  Separator,
  StatusBadge,
  Table,
  Tag,
  Text
} from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'

/**
 * BLESSED TEMPLATE — Detail view (record header + metadata + sections).
 *
 * The Harness record page: a back link · title row with the record name, a
 * status, and one primary action · a metadata grid (the at-a-glance facts) ·
 * collapsible `Accordion` sections for the deeper content. Density is a feature —
 * the metadata grid packs the key facts above the fold and the sections progressively
 * disclose the rest. Every component is from `@harnessio/ui` / `@harnessio/views`
 * and verifies clean against the Canary component manifest.
 *
 * Accordion composition (from the proven fme-overview run): the section label is
 * `Text as="span"` inside `Accordion.Trigger` — the trigger already renders an
 * <h3>, so an `as="h2"`/`as="h3"` label would nest a heading in a heading.
 *
 * Renders at /view-preview/detail-view once copied into the Canary
 * `subjects/prototypes/` dir (auto-discovered — no registry edit).
 *
 * What to edit:
 *   - the title row     → your record name, status, primary action
 *   - METADATA          → your at-a-glance facts (label + value pairs)
 *   - the Accordion items → your sections (overview · activity · config · etc.)
 */

const METADATA: { label: string; value: string; icon: string }[] = [
  { label: 'Type', value: 'Service', icon: 'view-grid' },
  { label: 'Owner', value: 'platform-team', icon: 'account-solid' },
  { label: 'Created', value: 'Mar 4, 2026', icon: 'calendar' },
  { label: 'Last deploy', value: '2h ago', icon: 'clock' }
]

type EventRow = { id: string; event: string; actor: string; time: string }

const activity: EventRow[] = [
  { id: 'e1', event: 'Deployed v2.4.1', actor: 'dave.karow', time: '2h ago' },
  { id: 'e2', event: 'Config updated', actor: 'jared.hawkins', time: '1d ago' },
  { id: 'e3', event: 'Scaled to 4 replicas', actor: 'autoscaler', time: '3d ago' }
]

/** One metadata fact: icon + label above, value below. Four across read as a
 *  scannable summary band (→ *density is a feature*, organized not dumped). */
function MetaItem({
  label,
  value,
  icon
}: {
  label: string
  value: string
  icon: string
}): JSX.Element {
  return (
    <Layout.Vertical gap="2xs">
      <Layout.Horizontal gap="2xs" align="center">
        <IconV2 name={icon} size="xs" color="neutral" />
        <Text variant="caption-single-line-normal" color="foreground-3">
          {label}
        </Text>
      </Layout.Horizontal>
      <Text variant="body-strong" color="foreground-1">
        {value}
      </Text>
    </Layout.Vertical>
  )
}

export default function DetailViewTemplate(): JSX.Element {
  return (
    <SandboxLayout.Main className="min-h-screen bg-cn-1">
      <SandboxLayout.Content className="py-cn-xl">
        <Layout.Vertical gap="xl">
          {/* Location row — breadcrumb back to the list */}
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
                  <Breadcrumb.Link href="/section/resources">Resources</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Page>api-gateway</Breadcrumb.Page>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
          </Layout.Horizontal>

          {/* Title row — record name + status + the one primary action */}
          <Layout.Horizontal justify="between" align="center">
            <Layout.Horizontal gap="sm" align="center">
              <Text variant="heading-section" as="h1" color="foreground-1">
                api-gateway
              </Text>
              <StatusBadge variant="secondary" theme="success" size="sm" icon="check-circle">
                Active
              </StatusBadge>
            </Layout.Horizontal>
            <Layout.Horizontal gap="sm" align="center">
              <Button variant="outline" size="md">
                <IconV2 name="edit-pencil" />
                Edit
              </Button>
              <Button variant="primary" size="md">
                <IconV2 name="refresh" />
                Deploy
              </Button>
            </Layout.Horizontal>
          </Layout.Horizontal>

          {/* Metadata grid — the at-a-glance facts */}
          <Layout.Grid flow="column" gap="xl" className="grid-cols-4">
            {METADATA.map(m => (
              <MetaItem key={m.label} label={m.label} value={m.value} icon={m.icon} />
            ))}
          </Layout.Grid>

          {/* Sections — collapsible, many can be open at once */}
          <Accordion.Root
            type="multiple"
            indicatorPosition="left"
            defaultValue={['overview', 'activity', 'config']}
          >
            <Accordion.Item value="overview">
              <Accordion.Trigger>
                <Text variant="heading-small" as="span" color="foreground-1">
                  Overview
                </Text>
              </Accordion.Trigger>
              <Accordion.Content>
                <Layout.Vertical gap="sm">
                  <Text variant="body-normal" color="foreground-2">
                    The api-gateway routes and authenticates inbound traffic for the
                    platform. It fronts the internal services and applies rate limits,
                    request validation, and auth before forwarding.
                  </Text>
                  <Layout.Horizontal gap="2xs" wrap="wrap" align="center">
                    <Tag variant="secondary" theme="gray" size="sm" value="Core" />
                    <Tag variant="secondary" theme="gray" size="sm" value="Platform" />
                    <Tag variant="secondary" theme="gray" size="sm" value="Edge" />
                  </Layout.Horizontal>
                </Layout.Vertical>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="activity">
              <Accordion.Trigger>
                <Text variant="heading-small" as="span" color="foreground-1">
                  Recent activity
                </Text>
              </Accordion.Trigger>
              <Accordion.Content>
                <Table.Root size="compact">
                  <Table.Header>
                    <Table.Row>
                      <Table.Head>Event</Table.Head>
                      <Table.Head>Actor</Table.Head>
                      <Table.Head>Time</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {activity.map(row => (
                      <Table.Row key={row.id}>
                        <Table.Cell className="font-medium">{row.event}</Table.Cell>
                        <Table.Cell>
                          <Text variant="body-single-line-normal" color="foreground-2">
                            {row.actor}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="caption-single-line-normal" color="foreground-3">
                            {row.time}
                          </Text>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value="config">
              <Accordion.Trigger>
                <Text variant="heading-small" as="span" color="foreground-1">
                  Configuration
                </Text>
              </Accordion.Trigger>
              <Accordion.Content>
                <Layout.Horizontal gap="2xs" align="center">
                  <Text variant="body-normal" color="foreground-3">
                    Environment variables, secrets, and scaling rules live here.
                  </Text>
                  <Link to="/section/resources/api-gateway/config" size="sm">
                    Open configuration
                  </Link>
                </Layout.Horizontal>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
