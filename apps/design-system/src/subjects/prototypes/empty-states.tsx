import {
  Card,
  IconV2,
  Layout,
  NoData,
  Text
} from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'

/**
 * BLESSED TEMPLATE — Empty states (the NoData trio).
 *
 * Three empty states are three different jobs, and the right CTA differs for
 * each (→ *no dead ends* — every empty view hands the user the next move):
 *
 *   1. First-run  → there's nothing yet. CTA *creates* the first item.
 *   2. Filtered   → there's data, the filter hid it. CTA *clears the filter*
 *                   (a create button here is a dead end — it doesn't address why
 *                   the view is empty).
 *   3. Error      → the fetch failed. CTA is *retry*, with a path to logs/support
 *                   (never a bare error string with no way forward).
 *
 * Shown side by side so the contrast is legible; in a real screen you render ONE
 * of these based on state. Every component is from `@harnessio/ui` and verifies
 * clean against the Canary component manifest. Illustration names (`imageName`)
 * are validated against the illustration set — the verifier can't check them, so
 * a wrong name renders a blank illustration silently.
 *
 * Renders at /view-preview/empty-states once copied into the Canary
 * `subjects/prototypes/` dir (auto-discovered — no registry edit).
 */

/** A labeled frame so each state reads as one of three, not three real screens. */
function StateFrame({
  caption,
  children
}: {
  caption: string
  children: JSX.Element
}): JSX.Element {
  return (
    <Card.Root size="md" interactive={false} className="flex-1">
      <Card.Content>
        <Layout.Vertical gap="md">
          <Layout.Horizontal gap="2xs" align="center">
            <IconV2 name="info-circle" size="xs" color="neutral" />
            <Text variant="caption-single-line-normal" color="foreground-3">
              {caption}
            </Text>
          </Layout.Horizontal>
          {children}
        </Layout.Vertical>
      </Card.Content>
    </Card.Root>
  )
}

export default function EmptyStatesTemplate(): JSX.Element {
  return (
    <SandboxLayout.Main className="min-h-screen bg-cn-1">
      <SandboxLayout.Content className="py-cn-xl">
        <Layout.Vertical gap="xl">
          <Layout.Vertical gap="2xs">
            <Text variant="heading-section" as="h1" color="foreground-1">
              Empty states
            </Text>
            <Text variant="body-normal" color="foreground-3">
              Three jobs, three CTAs — render one based on state. Never a blank
              panel or a dead end.
            </Text>
          </Layout.Vertical>

          <Layout.Horizontal gap="md" align="stretch">
            {/* 1. First-run — create the first item. */}
            <StateFrame caption="First run — nothing created yet">
              <NoData
                withBorder={false}
                imageName="no-data-cog"
                title="No resources yet"
                description={[
                  'Resources you create will show up here, with their type and status.'
                ]}
                primaryButton={{ label: 'New resource', icon: 'plus', onClick: () => {} }}
              />
            </StateFrame>

            {/* 2. Filtered-empty — clear the filter, don't create. */}
            <StateFrame caption="Filtered — data exists, the filter hid it">
              <NoData
                withBorder={false}
                imageName="no-search-magnifying-glass"
                title="No matches"
                description={[
                  'No resources match your current filters.',
                  'Try a broader search or clear the filters to see everything.'
                ]}
                primaryButton={{ label: 'Clear filters', icon: 'filter-list', onClick: () => {} }}
              />
            </StateFrame>

            {/* 3. Error — retry, with a path forward (never a bare error string). */}
            <StateFrame caption="Error — the fetch failed">
              <NoData
                withBorder={false}
                imageName="no-data-error"
                title="Couldn't load resources"
                description={[
                  'Something went wrong fetching this list.',
                  'Retry, or check the status page if it persists.'
                ]}
                primaryButton={{ label: 'Retry', icon: 'refresh', onClick: () => {} }}
                secondaryButton={{ label: 'View status', icon: 'page-search', onClick: () => {} }}
              />
            </StateFrame>
          </Layout.Horizontal>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
