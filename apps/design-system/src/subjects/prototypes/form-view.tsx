import { useState } from 'react'

import {
  Breadcrumb,
  Button,
  Drawer,
  IconV2,
  Input,
  Layout,
  MultiSelect,
  Select,
  Separator,
  Text,
  Textarea
} from '@harnessio/ui/components'
import { SandboxLayout } from '@harnessio/views'

/**
 * BLESSED TEMPLATE — Form view (create drawer over a page).
 *
 * The Harness create pattern: a `Drawer` slides over the current page (a list,
 * here) carrying a typed create form — `Input` · `Select` · `MultiSelect` ·
 * `Textarea` — with one filled `primary` Confirm in the footer, disabled until
 * the required fields are set and showing a real loading state on save. The
 * drawer opens by default so the template previews the form; close it to see the
 * page beneath, "New item" reopens it. Every component is from `@harnessio/ui` /
 * `@harnessio/views` and verifies clean against the Canary component manifest.
 *
 * Production wires Form + FormInput.* + Zod (validation, submit-error Alert,
 * toast). `Form` isn't in the manifest, so this composes the typed primitives
 * directly and holds field state locally — enough to prove the create shape.
 *
 * Renders at /view-preview/form-view once copied into the Canary
 * `subjects/prototypes/` dir (auto-discovered — no registry edit).
 *
 * What to edit:
 *   - the fields in Drawer.Body → your form (label · placeholder · caption)
 *   - canConfirm                → your required-field rule (honest status)
 *   - the page beneath          → your real list/detail surface
 */

const TYPE_OPTIONS = [
  { label: 'Service', value: 'service' },
  { label: 'Worker', value: 'worker' },
  { label: 'Job', value: 'job' }
]

const TAG_OPTIONS = [
  { id: 'core', key: 'Core' },
  { id: 'backend', key: 'Backend' },
  { id: 'platform', key: 'Platform' },
  { id: 'media', key: 'Media' }
]

export default function FormViewTemplate(): JSX.Element {
  // Open by default so the rendered template previews the form, not a bare page.
  const [open, setOpen] = useState(true)
  const [name, setName] = useState('')
  const [type, setType] = useState<string | undefined>(undefined)
  // Owners is required and pre-seeded with the current user (a sensible default),
  // but it's a REAL editable field — `onChange` writes state and `canConfirm`
  // checks it. A pre-filled field with a no-op onChange would lie about being
  // editable and required (→ *honest status*); this doesn't.
  const [owners, setOwners] = useState<{ id: string; key: string; icon?: string }[]>([
    { id: 'trevor.stuart', key: 'trevor.stuart', icon: 'account' }
  ])
  const [tags, setTags] = useState<string[]>([])
  // Honest status: the save is async — `saving` drives the Confirm loading state
  // and locks the footer so the create reads as a real round-trip, not a lie.
  const [saving, setSaving] = useState(false)

  // Honest status: Confirm stays disabled until the required fields are set.
  const canConfirm = name.trim().length > 0 && Boolean(type) && owners.length > 0

  function reset(): void {
    setName('')
    setType(undefined)
    setOwners([{ id: 'trevor.stuart', key: 'trevor.stuart', icon: 'account' }])
    setTags([])
  }

  function handleConfirm(): void {
    if (!canConfirm || saving) return
    setSaving(true)
    window.setTimeout(() => {
      setSaving(false)
      reset()
      setOpen(false)
    }, 900)
  }

  return (
    <SandboxLayout.Main className="min-h-screen bg-cn-1">
      <SandboxLayout.Content className="py-cn-xl">
        {/* The page the drawer opens over — kept light on purpose. */}
        <Layout.Vertical gap="lg">
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

          <Layout.Horizontal justify="between" align="center">
            <Text variant="heading-section" as="h1" color="foreground-1">
              Resources
            </Text>
            <Button variant="primary" size="md" onClick={() => setOpen(true)}>
              <IconV2 name="plus" />
              New item
            </Button>
          </Layout.Horizontal>
        </Layout.Vertical>
      </SandboxLayout.Content>

      <Drawer.Root
        open={open}
        onOpenChange={next => {
          // Don't allow dismiss mid-save — the loading footer owns the surface.
          if (!next && saving) return
          if (!next) reset()
          setOpen(next)
        }}
      >
        {/* size="sm" (480px); forceWithOverlay dims the page so the create layer
            reads as sitting above context (→ *hierarchy earns attention*). */}
        <Drawer.Content size="sm" forceWithOverlay>
          <Drawer.Header>
            <Drawer.Title>Create a resource</Drawer.Title>
          </Drawer.Header>

          <Drawer.Body>
            <Layout.Vertical gap="lg">
              <Input
                label="Name"
                placeholder="Enter a name"
                caption="Use this name in your code. Once created, it cannot be changed."
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <Select
                label="Type"
                placeholder="Select a type"
                options={TYPE_OPTIONS}
                caption="Determines how this resource is scheduled and run."
                value={type}
                onChange={value => setType(value)}
              />

              <MultiSelect
                label="Owners"
                placeholder="Type users or groups"
                options={[
                  { id: 'trevor.stuart', key: 'trevor.stuart' },
                  { id: 'dave.karow', key: 'dave.karow' }
                ]}
                value={owners}
                onChange={opts =>
                  setOwners(opts.map(o => ({ id: o.id, key: o.key, icon: 'account' })))
                }
              />

              <MultiSelect
                label="Tags"
                optional
                placeholder="Add a tag"
                caption="Organize resources by team, feature, or however you'd like."
                options={TAG_OPTIONS}
                value={tags.map(t => ({ id: t.toLowerCase(), key: t }))}
                onChange={opts => setTags(opts.map(o => o.key))}
              />

              <Textarea
                label="Description"
                optional
                placeholder="As best practice, add a description to explain what this resource does."
              />
            </Layout.Vertical>
          </Drawer.Body>

          <Drawer.Footer>
            {/* One primary in the footer — hierarchy earns attention. Disabled
                until the required fields are filled — honest status. */}
            <Layout.Horizontal justify="end" align="center" gap="sm">
              <Button
                variant="outline"
                size="md"
                disabled={saving}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={saving}
                disabled={!canConfirm || saving}
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </Layout.Horizontal>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </SandboxLayout.Main>
  )
}
