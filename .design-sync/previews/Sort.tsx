import * as React from 'react'
import { Sort } from '@harnessio/ui'

const options = [
  { label: 'Name', value: 'name' },
  { label: 'Last updated', value: 'updated' },
  { label: 'Created', value: 'created' },
  { label: 'Stars', value: 'stars' }
]

export function Simple() {
  return (
    <div style={{ padding: 16 }}>
      <Sort.SimpleSort sortOptions={options} defaultSort="updated" />
    </div>
  )
}

export function SimpleDefaultName() {
  return (
    <div style={{ padding: 16 }}>
      <Sort.SimpleSort sortOptions={options} defaultSort="name" />
    </div>
  )
}

export function MultiSort() {
  return (
    <div style={{ padding: 16 }}>
      <Sort.Root sortOptions={options}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Sort.Select displayLabel="Sort" buttonLabel="Add sort" />
          <Sort.MultiSort />
        </div>
      </Sort.Root>
    </div>
  )
}
