import * as React from 'react'
import { Button, SearchableDropdown } from '@harnessio/ui'

const options = [
  { label: 'main', value: 'main' },
  { label: 'develop', value: 'develop' },
  { label: 'release/2.4', value: 'release-2.4', group: 'Releases' },
  { label: 'release/2.3', value: 'release-2.3', group: 'Releases' }
]

export function Trigger() {
  return (
    <div style={{ padding: 16 }}>
      <SearchableDropdown
        isSearchable
        options={options}
        inputPlaceholder="Search branches"
        displayLabel={<Button variant="outline">Branch: main</Button>}
        onChange={() => {}}
        onReset={() => {}}
        buttonLabel="Clear selection"
      />
    </div>
  )
}
