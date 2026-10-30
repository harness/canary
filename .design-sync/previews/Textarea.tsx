import * as React from 'react'
import { Textarea } from '@harnessio/ui'

const col = { padding: 16, width: 440, display: 'flex', flexDirection: 'column' as const, gap: 16 }

export function Basic() {
  return (
    <div style={col}>
      <Textarea label="Description" placeholder="Describe what this pipeline does" />
      <Textarea
        label="Commit message"
        defaultValue={'fix: retry flaky integration tests\n\nWrap the database setup in a retry loop.'}
        caption="Use conventional commit format."
      />
    </div>
  )
}

export function Themes() {
  return (
    <div style={col}>
      <Textarea label="Release notes" defaultValue="TODO" error="Release notes must be at least 20 characters" />
      <Textarea label="Script" defaultValue="rm -rf /tmp/build" warning="This script deletes files." />
    </div>
  )
}

export function WithLimit() {
  return (
    <div style={col}>
      <Textarea label="PR description" maxCharacters={200} defaultValue="Adds a retry policy to the payments client." size="sm" />
      <Textarea label="Disabled" disabled defaultValue="Locked by an administrator." />
    </div>
  )
}
