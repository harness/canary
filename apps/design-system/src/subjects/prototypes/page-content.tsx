import {
  Breadcrumb,
  Button,
  IconV2,
  Layout,
  SearchInput,
  Separator,
  Text
} from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'
import type { ReactNode } from 'react'

/**
 * BLESSED TEMPLATE — Page content (the page-body scaffold).
 *
 * The Harness page body, on its own: location row (breadcrumb) · title row with
 * one primary action · filter toolbar · a marked slot for your screen body. NO
 * global nav — this is the content inside the shell, not the shell. Reach for
 * the app-shell template when you need the persistent left nav + chat zones;
 * reach for this when you're filling a single page and the chrome already exists.
 *
 * Every component here is from `@harnessio/ui` / `@harnessio/views` and verifies
 * clean against the Canary component manifest — keep it that way. It's the shape
 * the list-view, form-view, detail-view, and dashboard templates all build on.
 *
 * Renders at /view-preview/page-content once copied into the Canary
 * `subjects/prototypes/` dir (auto-discovered — no registry edit).
 *
 * What to edit:
 *   - LocationRow → your breadcrumb trail (last crumb is the current Page)
 *   - TitleRow    → your page title + the ONE primary action for this view
 *   - Toolbar     → your search + filters (or delete it if the view has none)
 *   - the marked slot → your screen body (table, list, form, detail)
 */

/** Location row: AI-chat + panel toggles, then the breadcrumb trail. */
function LocationRow(): JSX.Element {
  return (
    <Layout.Horizontal gap="2xs" align="center">
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        tooltipProps={{ content: 'Toggle AI chat' }}
      >
        <IconV2 name="chat-bubble" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        tooltipProps={{ content: 'Toggle panel' }}
      >
        <IconV2 name="expand-sidebar" />
      </Button>
      {/* Keep the chrome toggles from blurring into the location trail. */}
      <Separator orientation="vertical" className="mx-cn-xs h-cn-md" />
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/section">Section</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>This page</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </Layout.Horizontal>
  )
}

/**
 * Title row: page heading + the single primary action.
 * One filled `primary` per view — that's *hierarchy earns attention*. If this
 * page has no top-level create action, drop the Button entirely.
 */
function TitleRow(): JSX.Element {
  return (
    <Layout.Horizontal justify="between" align="center">
      <Text variant="heading-section" as="h1" color="foreground-1">
        Page title
      </Text>
      <Button variant="primary" size="md">
        <IconV2 name="plus" />
        Primary action
      </Button>
    </Layout.Horizontal>
  )
}

/**
 * Filter toolbar: search + a filter affordance. Delete it for views that don't
 * filter; keep the search input sized so it doesn't sprawl.
 */
function Toolbar(): JSX.Element {
  return (
    <Layout.Horizontal gap="sm" align="center">
      <SearchInput
        placeholder="Search"
        inputContainerClassName="w-[360px]"
      />
      <Button variant="ghost" size="md">
        <IconV2 name="filter-list" />
        Add filter
      </Button>
    </Layout.Horizontal>
  )
}

export default function PageContentTemplate(): JSX.Element {
  return (
    // min-h-screen + bg-cn-1: the themed surface fills the frame even when the
    // body is short, so a sparse page doesn't expose the unthemed page bg below.
    <SandboxLayout.Main className="min-h-screen bg-cn-1">
      <SandboxLayout.Content className="py-cn-xl">
        <Layout.Vertical gap="lg">
          <LocationRow />
          <TitleRow />
          <Toolbar />

          {/* ─── Drop your screen body below. ───────────────────────────────
              Replace this placeholder with your table, list, form, or detail
              layout. Everything above is the page chrome, already wired. */}
          <Layout.Vertical
            gap="xs"
            align="center"
            justify="center"
            className="rounded-md border border-dashed py-cn-3xl"
          >
            <Text variant="body-strong" color="foreground-2">
              Your screen body
            </Text>
            <Text variant="caption-normal" color="foreground-4">
              Table · list · form · detail — the page chrome above is done.
            </Text>
          </Layout.Vertical>
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
