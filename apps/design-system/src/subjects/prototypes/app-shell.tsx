import {
  Button,
  Card,
  IconV2,
  Layout,
  Sidebar,
  SidebarLayout,
  Text
} from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'

/**
 * BLESSED TEMPLATE — App shell (three-zone).
 *
 * The Harness house pattern: persistent left nav · AI-chat panel · main content.
 * Stamp this when you're starting a full product screen that should sit inside
 * the real app chrome (not just a page-body fragment like the page-content
 * scaffold). Every component here is from `@harnessio/ui` / `@harnessio/views`
 * and verifies clean against the Canary component manifest — keep it that way.
 *
 * What to edit:
 *   - AppNav      → your section's nav items (icon + title + the active one)
 *   - ChatStub    → your assistant surface, or pass `chat={null}` to hide the zone
 *   - MainContent → your screen: the marked slot is where your body goes
 *
 * Renders at /view-preview/app-shell once copied into the Canary
 * `subjects/prototypes/` dir (auto-discovered — no registry edit).
 *
 * SidebarLayout draws its own top Header and requires all three zones; it must
 * sit inside a Sidebar.Provider (the static nav reads sidebar context).
 */

/** Static left nav. Mark exactly one item `active` — no dead ends. */
function AppNav(): JSX.Element {
  return (
    // cn-content-full-height keeps the rail flush with the layout's own header
    // (sizes to viewport minus header) — matches the real SideNav and avoids a
    // full-viewport rail spilling past the bottom edge.
    <Sidebar.Root className="cn-content-full-height">
      <Sidebar.Content>
        <Sidebar.Group label="FEATURE MANAGEMENT">
          <Sidebar.Item icon="dashboard-solid" title="Overview" active />
          <Sidebar.Item icon="feature-flags" title="Feature Flags" />
          <Sidebar.Item icon="view-grid" title="Segments" />
          <Sidebar.Item icon="settings-solid" title="Settings" />
        </Sidebar.Group>
      </Sidebar.Content>
    </Sidebar.Root>
  )
}

/**
 * Placeholder for the AI-chat zone. Kept deliberately light so the three-zone
 * layout is visible without pulling in the full ChatV2 surface — replace it
 * with your real assistant, or pass `chat={null}` to collapse the column.
 */
function ChatStub(): JSX.Element {
  return (
    // Fixed width via inline style: the parent grid track is `auto`, so it sizes
    // to content — an arbitrary `w-[...]` class can't win against it reliably.
    <Layout.Vertical
      gap="md"
      className="h-full border-r p-cn-lg"
      style={{ width: 360 }}
    >
      <Layout.Horizontal justify="between" align="center">
        <Text variant="heading-small" as="h2" color="foreground-1">
          AI Assistant
        </Text>
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          tooltipProps={{ content: 'Collapse chat' }}
        >
          <IconV2 name="expand-sidebar" />
        </Button>
      </Layout.Horizontal>
      <Card.Root size="sm" interactive={false}>
        <Card.Content>
          <Layout.Vertical gap="2xs">
            <Text variant="body-strong" color="foreground-1">
              Ask about your flags
            </Text>
            <Text variant="caption-single-line-normal" color="foreground-3">
              "Which flags changed in production this week?"
            </Text>
          </Layout.Vertical>
        </Card.Content>
      </Card.Root>
      <Text variant="caption-normal" color="foreground-4">
        Stub panel — replace with your assistant surface, or pass{' '}
        <Text variant="caption-normal" as="span" color="foreground-2">
          chat={'{null}'}
        </Text>{' '}
        to hide this zone.
      </Text>
    </Layout.Vertical>
  )
}

/** A compact dashboard stat. Three across read as a scannable summary row. */
function StatCard({
  label,
  value,
  icon
}: {
  label: string
  value: string
  icon: 'feature-flags' | 'group-1' | 'warning-triangle'
}): JSX.Element {
  return (
    <Card.Root size="md" interactive={false} className="flex-1">
      <Card.Content>
        <Layout.Vertical gap="xs">
          <Layout.Horizontal gap="2xs" align="center">
            <IconV2 name={icon} />
            <Text variant="caption-single-line-normal" color="foreground-3">
              {label}
            </Text>
          </Layout.Horizontal>
          <Text variant="heading-section" as="p" color="foreground-1">
            {value}
          </Text>
        </Layout.Vertical>
      </Card.Content>
    </Card.Root>
  )
}

/** The main work area: title row + a summary band + your screen body. */
function MainContent(): JSX.Element {
  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content className="py-cn-xl">
        <Layout.Vertical gap="xl">
          <Layout.Horizontal justify="between" align="center">
            <Text variant="heading-section" as="h1" color="foreground-1">
              Overview
            </Text>
            <Button variant="primary" size="md">
              <IconV2 name="plus" />
              New Feature Flag
            </Button>
          </Layout.Horizontal>

          <Layout.Horizontal gap="md" align="stretch">
            <StatCard label="Active flags" value="42" icon="feature-flags" />
            <StatCard label="Segments" value="8" icon="group-1" />
            <StatCard label="Pending review" value="3" icon="warning-triangle" />
          </Layout.Horizontal>

          {/* ─── Drop your screen body below. ─────────────────────────────── */}
          <Card.Root size="md" interactive={false}>
            <Card.Content>
              <Layout.Vertical gap="xs">
                <Text variant="heading-small" as="h2" color="foreground-1">
                  Your screen body
                </Text>
                <Text variant="body-normal" color="foreground-3">
                  Replace this card with your table, list, form, or detail
                  layout. The shell, nav, and chat zones are already wired.
                </Text>
              </Layout.Vertical>
            </Card.Content>
          </Card.Root>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export default function AppShellTemplate(): JSX.Element {
  return (
    <Sidebar.Provider>
      <SidebarLayout
        sidebar={<AppNav />}
        chat={<ChatStub />}
        mainContent={<MainContent />}
      />
    </Sidebar.Provider>
  )
}
