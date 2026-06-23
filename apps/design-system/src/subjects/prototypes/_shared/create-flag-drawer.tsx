import { useState } from 'react'

import {
  Button,
  Drawer,
  Input,
  Layout,
  MultiSelect,
  Select,
  Text,
  Textarea
} from '@harnessio/ui/components'

import type { FlagRow, TrafficType } from './flag-data'

/**
 * Create-a-Feature-Flag drawer — a controlled OVERLAY STATE of the list, not a
 * route. The parent owns `open`; Confirm calls `onCreate` with the new flag and
 * the parent appends it to its list state, then closes. This is what makes the
 * empty → create → populated journey feel like one surface showing more states.
 *
 * Form binding: production wires Form + FormInput.* + Zod (validation on blur/
 * submit, loading Confirm, submit-error Alert, toast.success). Form is not in the
 * manifest, so this composes the typed primitives directly and holds field state
 * locally — enough for the new row to land in the list on Confirm.
 */

const TRAFFIC_OPTIONS = [
  { label: 'User', value: 'user' as TrafficType },
  { label: 'Account', value: 'account' as TrafficType }
]

const TAG_OPTIONS = [
  { id: 'core', key: 'Core' },
  { id: 'backend', key: 'Backend' },
  { id: 'platform', key: 'Platform' },
  { id: 'marketing', key: 'Marketing' }
]

export function CreateFlagDrawer({
  open,
  onOpenChange,
  onCreate
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (flag: FlagRow) => void
}): JSX.Element {
  const [name, setName] = useState('')
  const [traffic, setTraffic] = useState<TrafficType | undefined>(undefined)
  const [tags, setTags] = useState<string[]>([])
  // Honest status: the save is async. `saving` drives the Button's loading state
  // and locks the footer for ~900ms so the create reads as a real backend call,
  // not an instant close that lies about the round-trip.
  const [saving, setSaving] = useState(false)

  // Honest status: Confirm stays disabled until the two required fields are set,
  // so the prototype can't create a half-formed flag.
  const canConfirm = name.trim().length > 0 && Boolean(traffic)

  function reset(): void {
    setName('')
    setTraffic(undefined)
    setTags([])
  }

  function handleConfirm(): void {
    if (!canConfirm || !traffic || saving) return
    setSaving(true)
    const created: FlagRow = {
      id: name.trim(),
      name: name.trim(),
      traffic,
      tags,
      status: 'pre-production',
      pinned: false
    }
    // Simulate the backend round-trip: hold the loading state, then land the row
    // and close the drawer once the "save" resolves.
    window.setTimeout(() => {
      onCreate(created)
      setSaving(false)
      reset()
      onOpenChange(false)
    }, 900)
  }

  return (
    <Drawer.Root
      open={open}
      onOpenChange={next => {
        // Don't let the drawer be dismissed mid-save — the loading footer owns
        // the surface until the round-trip resolves (honest status).
        if (!next && saving) return
        if (!next) reset()
        onOpenChange(next)
      }}
    >
      {/* size="sm" (480px) matches the Figma; forceWithOverlay dims the list so the
          create layer reads as sitting above context (→ *hierarchy earns attention*). */}
      <Drawer.Content size="sm" forceWithOverlay>
        <Drawer.Header>
          <Drawer.Title>Create a Feature Flag</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body>
          <Layout.Vertical gap="lg">
            <Input
              label="Name"
              placeholder="Enter a name"
              caption="Use this name in your code. Once created, the feature flag name cannot be changed."
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <Select
              label="Traffic Type"
              placeholder="Select traffic type"
              options={TRAFFIC_OPTIONS}
              caption="Once created, the traffic type cannot be changed."
              value={traffic}
              onChange={value => setTraffic(value)}
            />

            <MultiSelect
              label="Owners"
              placeholder="Type users or groups"
              options={[
                { id: 'trevor.stuart', key: 'trevor.stuart' },
                { id: 'dave.karow', key: 'dave.karow' }
              ]}
              value={[{ id: 'trevor.stuart', key: 'trevor.stuart', icon: 'account' }]}
              onChange={() => {}}
            />

            <MultiSelect
              label="Tags"
              optional
              placeholder="Add a tag"
              caption="User tags to organize your feature flags by team, feature, or however you'd like."
              options={TAG_OPTIONS}
              value={tags.map(t => ({ id: t.toLowerCase(), key: t }))}
              onChange={opts => setTags(opts.map(o => o.key))}
            />

            <Textarea
              label="Description"
              optional
              placeholder="As best practice, it's always good to add a description to explain the functionality controlled by this feature flag."
            />

            <Layout.Vertical gap="sm">
              <Text variant="heading-small" as="h3" color="foreground-1">
                External objects
              </Text>
              <Select
                label="Jira issues"
                optional
                placeholder="Start typing an issue number"
                options={[]}
                onChange={() => {}}
              />
            </Layout.Vertical>
          </Layout.Vertical>
        </Drawer.Body>

        <Drawer.Footer>
          {/* One primary in the footer — hierarchy earns attention. Disabled until
              the required fields are filled — honest status. */}
          <Layout.Horizontal justify="end" align="center">
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
  )
}
