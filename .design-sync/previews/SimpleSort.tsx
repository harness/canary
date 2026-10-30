import * as React from 'react'
import { SimpleSort } from '@harnessio/ui'

const options = [
  { label: 'Last updated', value: 'updated' },
  { label: 'Name', value: 'name' },
  { label: 'Created', value: 'created' }
]

export function Default() {
  return (
    <div style={{ padding: 16 }}>
      <SimpleSort sortOptions={options} defaultSort="updated" onSortChange={() => {}} />
    </div>
  )
}
